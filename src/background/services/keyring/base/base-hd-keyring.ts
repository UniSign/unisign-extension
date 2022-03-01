import type { BIP32Interface } from 'bip32'
import { BaseSimpleKeyring } from '~/background/services/keyring/base/base-simple-keyring'
import type { BaseKeypair } from '~/background/services/keyring/base/base-simple-keyring'
import type { KeyringType } from '~/background/services/keyring/types'
// @ts-expect-error no type
import { core } from '~~/libs/unisign-sign-lib/lib/sign.mjs'

export interface BaseHdKeyringOpts {
  hdPathBase: string
  mnemonic: string
  numberOfAccounts: number
}

export abstract class BaseHdKeyring<KEY_PAIR extends BaseKeypair = BaseKeypair> extends BaseSimpleKeyring {
  static type: KeyringType
  type!: KeyringType

  defaultOpts: BaseHdKeyringOpts = {
    mnemonic: '',
    hdPathBase: '',
    numberOfAccounts: 1,
  }

  opts!: BaseHdKeyringOpts
  mnemonic!: string
  keypairs!: KEY_PAIR[]
  root!: BIP32Interface

  async deserialize(opts: any): Promise<void>
  async deserialize (opts: Partial<BaseHdKeyringOpts> = {}): Promise<void> {
    this.opts = Object.assign({}, this.defaultOpts, opts)
    this.mnemonic = this.opts.mnemonic
    this.keypairs = []

    if (this.mnemonic && this.opts.hdPathBase) {
      await this.initFromMnemonic(this.mnemonic)

      if (opts.numberOfAccounts) {
        await this.addAccounts(opts.numberOfAccounts)
      }
    }
  }

  serialize(): Promise<any>
  serialize (): Promise<BaseHdKeyringOpts> {
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

    const newWallets: KEY_PAIR[] = []

    for (let i = oldLen; i < oldLen + numberOfAccounts; i++) {
      const bip32 = this.root.derive(i)
      const keypair = this.getKeypairFromBuffer(bip32.privateKey!) as KEY_PAIR

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
