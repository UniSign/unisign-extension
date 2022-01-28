import type { BIP32Interface } from 'bip32'
import type { BtcHdKeyringOpts } from '~/background/services/keyring/btc-hd-keyring'
import type { CkbKeypair } from '~/background/services/keyring/ckb-simple-keyring'
import { CkbSimpleKeyring } from '~/background/services/keyring/ckb-simple-keyring'
import { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { ckb, core } from '~~/libs/unisign-sign-lib/dist/sign.mjs'

export const type = KeyringType.CkbHD

const defaultOpts: BtcHdKeyringOpts = {
  mnemonic: '',
  hdPathBase: 'm/44\'/309\'/0\'/0', // full path m/44'/309'/0'/0/0
  numberOfAccounts: 1,
}

export class CkbHdKeyring extends CkbSimpleKeyring {
  static type = type
  type = type

  opts!: BtcHdKeyringOpts
  mnemonic!: string
  keypairs!: CkbKeypair[]
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
  addAccounts (numberOfAccounts: number): Promise<string[]>
  addAccounts (numberOfAccounts = 1): Promise<string[]> {
    const oldLen = this.keypairs.length

    const newWallets: CkbKeypair[] = []

    for (let i = oldLen; i < oldLen + numberOfAccounts; i++) {
      const bip32 = this.root.derive(i)
      const keypair = ckb.Keypair.fromBuffer(bip32.privateKey)

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
