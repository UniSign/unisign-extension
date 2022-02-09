import { BaseSimpleKeyring } from '~/background/services/keyring/base/base-simple-keyring'
import type { CkbKeypair } from '~/background/services/keyring/ckb/ckb-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { core, doge } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

// copy from unisign-sign-lib
export interface DogeKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => {
    toLegacyAddress(): string
    // toFullAddress(): string
  }
}

const type = KeyringType.DogeSimple

export function getAddress (keypair: DogeKeypair) {
  return keypair.toAddress().toLegacyAddress()
}

export async function signTransaction (this: DogeSimpleKeyring, address: string, psbtHex: string) {
  const keypair = this.getWallet(address)
  const signProvider = doge.SignProvider.create({
    keypairs: [keypair],
  })

  return await signProvider.signTransaction(psbtHex, true)
}

export async function signPlainMessage (this: DogeSimpleKeyring, address: string, text: string): Promise<string> {
  const keypair = this.getWallet(address)
  const signProvider = doge.SignProvider.create({
    keypairs: [keypair],
  })

  const signature = await signProvider.signPlainMessage(keypair, text)
  return core.util.bufferToHex(signature)
}

export async function signStructMessage (this: DogeSimpleKeyring, address: string, data: object): Promise<string> {
  const keypair = this.getWallet(address)
  const signProvider = doge.SignProvider.create({
    keypairs: [keypair],
  })

  const signature = await signProvider.signStructMessage(keypair, data)
  return core.util.bufferToHex(signature)
}

export class DogeSimpleKeyring extends BaseSimpleKeyring {
  static type = type
  type = type

  getAddress = getAddress
  signTransaction = signTransaction
  signPlainMessage = signPlainMessage
  signStructMessage = signStructMessage

  getKeypairFromHex (privateKey: string): CkbKeypair {
    return doge.Keypair.fromHex(privateKey)
  }
}
