import { Buffer } from 'buffer'
import { payments } from 'bitcoinjs-lib'

import { ParamError, ParamErrorCode, util } from '~/core'
import { Network } from './const'
import { getNetworkConfig } from './util'

export class Address {
  #publicKey: Buffer

  protected constructor (publicKey: Buffer) {
    this.#publicKey = publicKey
  }

  get publicKey (): Buffer {
    return this.#publicKey
  }

  static fromBuffer (publicKey: Buffer): Address {
    return new Address(publicKey)
  }

  static fromHex (publicKey: string): Address {
    return new Address(Buffer.from(publicKey, 'hex'))
  }

  toLegacyAddress (network = Network.Mainnet): string {
    const networkConfig = getNetworkConfig(network)
    const { address } = payments.p2pkh({ pubkey: this.#publicKey, network: networkConfig })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }

  toNativeSegwitAddress (network = Network.Mainnet): string {
    const networkConfig = getNetworkConfig(network)
    const { address } = payments.p2wpkh({ pubkey: this.#publicKey, network: networkConfig })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }

  toSegwitAddress (network = Network.Mainnet): string {
    const networkConfig = getNetworkConfig(network)
    const { address } = payments.p2sh({
      redeem: payments.p2wpkh({ pubkey: this.#publicKey, network: networkConfig })
    })
    if (util.isNil(address)) {
      throw ParamError.fromCode(ParamErrorCode.PublicKeyIsInvalid, 'publicKey')
    }
    else {
      return address
    }
  }
}
