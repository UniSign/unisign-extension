import type { ChainData } from '~/background/services/chain'
import { KeyringType } from '~/background/services/keyring/types'

export const UNISIGN_ORIGIN = 'https://unisign.org'

export enum UnikeySymbol {
  BTC = 'BTC',
  DOGE = 'DOGE',
  CKB = 'CKB',
  // OpenPGP = 'OpenPGP',
}

export const HDKeyrings = [KeyringType.BtcHD, KeyringType.CkbHD, KeyringType.DogeHD]

export const CHAINS: Record<UnikeySymbol, ChainData> = {
  [UnikeySymbol.BTC]: {
    name: 'Bitcoin',
    unikeySymbol: UnikeySymbol.BTC,
    tokenSymbol: UnikeySymbol.BTC,
    coinType: '0',
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD,
    simpleKeyringType: KeyringType.BtcSimple,
  },
  [UnikeySymbol.DOGE]: {
    name: 'Doge',
    unikeySymbol: UnikeySymbol.DOGE,
    tokenSymbol: UnikeySymbol.DOGE,
    coinType: '3',
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.DogeHD,
    simpleKeyringType: KeyringType.DogeSimple,
  },
  [UnikeySymbol.CKB]: {
    name: 'Nervos',
    unikeySymbol: UnikeySymbol.CKB,
    tokenSymbol: UnikeySymbol.CKB,
    coinType: '309',
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.CkbHD,
    simpleKeyringType: KeyringType.CkbSimple,
  },
}

export enum LOCALES {
  en = 'en',
  zhCN = 'zh-CN',
}

export const LocaleOptions = [{
  text: 'English',
  value: LOCALES.en,
}, /* {
  text: '中文',
  value: LOCALES.zhCN,
} */]

export const UIPopupName = 'ui_popup'
export const UITabName = 'ui_tab'
