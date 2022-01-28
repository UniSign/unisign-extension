import { Buffer } from 'buffer'
import * as varuint from 'varuint-bitcoin'
import { bech32 } from 'bech32'
import { Psbt } from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'

import {
  crypto,
  IKeypair,
  IStructMessage,
  logger,
  ParamError,
  ParamErrorCode,
  SignProvider as BaseSignProvider,
  util
} from '~/core'
import { INetworkConfig, Network, SegwitType } from './const'
import { hash160, hash256 } from './util'
import { Keypair } from './Keypair'

const { secp256k1 } = crypto
const ECPair = ECPairFactory(ecc)

export abstract class BTCSignProvider extends BaseSignProvider {
  protected network: Network = Network.Mainnet

  abstract getNetworkConfig (network: Network): INetworkConfig
  abstract setKeypairs ({ keypairs }: { keypairs: IKeypair[] }): void

  getKeypair (nth: number): IKeypair {
    return this.keypairs[nth]
  }

  setNetwork (network: Network): void {
    this.network = network
  }

  #hashMessage (message: string): Buffer {
    logger.info(`SignProvider.hashMessage( message: ${message} )`)
    // Get the prefix of message by network.
    const networkConfig = this.getNetworkConfig(this.network)
    const messagePrefix = Buffer.from(networkConfig.messagePrefix, 'utf8')
    // Alloc a buffer of required space.
    const messageBuf = Buffer.from(message, 'utf8')
    const messageVISize = varuint.encodingLength(messageBuf.length)
    const buf = Buffer.allocUnsafe(
      messagePrefix.length + messageVISize + messageBuf.length
    )
    // Write data to the buffer.
    messagePrefix.copy(buf, 0)
    varuint.encode(messageBuf.length, buf, messagePrefix.length)
    messageBuf.copy(buf, messagePrefix.length + messageVISize)

    logger.debug('  Final message to hash:', messageBuf.toString('hex'))

    const hash = hash256(buf)

    logger.debug('  Message hash:', hash.toString('hex'))

    return hash
  }

  #segwitRedeemHash (publicKeyHash: Buffer): Buffer {
    const redeemScript = Buffer.concat([
      Buffer.from('0014', 'hex'),
      publicKeyHash
    ])
    return hash160(redeemScript)
  }

  async verifySignatureWithAddress (address: string, message: string, signature: Buffer): Promise<boolean> {
    logger.info(`SignProvider.verifySignatureWithAddress( address: ${address}, message: ${message}, signature: ${signature.toString('hex')} )`)

    if (signature.length !== 65) throw ParamError.fromCode(ParamErrorCode.SignatureLengthInvalid, 'signature')

    const flagByte = signature.readUInt8(0) - 27
    if (flagByte > 15 || flagByte < 0) {
      throw ParamError.fromCode(ParamErrorCode.SignatureFlagInvalid, 'signature')
    }

    // Parse [BIP-137](https://github.com/bitcoin/bips/blob/master/bip-0137.mediawiki) header from the signature.
    const compressed = !!(flagByte & 12)
    const segwitType = !(flagByte & 8) ? null : (!(flagByte & 4) ? SegwitType.P2SH : SegwitType.Native)
    const recovery = flagByte & 3

    logger.debug(`  Extract header from the signature: compressed: ${util.boolToString(compressed)}, recovery: ${recovery}`)

    // Recover public key from signature.
    const signatureBody = secp256k1.Signature.fromCompact(signature.slice(1))
    const hash = this.#hashMessage(message)
    const point = secp256k1.Point.fromSignature(hash, signatureBody, recovery)
    const publicKey = Buffer.from(point.toRawBytes(compressed))
    const publicKeyHash = hash160(publicKey)

    logger.debug('  The public key recovered from the signature:', publicKey.toString('hex'))
    logger.debug('  The hash of public key:', publicKeyHash.toString('hex'))

    // Extract public key hash or script from the address for verification.
    let actual: Buffer | null
    let expected: Buffer | null
    if (!util.isNil(segwitType)) {
      if (segwitType === SegwitType.Native) {
        actual = publicKeyHash
        const result = bech32.decode(address)
        expected = Buffer.from(bech32.fromWords(result.words.slice(1)))
      }
      else {
        actual = this.#segwitRedeemHash(publicKeyHash)
        expected = crypto.bs58.decode(address)
        if (!util.isNil(expected)) {
          expected = expected.slice(1)
        }
      }
    }
    else {
      actual = publicKeyHash
      expected = crypto.bs58.decode(address)
      if (!util.isNil(expected)) {
        expected = expected.slice(1)
      }
    }

    if (util.isNil(expected)) {
      throw ParamError.fromCode(ParamErrorCode.AddressIsInvalid, 'address')
    }
    else {
      logger.debug(`  The expected: ${expected.toString('hex')}, the actual: ${actual.toString('hex')}`)

      return expected.equals(actual)
    }
  }

  async signPlainMessage (keypair: Keypair, message: string, segwitType?: SegwitType): Promise<Buffer> {
    logger.info(`SignProvider.signPlainMessage( keypair.publicKey: ${keypair.publicKey.toString('hex')}, message: ${message}, segwitType: ${segwitType ?? 'null'} )`)

    const hash = this.#hashMessage(message)
    let [signature, recovery] = await secp256k1.sign(hash, keypair.privateKey, { recovered: true, der: false })
    signature = Buffer.from(signature)

    // Build the header of the signature base on [BIP-137](https://github.com/bitcoin/bips/blob/master/bip-0137.mediawiki) .
    if (!util.isNil(segwitType)) {
      if (segwitType === SegwitType.Native) {
        recovery += 12
      }
      else {
        recovery += 8
      }
    }
    else {
      recovery += 4
    }
    recovery += 27

    const encodedSignature = Buffer.concat([Buffer.alloc(1, recovery), signature])

    logger.debug('  Encoded signature:', encodedSignature.toString('hex'))

    return encodedSignature
  }

  async signStructMessage (keypair: Keypair, message: IStructMessage, segwitType?: SegwitType): Promise<Buffer> {
    logger.info(`SignProvider.signStructMessage( keypair.publicKey: ${keypair.publicKey.toString('hex')}, message: ${JSON.stringify(message)}, segwitType: ${segwitType ?? 'null'} )`)

    const messageJSON = JSON.stringify(message)
    return await this.signPlainMessage(keypair, messageJSON, segwitType)
  }

  async signTransaction (psbtHex: string, returnRawTransaction = false): Promise<string> {
    const networkConfig = this.getNetworkConfig(this.network)
    const psbtBuf = util.hexToBuffer(psbtHex)
    const psbt = Psbt.fromBuffer(psbtBuf, { network: networkConfig })

    // Try to sign the with every keypair.
    for (const keypair of this.keypairs) {
      const ecpair = ECPair.fromPrivateKey(keypair.privateKey)
      try {
        psbt.signAllInputs(ecpair)
      }
      catch (e: any) {
        // Skip the keypairs which can not sign any of the inputs.
        if (!e.toString().includes('No inputs were signed')) {
          throw e
        }
      }
    }

    if (psbt.inputCount <= 0) {
      throw ParamError.fromCode(ParamErrorCode.TransactionHasNoInputs, 'psbtHex')
    }

    for (const i of util.range(psbt.inputCount)) {
      try {
        psbt.finalizeInput(i)
      }
      catch (e: any) {
        if (e.toString().includes('Can not finalize')) {
          throw ParamError.fromCode(ParamErrorCode.TransactionSignFailed, 'psbtHex')
        }
        else {
          throw e
        }
      }
    }

    const buf = returnRawTransaction ? psbt.extractTransaction().toBuffer() : psbt.toBuffer()
    return '0x' + buf.toString('hex')
  }
}
