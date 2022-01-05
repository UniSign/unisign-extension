import { KeyringType } from '~/background/services/keyring'
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
  _saver: number // used to invoke a safe action of diskStore
}

class UnikeyService {
  store!: UnikeyStore

  constructor () {
    this.init().then(() => console.log('UnikeyService initialized'))
  }

  async init () {
    this.store = await loadDiskStore('unikey', {
      currentUnikey: null,
      unikeys: [],
      _saver: 0,
    })
  }

  findUnikeyByKey (key: string) {
    return this.store.unikeys.find(unikey => unikey.key === key)
  }

  getAllVisibleUnikeys () {
    return this.store.unikeys.filter(unikey => !unikey.hidden)
  }

  hideUnikey (key: string) {
    const uniKey = this.store.unikeys.find(unikey => unikey.key === key)
    if (!uniKey) return

    uniKey.hidden = true

    this.store._saver++

    personalService.resetCurrentUnikey()
  }

  showUnikey (key: string) {
    const uniKey = this.store.unikeys.find(unikey => unikey.key === key)
    if (!uniKey) return

    uniKey.hidden = false

    this.store._saver++
  }
}

export const unikeyService = new UnikeyService()
