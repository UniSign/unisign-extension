import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import type { CkbKeypair } from '~/background/services/keyring/ckb/ckb-simple-keyring'
import {
  getAddress,
  signPlainMessage,
  signStructMessage,
  signTransaction,
} from '~/background/services/keyring/ckb/ckb-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { ckb } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

export const type = KeyringType.CkbHD

export class CkbHdKeyring extends BaseHdKeyring {
  static type = type
  type = type

  defaultOpts = {
    mnemonic: '',
    hdPathBase: 'm/44\'/309\'/0\'/0', // full path m/44'/309'/0'/0/0
    numberOfAccounts: 1,
  }

  getAddress = getAddress
  signTransaction = signTransaction
  signPlainMessage = signPlainMessage
  signStructMessage = signStructMessage
  getKeypairFromBuffer (privateKey: Buffer): CkbKeypair {
    return ckb.Keypair.fromBuffer(privateKey)
  }
}
