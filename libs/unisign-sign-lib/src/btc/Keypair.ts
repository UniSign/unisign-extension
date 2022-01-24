import { Buffer } from 'buffer'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'

import { secp256k1 } from '~/core/crypto'
import { IKeypair, ParamError, ParamErrorCode, util } from '~/core'
import { Network } from './const'
import { getNetworkConfig } from '~/btc/util'
import { Address } from '~/btc/Address'

const ECPair = ECPairFactory(ecc)

export class Keypair implements IKeypair {
  #privateKey: Buffer
  #publicKey: Buffer

  protected constructor (privateKey: Buffer) {
    if (!secp256k1.utils.isValidPrivateKey(privateKey)) {
      throw ParamError.fromCode(ParamErrorCode.PrivateKeyIsInvalid, 'privateKey')
    }

    this.#privateKey = privateKey
    this.#publicKey = Buffer.from(secp256k1.getPublicKey(privateKey, true))
  }

  get privateKey (): Buffer {
    return this.#privateKey
  }

  get publicKey (): Buffer {
    return this.#publicKey
  }

  static fromBuffer (privateKey: Buffer): Keypair {
    return new Keypair(privateKey)
  }

  static fromHex (privateKey: string): Keypair {
    return new Keypair(util.hexToBuffer(privateKey))
  }

  static fromWIF (wif: string): Keypair {
    try {
      const ecpair = ECPair.fromWIF(wif)
      if (util.isNil(ecpair.privateKey)) {
        throw Error()
      }
      else {
        return new Keypair(Buffer.from(ecpair.privateKey))
      }
    }
    catch (e) {
      throw ParamError.fromCode(ParamErrorCode.WIFIsInvalid, 'wif')
    }
  }

  static async generate (): Promise<Keypair> {
    return new Keypair(Buffer.from(secp256k1.utils.randomPrivateKey()))
  }

  toAddress (): Address {
    return Address.fromBuffer(this.#publicKey)
  }

  toWIF (network = Network.Mainnet): string {
    const networkConfig = getNetworkConfig(network)
    return ECPair.fromPrivateKey(this.#privateKey, { network: networkConfig }).toWIF()
  }
}
