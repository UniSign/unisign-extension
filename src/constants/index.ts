import { ChainData } from '~/background/services/chain'

export const UNISIGN_ORIGIN = 'https://unisign.org'

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
  },
  [ChainIdentifier.DOGE]: {
    name: 'Doge',
    identifier: ChainIdentifier.DOGE,
    tokenSymbol: ChainIdentifier.DOGE,
    coinType: 3,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
  },
  [ChainIdentifier.CKB]: {
    name: 'Nervos',
    identifier: ChainIdentifier.CKB,
    tokenSymbol: ChainIdentifier.CKB,
    coinType: 309,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
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
