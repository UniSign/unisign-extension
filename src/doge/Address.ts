import { Buffer } from 'buffer'
import { payments } from 'bitcoinjs-lib'

import { ParamError, ParamErrorCode, util } from '~/core'
import { BTCAddress } from '~/btc'
import { Network } from './const'
import { getNetworkConfig } from './util'

export class Address extends BTCAddress {
  static fromBuffer (publicKey: Buffer): Address {
    return new Address(publicKey)
  }

  static fromHex (publicKey: string): Address {
    return new Address(Buffer.from(publicKey, 'hex'))
  }

  getNetworkConfig = getNetworkConfig

  toNativeSegwitAddress (network = Network.Mainnet): string {
    throw new Error('Method is not accessible.')
  }

  toSegwitAddress (network = Network.Mainnet): string {
    throw new Error('Method is not accessible.')
  }
}
