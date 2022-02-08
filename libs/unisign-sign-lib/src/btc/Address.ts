import { Buffer } from 'buffer'

import { getNetworkConfig } from './util'
import { BTCAddress } from './BTCAddress'

export class Address extends BTCAddress {
  static fromBuffer (publicKey: Buffer): Address {
    return new Address(publicKey)
  }

  static fromHex (publicKey: string): Address {
    return new Address(Buffer.from(publicKey, 'hex'))
  }

  getNetworkConfig = getNetworkConfig
}
