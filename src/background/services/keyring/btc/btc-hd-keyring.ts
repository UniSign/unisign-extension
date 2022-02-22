import type { BaseHdKeyringOpts } from '~/background/services/keyring/base/base-hd-keyring'
import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import { KeyringType } from '~/background/services/keyring/types'
import type { BtcKeypair } from '~/background/services/keyring/btc/btc-simple-keyring'
import { getAddress } from '~/background/services/keyring/btc/btc-simple-keyring'
// @ts-expect-error no type
import { btc } from '~~/libs/unisign-sign-lib/dist/sign.cjs.js'

const type = KeyringType.BtcHD

export class BtcHdKeyring extends BaseHdKeyring {
  static type = type
  type = type

  defaultOpts: BaseHdKeyringOpts = {
    mnemonic: '',
    numberOfAccounts: 1,
    hdPathBase: 'm/84\'/0\'/0\'/0', // full path m/84'/0'/0'/0/0
    // hdPathBase: '84\'/1\'/0\'/0', // xChain full path m/84'/0'/0'/0/0
  }

  getAddress = getAddress
  getKeypairFromBuffer (privateKey: Buffer): BtcKeypair {
    return btc.Keypair.fromBuffer(privateKey)
  }
}
