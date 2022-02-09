import { BaseSimpleKeyring } from '~/background/services/keyring/base/base-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { btc } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

export interface BtcKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => {
    toNativeSegwitAddress(): string
  }
}

export function getAddress (keypair: BtcKeypair): string {
  return keypair.toAddress().toNativeSegwitAddress()
}

export const type = KeyringType.BtcSimple

export class BtcSimpleKeyring extends BaseSimpleKeyring<BtcKeypair> {
  static type = type
  type = type

  getAddress = getAddress
  getKeypairFromHex (privateKey: string): BtcKeypair {
    return btc.Keypair.fromHex(privateKey)
  }
}
