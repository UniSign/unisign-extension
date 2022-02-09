import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import { KeyringType } from '~/background/services/keyring/types'
import type { BtcKeypair } from '~/background/services/keyring/btc/btc-simple-keyring'
import { getAddress } from '~/background/services/keyring/btc/btc-simple-keyring'
// @ts-expect-error no type
import { btc } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

const type = KeyringType.BtcHD

export class BtcHdKeyring extends BaseHdKeyring {
  static type = type
  type = type

  getAddress = getAddress
  getKeypairFromBuffer (privateKey: Buffer): BtcKeypair {
    return btc.Keypair.fromBuffer(privateKey)
  }
}
