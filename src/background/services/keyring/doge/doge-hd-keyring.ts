import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import type { CkbKeypair } from '~/background/services/keyring/ckb/ckb-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
import { getAddress, signPlainMessage, signStructMessage, signTransaction } from '~/background/services/keyring/doge/doge-simple-keyring'
// @ts-expect-error no type
import { doge } from '~~/libs/unisign-sign-lib/lib/sign.mjs'

const type = KeyringType.DogeHD

export class DogeHdKeyring extends BaseHdKeyring {
  static type = type
  type = type

  defaultOpts = {
    mnemonic: '',
    hdPathBase: 'm/44\'/3\'/0\'/0', // full path m/44'/3'/0'/0/0
    numberOfAccounts: 1,
  }

  getAddress = getAddress
  signTransaction = signTransaction
  signPlainMessage = signPlainMessage
  signStructMessage = signStructMessage
  getKeypairFromBuffer (privateKey: Buffer): CkbKeypair {
    return doge.Keypair.fromBuffer(privateKey)
  }
}
