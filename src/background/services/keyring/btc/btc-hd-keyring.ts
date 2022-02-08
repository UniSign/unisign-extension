import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import { KeyringType } from '~/background/services/keyring/types'
import { getAddress } from '~/background/services/keyring/btc/btc-simple-keyring'

export const type = KeyringType.BtcHD

export class BtcHdKeyring extends BaseHdKeyring {
  static type = type
  type = type

  getAddress = getAddress
}
