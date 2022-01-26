import { BIP32Interface } from 'bip32'
// @ts-ignore
import { core, btc } from '~~/libs/unisign-sign-lib/dist/sign.mjs'
import { BtcSimpleKeyring, BtcKeypair } from '~/background/services/keyring/btc-simple-keyring'

interface BtcHdKeyringOpts {
  hdPathBase?: string
  mnemonic: string
  numberOfAccounts: number
}

const type = 'BTC HD Key Tree'

const defaultOpts: BtcHdKeyringOpts = {
  mnemonic: '',
  hdPathBase: 'm/84\'/0\'/0\'/0', // full path m/84'/0'/0'/0/0
  numberOfAccounts: 1,
}

export class BtcHdKeyring extends BtcSimpleKeyring {
  static type = type
  type = type

  opts!: BtcHdKeyringOpts
  mnemonic!: string
  keypairs!: BtcKeypair[]
  root!: BIP32Interface

  async deserialize(opts: any): Promise<void>
  async deserialize (opts: Partial<BtcHdKeyringOpts> = {}): Promise<void> {
    this.opts = Object.assign({}, defaultOpts, opts)
    this.mnemonic = this.opts.mnemonic
    this.keypairs = []

    if (this.mnemonic) {
      await this.initFromMnemonic(this.mnemonic)
    }

    if (opts.numberOfAccounts) {
      // @ts-ignore
      await this.addAccounts(opts.numberOfAccounts)
    }
  }

  serialize(): Promise<any>
  serialize (): Promise<BtcHdKeyringOpts> {
    return Promise.resolve({
      mnemonic: this.mnemonic,
      numberOfAccounts: this.keypairs.length,
      hdPathBase: this.opts.hdPathBase,
    })
  }

  addAccounts (): Promise<any>
  addAccounts (numberOfAccounts = 1): Promise<string[]> {
    const oldLen = this.keypairs.length

    const newWallets: BtcKeypair[] = []

    for (let i = oldLen; i < oldLen + numberOfAccounts; i++) {
      const bip32 = this.root.derive(i)
      const keypair = btc.Keypair.fromBuffer(bip32.privateKey)

      this.keypairs.push(keypair)
      newWallets.push(keypair)
    }

    return Promise.resolve(newWallets.map(w => this.getAddress(w)))
  }

  getAccounts () {
    return Promise.resolve(this.keypairs.map(w => this.getAddress(w)))
  }

  private async initFromMnemonic (mnemonic: string) {
    this.root = await core.util.deriveFromMnemonic(mnemonic, this.opts.hdPathBase)
  }
}
