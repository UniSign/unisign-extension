import { AutoBindService } from '~/background/services/base/auto-bind'
import { KeyringType } from '~/background/services/keyring/types'
import { personalService } from '~/background/services/personal'
import { loadDiskStore } from '~/background/tools/diskStore'
import { KeyIdentifier } from '~/constants'

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

  keyId?: KeyIdentifier

  brand?: WalletConnectBrand | HardwareBrand
  brandName?: string
}

export interface UnikeyChain extends UnikeyBase {
  keyType: UnikeyType.blockchain

  keyId: KeyIdentifier
}

export interface UniKeyOpenPGP extends UnikeyBase {
  keyType: UnikeyType.openPGP

  keyringType: KeyringType.OpenPGP
}

export interface UnikeyChainHD extends UnikeyChain {
  keyringType: KeyringType.BtcHD | KeyringType.EthHD
}

export interface UniKeyChainSimple extends UnikeyChain {
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

export type Unikey = UnikeyChainHD | UniKeyChainSimple | UniKeyChainWalletConnect | UniKeyChainHardware

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

  /**
   * Add unikey to a proper position
   * @param newUnikey
   * @param {boolean} isHD if the new key is from HD wallet, it should be close to other keys from the same HD wallet.
   */
  addUnikey (newUnikey: Unikey, isHD: boolean) {
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

  deleteUnikey (key: string) {
    const index = this.store.unikeys.findIndex(unikey => unikey.key === key)

    this.store.unikeys.splice(index, 1)
  }

  updateUnikey (newKey: Unikey) {
    const targetUnikey = this.store.unikeys.find(unikey => unikey.key === newKey.key)
    Object.assign(targetUnikey, newKey)
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

  setUnikeys (unikeys: Unikey[]) {
    this.store.unikeys = unikeys
  }

  async getUnikeys () {
    return this.store.unikeys
  }

  async getVisibleUnikeys () {
    return this.store.unikeys.filter(unikey => !unikey.hidden)
  }
}

export const unikeyService = new UnikeyService()
