import { mnemonicToSeed } from 'bip39'
import { BtcSimpleKeyring } from '~/background/services/keyring/btc-simple-keyring'

interface BtcWallet {
  privateKey: string
  publicKey: string
}

interface BtcHdKeyringOpts {
  hdPath?: string
  mnemonic: string
  numberOfAccounts: number
}

const type = 'BTC HD Key Tree'
const hdPathString = 'm/44\'/60\'/0\'/0' // todo: replace it with bitcoin path

export class BtcHdKeyring extends BtcSimpleKeyring {
  static type = type
  type = type

  opts!: BtcHdKeyringOpts
  hdPath = hdPathString
  mnemonic = ''
  wallets: BtcWallet[] = []
  root!: BtcWallet

  async deserialize(opts: any): Promise<void>
  async deserialize (opts: BtcHdKeyringOpts): Promise<void> {
    this.opts = opts
    this.mnemonic = opts.mnemonic

    await this.initFromMnemonic(opts.mnemonic)

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
      hdPath: this.hdPath,
    })
  }

  addAccounts (): Promise<any>
  addAccounts (numberOfAccounts = 1): Promise<BtcWallet[]> {
    const oldLen = this.wallets.length

    const newWallets: BtcWallet[] = []

    for (let i = oldLen; i < oldLen + numberOfAccounts; i++) {
      const wallet = {
        privateKey: `bc123${i}`,
        publicKey: `bc456${i}`,
      }

      this.wallets.push(wallet)
      newWallets.push(wallet)
    }

    return Promise.resolve(newWallets)
  }

  getAccounts () {
    return Promise.resolve(this.wallets.map(w => w.publicKey))
  }

  private async initFromMnemonic (mnemonic: string) {
    const seed = await mnemonicToSeed(mnemonic)
    this.root = {
      publicKey: seed.toString(),
      privateKey: seed.toString(),
    }
  }
}
