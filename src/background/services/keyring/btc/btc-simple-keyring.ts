import { EventEmitter } from 'events'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { btc, core } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

export interface SerializedKeypair {
  privateKey: string
}

export interface BtcSimpleKeyringOpts {
  keypairs: SerializedKeypair[]
}

// copy from unisign-sign-lib
export interface BtcKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => {
    toNativeSegwitAddress(): string
    // toSegwitAddress(): string
    // toLegacyAddress(): string
  }
  // address: string
}

export const type = KeyringType.BtcSimple

export class BtcSimpleKeyring extends EventEmitter {
  static type = type
  type = type

  keypairs: BtcKeypair[] = []

  constructor (opts?: BtcSimpleKeyringOpts) {
    super()

    this.deserialize(opts)
  }

  async deserialize (opts?: BtcSimpleKeyringOpts): Promise<void> {
    this.keypairs = opts?.keypairs.map((w) => {
      return btc.Keypair.fromHex(w.privateKey)
    }) || []
  }

  serialize (): Promise<BtcSimpleKeyringOpts> {
    return Promise.resolve({
      keypairs: this.keypairs.map((w) => {
        return {
          privateKey: w.privateKey,
        }
      }),
    })
  }

  addAccounts (): Promise<void> {
    throw new Error(`${type} does not support this method`)
  }

  /**
   * export the private key controlling the specific address
   * @param address
   */
  exportAccount (address: string): Promise<string|undefined> {
    const wallet = this.getWallet(address)

    if (wallet) {
      return Promise.resolve(core.util.bufferToHex(wallet.privateKey))
    }
    else {
      return Promise.resolve(undefined)
    }
  }

  removeAccount (address: string) {
    if (!this.getWallet(address)) {
      throw new Error(`Address ${address} not found in this keyring`)
    }
    this.keypairs = this.keypairs.filter(w => this.getAddress(w) !== address)
  }

  getAccounts (): Promise<string[]> {
    return Promise.resolve(this.keypairs.map(w => this.getAddress(w)))
  }

  getWallet (address: string): BtcKeypair|undefined {
    return this.keypairs.find(w => this.getAddress(w) === address)
  }

  getAddress (keypair: BtcKeypair) {
    return keypair.toAddress().toNativeSegwitAddress()
  }

  async signTransaction (address: string, psbtHex: string) {
    const keypair = this.getWallet(address)
    const signProvider = btc.SignProvider.create({
      keypairs: [keypair],
    })

    return await signProvider.signTransaction(psbtHex, true)
  }

  async signPlainMessage (address: string, text: string): Promise<string> {
    const keypair = this.getWallet(address)
    const signProvider = btc.SignProvider.create({
      keypairs: [keypair],
    })

    const signature = await signProvider.signPlainMessage(keypair, text)
    return core.util.bufferToHex(signature)
  }

  async signStructMessage (address: string, data: object): Promise<string> {
    const keypair = this.getWallet(address)
    const signProvider = btc.SignProvider.create({
      keypairs: [keypair],
    })

    const signature = await signProvider.signStructMessage(keypair, data)
    return core.util.bufferToHex(signature)
  }
}
