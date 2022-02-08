import { Buffer } from 'buffer'
import { payments } from 'bitcoinjs-lib'

import { ParamError, ParamErrorCode, util } from '~/core'
import { INetworkConfig, Network } from './const'

export abstract class BTCAddress {
  #publicKey: Buffer

  protected constructor (publicKey: Buffer) {
    this.#publicKey = publicKey
  }

  get publicKey (): Buffer {
    return this.#publicKey
  }

  abstract getNetworkConfig (network: Network): INetworkConfig

  toLegacyAddress (network = Network.Mainnet): string {
    const networkConfig = this.getNetworkConfig(network)
    const { address } = payments.p2pkh({ pubkey: this.publicKey, network: networkConfig })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }

  toNativeSegwitAddress (network = Network.Mainnet): string {
    const networkConfig = this.getNetworkConfig(network)
    const { address } = payments.p2wpkh({ pubkey: this.publicKey, network: networkConfig })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }

  toSegwitAddress (network = Network.Mainnet): string {
    const networkConfig = this.getNetworkConfig(network)
    const { address } = payments.p2sh({
      redeem: payments.p2wpkh({ pubkey: this.publicKey, network: networkConfig })
    })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }
}
