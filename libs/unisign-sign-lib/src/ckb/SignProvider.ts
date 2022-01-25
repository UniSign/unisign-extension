import { Buffer } from 'buffer'
import CKB from '@nervosnetwork/ckb-sdk-core'
import * as ckbUtil from '@nervosnetwork/ckb-sdk-utils'

import {
  crypto,
  IKeypair,
  IStructMessage,
  logger,
  ParamError,
  ParamErrorCode,
  SignProvider as BaseSignProvider,
  util,
} from '~/core'
import { EMPTY_WITNESS_ARGS, Network } from './const'
import { Keypair } from './Keypair'
import { fromRPCRawTransaction, toRPCRawTransaction, fromRPCFormatter, hash256 } from './util'

const { secp256k1 } = crypto

export class SignProvider extends BaseSignProvider {
  readonly name: string = 'CKB'

  protected network: Network = Network.Mainnet

  static create ({ keypairs }: { keypairs: IKeypair[] }): SignProvider {
    return new SignProvider({ keypairs })
  }

  getKeypair (nth: number): IKeypair {
    return this.keypairs[nth]
  }

  setKeypairs ({ keypairs }: { keypairs: IKeypair[] }): void {
    this.keypairs = keypairs.map(keypair => {
      if (keypair instanceof Keypair) {
        return keypair
      }

      return Keypair.fromBuffer(keypair.privateKey)
    })
  }

  setNetwork (network: Network): void {
    this.network = network
  }

  #hashMessage (message: string): Buffer {
    const messageHash = crypto.sha256(Buffer.from(message, 'utf-8'))
    const messageHashLength = Buffer.from(messageHash.length.toString(), 'utf-8')
    const magic = Buffer.from('Nervos CKB Signed Message:\n', 'utf-8')
    const magicLength = Buffer.from(magic.length.toString(), 'utf-8')

    return hash256(Buffer.concat([magicLength, magic, messageHashLength, messageHash]))
  }

  async verifySignatureWithAddress (address: string, message: string, encodedSignature: Buffer): Promise<boolean> {
    logger.info(`SignProvider.verifySignatureWithAddress( address: ${address}, message: ${message}, encodedSignature: ${encodedSignature.toString('hex')} )`)

    const recovery = encodedSignature[0]
    const signature = secp256k1.Signature.fromCompact(encodedSignature.slice(1))

    logger.debug(`  Extract header from the signature: recovery: ${recovery}`)

    const hash = this.#hashMessage(message)
    const point = secp256k1.Point.fromSignature(hash, signature, recovery)
    const publicKey = Buffer.from(point.toRawBytes(true))
    const publicKeyHash = Buffer.from(ckbUtil.blake160(publicKey))
    const actual = '0x' + publicKeyHash.toString('hex')

    logger.debug('  The public key recovered from the signature:', '0x' + publicKey.toString('hex'))
    logger.debug('  The hash of public key:', actual)

    const script = ckbUtil.addressToScript(address)
    const expected = util.hexToBuffer(script.args)

    logger.debug(`  The expected: ${script.args}, the actual: ${actual}`)

    return expected.equals(publicKeyHash)
  }

  async signPlainMessage (keypair: Keypair, message: string): Promise<Buffer> {
    logger.info(`SignProvider.signPlainMessage( keypair.publicKey: ${keypair.publicKey.toString('hex')}, message: ${message} )`)

    const hash = this.#hashMessage(message)
    const [signature, recovery] = await secp256k1.sign(hash, keypair.privateKey, { recovered: true, der: false })
    const encodedSignature = Buffer.concat([Buffer.from([recovery]), signature])

    logger.debug('  Encoded signature:', '0x' + encodedSignature.toString('hex'))

    return encodedSignature
  }

  async signStructMessage (keypair: Keypair, message: IStructMessage): Promise<Buffer> {
    logger.info(`SignProvider.signStructMessage( keypair.publicKey: ${keypair.publicKey.toString('hex')}, message: ${JSON.stringify(message)} )`)

    const messageJSON = JSON.stringify(message)
    return await this.signPlainMessage(keypair, messageJSON)
  }

  async signTransaction (cliFormatTx: string): Promise<string> {
    let data: any
    try {
      data = JSON.parse(cliFormatTx)
    }
    catch (e) {
      throw ParamError.fromCode(ParamErrorCode.TransactionFormatIsInvalid, 'cliFormatTx')
    }

    const unsignedTransaction = fromRPCRawTransaction(data.transaction)
    unsignedTransaction.witnesses = new Array(unsignedTransaction.inputs.length).fill(EMPTY_WITNESS_ARGS)

    // The cliFormatTx.cells should include all cells referred by the inputs.
    if (!Array.isArray(data.cells) || unsignedTransaction.inputs.length !== data.cells.length) {
      throw ParamError.fromCode(ParamErrorCode.TransactionCellsNotProvided, 'cliFormatTx')
    }
    const cells: Array<{ outPoint: CKBComponents.OutPoint, lock: CKBComponents.Script }> = data.cells.map((item: any) => {
      const outPoint = fromRPCFormatter.toOutPoint(item.out_point)
      const lock = fromRPCFormatter.toScript(item.cell.lock)

      return { outPoint, lock }
    })

    const keys: Map<string, string> = new Map()
    this.keypairs.forEach((keypair) => {
      const publicKeyHash = '0x' + ckbUtil.blake160(keypair.publicKey, 'hex')
      const matchedCell = cells.find((cell) => {
        return cell.lock.args === publicKeyHash
      })
      if (util.isNil(matchedCell)) {
        throw ParamError.fromCode(ParamErrorCode.TransactionMissingPrivateKeyForSomeInputs, 'cliFormatTx')
      }
      const lockHash = ckbUtil.scriptToHash(matchedCell.lock)

      keys.set(lockHash, '0x' + keypair.privateKey.toString('hex'))
    })

    const ckb = new CKB()
    try {
      const signedTransaction = ckb.signTransaction(keys)(unsignedTransaction, cells)
      return JSON.stringify(toRPCRawTransaction(signedTransaction))
    }
    catch (e: any) {
      if (e.toString().includes('is not found')) {
        throw ParamError.fromCode(ParamErrorCode.TransactionSignFailed, 'cliFormatTx')
      }
      else {
        throw e
      }
    }
  }
}
