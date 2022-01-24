import { Buffer } from 'buffer'

import { secp256k1 } from '~/core/crypto'
import { IKeypair, ParamError, ParamErrorCode, util } from '~/core'

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

  static async generate (): Promise<Keypair> {
    return new Keypair(Buffer.from(secp256k1.utils.randomPrivateKey()))
  }
}
