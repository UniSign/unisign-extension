import { EventEmitter } from 'events'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { btc, core } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

export interface BaseSimpleKeyringOpts {
  privateKeys: string[]
}

// copy from unisign-sign-lib
export interface BaseKeypair {
  privateKey: string
  publicKey: string
  toAddress: () => any
}

const type = KeyringType.BtcSimple

export abstract class BaseSimpleKeyring<KEY_PAIR extends BaseKeypair = BaseKeypair> extends EventEmitter {
  static type = type
  type = type

  keypairs: KEY_PAIR[] = []

  constructor (opts?: BaseSimpleKeyringOpts) {
    super()

    this.deserialize(opts)
  }

  abstract getAddress(keypair: KEY_PAIR): string

  getKeypairFromHex (privateKey: string): KEY_PAIR {
    return btc.Keypair.fromHex(privateKey)
  }

  getKeypairFromBuffer (privateKey: Buffer): KEY_PAIR {
    return btc.Keypair.fromBuffer(privateKey)
  }

  async deserialize (opts?: BaseSimpleKeyringOpts): Promise<void> {
    this.keypairs = opts?.privateKeys.map((privateKey) => {
      return this.getKeypairFromHex(privateKey)
    }) || []
  }

  serialize (): Promise<BaseSimpleKeyringOpts> {
    return Promise.resolve({
      privateKeys: this.keypairs.map(w => w.privateKey),
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

  getWallet (address: string): KEY_PAIR|undefined {
    return this.keypairs.find(w => this.getAddress(w) === address)
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
