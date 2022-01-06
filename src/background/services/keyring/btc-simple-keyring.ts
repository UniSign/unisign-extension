import { EventEmitter } from 'events'

interface BtcSimpleKeyringOpts {
  privateKeys: string[]
}

// todo: use real object here
export interface BtcWallet {
  privateKey: string
  publicKey: string
  address: string
}
export const type = 'BTC Simple Key Pair'

export class BtcSimpleKeyring extends EventEmitter {
  static type = type
  type = type

  wallets: BtcWallet[] = []

  constructor (opts?: BtcSimpleKeyringOpts) {
    super()

    this.deserialize(opts)
  }

  async deserialize (opts?: BtcSimpleKeyringOpts): Promise<void> {
    this.wallets = opts?.privateKeys.map((privateKey) => {
      return {
        privateKey,
        publicKey: `publicKey ${privateKey}`,
        address: `address of ${privateKey}`,
      }
    }) || []
  }

  serialize (): Promise<BtcSimpleKeyringOpts> {
    return Promise.resolve({
      privateKeys: this.wallets.map(w => w.privateKey),
    })
  }

  addAccounts (): Promise<void> {
    throw new Error(`${type} does not support this method`)
  }

  /**
   * export the private key controlling the specific address
   * @param address
   * @param opts
   */
  exportAccount (address: string, opts = {}): Promise<string|undefined> {
    const wallet = this.wallets.find(w => w.address === address)

    if (wallet) {
      return Promise.resolve(wallet.privateKey)
    }
    else {
      return Promise.resolve(undefined)
    }
  }

  getAccounts (): Promise<string[]> {
    return Promise.resolve(this.wallets.map(w => w.publicKey))
  }

  signTransaction (address: string, tx: any, opts = {}) {

  }

  signPlainMessage (address: string, data: string, opts = {}) {

  }

  signStructMessage (address: string, data: string, opts = {}) {

  }
}
