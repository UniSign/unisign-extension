import { AutoBindService } from '~/background/services/base/auto-bind'
import { KeyringType } from '~/background/services/keyring/types'
import { personalService } from '~/background/services/personal'
import { loadDiskStore } from '~/background/tools/diskStore'
import { ChainIdentifier } from '~/constants'

export enum UnikeyType {
  blockchain = 'blockchain',
  openPGP = 'openPGP'
}

export enum WalletConnectBrand {
  imtoken = 'imtoken',
  tokenPocket = 'tokenPocket',
  trustWallet = 'trustWallet'
}

export enum HardwareBrand {
  trezor = 'trezor',
  ledger = 'ledger'
}

export interface UnikeyBase {
  key: string
  nickname: string
  hidden: boolean

  keyType: UnikeyType
  keyringType: KeyringType

  chainId?: ChainIdentifier

  brand?: WalletConnectBrand | HardwareBrand
  brandName?: string
}

export interface UnikeyChain extends UnikeyBase {
  keyType: UnikeyType.blockchain

  chainId: ChainIdentifier
}

export interface UniKeyOpenPGP extends UnikeyBase {
  keyType: UnikeyType.openPGP

  keyringType: KeyringType.OpenPGP
}

export interface UnikeyChainMnemonic extends UnikeyChain {
  keyringType: KeyringType.BtcHD | KeyringType.EthHD
}

export interface UniKeyChainKeyPair extends UnikeyChain {
  keyringType: KeyringType.BtcSimple | KeyringType.EthSimple
}

export interface UniKeyChainWalletConnect extends UnikeyChain {
  keyringType: KeyringType.WalletConnect
  brand: WalletConnectBrand
  brandName: string
}

export interface UniKeyChainHardware extends UnikeyChain {
  keyringType: KeyringType.Ledger | KeyringType.Trezor
  brand: HardwareBrand
  brandName: string
}

export type Unikey = UnikeyChainMnemonic | UniKeyChainKeyPair | UniKeyChainWalletConnect | UniKeyChainHardware

interface UnikeyStore {
  unikeys: Unikey[]
}

class UnikeyService extends AutoBindService {
  store!: UnikeyStore

  constructor () {
    super()
    this.init().then(() => console.log('UnikeyService initialized'))
  }

  async init () {
    this.store = await loadDiskStore('unikey', {
      unikeys: [],
    } as UnikeyStore)
  }

  findUnikeyByKey (key: string) {
    return this.store.unikeys.find(unikey => unikey.key === key)
  }

  setUnikeys (unikeys: Unikey[]) {
    this.store.unikeys = unikeys
  }

  /**
   * Add unikey to a proper position
   * @param newUnikey
   * @param {boolean} isHD if the new key is from HD wallet, it should be close to other keys from the same HD wallet.
   */
  addUnikey (newUnikey: Unikey, isHD = true) {
    if (isHD) {
      let lastHDAccountIndex = 0
      let length = 0

      this.store.unikeys.forEach((unikey, index) => {
        if (unikey.keyringType === newUnikey.keyringType) {
          lastHDAccountIndex = index
          length++
        }
      })

      newUnikey.nickname = `Mnemonic ${length}`

      this.store.unikeys.splice(lastHDAccountIndex, 0, newUnikey)
    }
    else {
      this.store.unikeys.push(newUnikey)
    }
  }

  updateUnikey (newKey: Unikey) {
    const targetUnikey = this.store.unikeys.find(unikey => unikey.key === newKey.key)
    Object.assign(targetUnikey, newKey)
  }

  async getUnikeys () {
    return this.store.unikeys
  }

  async getVisibleUnikeys () {
    return this.store.unikeys.filter(unikey => !unikey.hidden)
  }

  async hideUnikey (key: string) {
    const uniKey = this.store.unikeys.find(unikey => unikey.key === key)
    if (!uniKey) return

    uniKey.hidden = true

    await personalService.resetCurrentUnikey()
  }

  async showUnikey (key: string) {
    const uniKey = this.store.unikeys.find(unikey => unikey.key === key)
    if (!uniKey) return

    uniKey.hidden = false
  }
}

export const unikeyService = new UnikeyService()
