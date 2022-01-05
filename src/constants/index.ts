import { ChainData } from '~/background/services/chain'
import { KeyringType } from '~/background/services/keyring/types'

export const UNISIGN_ORIGIN = 'https://unisign.org'

// todo: rename to distinguish from chainId
export enum ChainIdentifier {
  BTC = 'BTC',
  DOGE = 'DOGE',
  CKB = 'CKB',
}

export const CHAINS: Record<ChainIdentifier, ChainData> = {
  [ChainIdentifier.BTC]: {
    name: 'Bitcoin',
    identifier: ChainIdentifier.BTC,
    tokenSymbol: ChainIdentifier.BTC,
    coinType: 0,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD,
  },
  [ChainIdentifier.DOGE]: {
    name: 'Doge',
    identifier: ChainIdentifier.DOGE,
    tokenSymbol: ChainIdentifier.DOGE,
    coinType: 3,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD, // todo: change to dogeHD
  },
  [ChainIdentifier.CKB]: {
    name: 'Nervos',
    identifier: ChainIdentifier.CKB,
    tokenSymbol: ChainIdentifier.CKB,
    coinType: 309,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
    HDKeyringType: KeyringType.BtcHD, // todo: change to ckbHD
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
