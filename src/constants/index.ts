import { ChainData } from '~/background/services/chain'
import { KeyringType } from '~/background/services/keyring/types'

export const UNISIGN_ORIGIN = 'https://unisign.org'

export enum KeyIdentifier {
  BTC = 'BTC',
  DOGE = 'DOGE',
  CKB = 'CKB',
}

export const CHAINS: Record<KeyIdentifier, ChainData> = {
  [KeyIdentifier.BTC]: {
    name: 'Bitcoin',
    identifier: KeyIdentifier.BTC,
    tokenSymbol: KeyIdentifier.BTC,
    coinType: 0,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD,
    simpleKeyringType: KeyringType.BtcSimple,
  },
  [KeyIdentifier.DOGE]: {
    name: 'Doge',
    identifier: KeyIdentifier.DOGE,
    tokenSymbol: KeyIdentifier.DOGE,
    coinType: 3,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD, // todo: change to dogeHD
    simpleKeyringType: KeyringType.BtcHD,
  },
  [KeyIdentifier.CKB]: {
    name: 'Nervos',
    identifier: KeyIdentifier.CKB,
    tokenSymbol: KeyIdentifier.CKB,
    coinType: 309,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD, // todo: change to ckbHD
    simpleKeyringType: KeyringType.BtcHD,
  },
}

export enum LOCALES {
  en = 'en',
  zhCN = 'zh-CN'
}

export const LocaleOptions = [{
  text: 'English',
  value: LOCALES.en,
}, {
  text: '中文',
  value: LOCALES.zhCN,
}]

export const UIPopupName = 'ui_popup'
export const UITabName = 'ui_tab'
