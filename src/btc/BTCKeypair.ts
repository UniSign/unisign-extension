import { Buffer } from 'buffer'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'

import { secp256k1 } from '~/core/crypto'
import { IKeypair, ParamError, ParamErrorCode } from '~/core'
import { INetworkConfig, Network } from './const'

const ECPair = ECPairFactory(ecc)

export abstract class BTCKeypair implements IKeypair {
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

  abstract getNetworkConfig (network: Network): INetworkConfig

  toWIF (network = Network.Mainnet): string {
    const networkConfig = this.getNetworkConfig(network)
    return ECPair.fromPrivateKey(this.#privateKey, { network: networkConfig }).toWIF()
  }
}
