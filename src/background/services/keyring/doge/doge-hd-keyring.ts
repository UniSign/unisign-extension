import { BaseHdKeyring } from '~/background/services/keyring/base/base-hd-keyring'
import { KeyringType } from '~/background/services/keyring/types'
import { getAddress, signPlainMessage, signStructMessage, signTransaction } from '~/background/services/keyring/doge/doge-simple-keyring'

export const type = KeyringType.DogeHD

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
}
