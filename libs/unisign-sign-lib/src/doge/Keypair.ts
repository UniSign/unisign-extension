import { Buffer } from 'buffer'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'

import { secp256k1 } from '~/core/crypto'
import { ParamError, ParamErrorCode, util } from '~/core'
import { BTCKeypair, INetworkConfig, Network } from '~/btc'
import { getNetworkConfig } from './util'
import { Address } from './Address'

const ECPair = ECPairFactory(ecc)

export class Keypair extends BTCKeypair {
  static fromBuffer (privateKey: Buffer): Keypair {
    return new Keypair(privateKey)
  }

  static fromHex (privateKey: string): Keypair {
    return new Keypair(util.hexToBuffer(privateKey))
  }

  static fromWIF (wif: string, network: Network): Keypair {
    try {
      const ecpair = ECPair.fromWIF(wif, getNetworkConfig(network))
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

  getNetworkConfig = getNetworkConfig

  toAddress (): Address {
    return Address.fromBuffer(this.publicKey)
  }
}
