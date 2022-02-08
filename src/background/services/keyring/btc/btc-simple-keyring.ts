import type { BaseKeypair } from '~/background/services/keyring/base/base-simple-keyring'
import { BaseSimpleKeyring } from '~/background/services/keyring/base/base-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'

export interface BtcKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => {
    toNativeSegwitAddress(): string
  }
}

export function getAddress (keypair: BaseKeypair): string {
  return keypair.toAddress().toLegacyShortAddress()
}

export const type = KeyringType.BtcSimple

export class BtcSimpleKeyring extends BaseSimpleKeyring<BtcKeypair> {
  static type = type
  type = type

  getAddress = getAddress
}
