import { mnemonicToSeed } from 'bip39'
import { BtcSimpleKeyring, BtcWallet } from '~/background/services/keyring/btc-simple-keyring'

interface BtcHdKeyringOpts {
  hdPath?: string
  mnemonic: string
  numberOfAccounts: number
}

const type = 'BTC HD Key Tree'

const defaultOpts: BtcHdKeyringOpts = {
  mnemonic: '',
  hdPath: 'm/44\'/60\'/0\'/0', // todo: replace it with bitcoin path
  numberOfAccounts: 1,
}

export class BtcHdKeyring extends BtcSimpleKeyring {
  static type = type
  type = type

  opts!: BtcHdKeyringOpts
  mnemonic!: string
  wallets!: BtcWallet[]
  root!: BtcWallet

  async deserialize(opts: any): Promise<void>
  async deserialize (opts: Partial<BtcHdKeyringOpts> = {}): Promise<void> {
    this.opts = Object.assign({}, defaultOpts, opts)
    this.mnemonic = this.opts.mnemonic
    this.wallets = []

    await this.initFromMnemonic(this.mnemonic)

    if (opts.numberOfAccounts) {
      // @ts-ignore
      await this.addAccounts(opts.numberOfAccounts)
    }
  }

  serialize(): Promise<any>
  serialize (): Promise<BtcHdKeyringOpts> {
    return Promise.resolve({
      mnemonic: this.mnemonic,
      numberOfAccounts: this.wallets.length,
      hdPath: this.opts.hdPath,
    })
  }

  addAccounts (): Promise<any>
  addAccounts (numberOfAccounts = 1): Promise<string[]> {
    const oldLen = this.wallets.length

    const newWallets: BtcWallet[] = []

    for (let i = oldLen; i < oldLen + numberOfAccounts; i++) {
      const wallet = {
        privateKey: `bc123:private#${i}`,
        publicKey: `bc123:public#${i}`,
        address: `bc123:address#${i}`,
      }

      this.wallets.push(wallet)
      newWallets.push(wallet)
    }

    return Promise.resolve(newWallets.map(w => w.address))
  }

  getAccounts () {
    return Promise.resolve(this.wallets.map(w => w.address))
  }

  private async initFromMnemonic (mnemonic: string) {
    const seed = await mnemonicToSeed(mnemonic)
    this.root = {
      publicKey: seed.toString(),
      privateKey: seed.toString(),
      address: seed.toString(),
    }
  }
}
