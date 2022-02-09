import { BaseSimpleKeyring } from '~/background/services/keyring/base/base-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { ckb, core } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

// copy from unisign-sign-lib
export interface CkbKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => {
    toLegacyShortAddress(): string
    // toFullAddress(): string
  }
}

export function getAddress (keypair: CkbKeypair) {
  return keypair.toAddress().toLegacyShortAddress()
}

export async function signTransaction (this: CkbSimpleKeyring, address: string, psbtHex: string) {
  const keypair = this.getWallet(address)
  const signProvider = ckb.SignProvider.create({
    keypairs: [keypair],
  })

  return await signProvider.signTransaction(psbtHex, true)
}

export async function signPlainMessage (this: CkbSimpleKeyring, address: string, text: string): Promise<string> {
  const keypair = this.getWallet(address)
  const signProvider = ckb.SignProvider.create({
    keypairs: [keypair],
  })

  const signature = await signProvider.signPlainMessage(keypair, text)
  return core.util.bufferToHex(signature)
}

export async function signStructMessage (this: CkbSimpleKeyring, address: string, data: object): Promise<string> {
  const keypair = this.getWallet(address)
  const signProvider = ckb.SignProvider.create({
    keypairs: [keypair],
  })

  const signature = await signProvider.signStructMessage(keypair, data)
  return core.util.bufferToHex(signature)
}

const type = KeyringType.CkbSimple
export class CkbSimpleKeyring extends BaseSimpleKeyring<CkbKeypair> {
  static type = type
  type = type

  getAddress = getAddress
  signTransaction = signTransaction
  signPlainMessage = signPlainMessage
  signStructMessage = signStructMessage
  getKeypairFromHex (privateKey: string): CkbKeypair {
    return ckb.Keypair.fromHex(privateKey)
  }
}
