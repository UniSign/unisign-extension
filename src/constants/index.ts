import { ChainData } from '~/background/services/chain'

export const IS_WINDOWS = /windows/i.test(navigator.userAgent)

export const UNISIGN_ORIGIN = 'https://unisign.org'

export enum CHAIN_IDENTIFIER {
  BTC = 'BTC',
  DOGE = 'DOGE',
  CKB = 'CKB',
}

export const CHAINS: Record<CHAIN_IDENTIFIER, ChainData> = {
  [CHAIN_IDENTIFIER.BTC]: {
    name: 'Bitcoin',
    identifier: CHAIN_IDENTIFIER.BTC,
    tokenSymbol: CHAIN_IDENTIFIER.BTC,
    coinType: 0,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
  },
  [CHAIN_IDENTIFIER.DOGE]: {
    name: 'Doge',
    identifier: CHAIN_IDENTIFIER.DOGE,
    tokenSymbol: CHAIN_IDENTIFIER.DOGE,
    coinType: 3,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
  },
  [CHAIN_IDENTIFIER.CKB]: {
    name: 'Nervos',
    identifier: CHAIN_IDENTIFIER.CKB,
    tokenSymbol: CHAIN_IDENTIFIER.CKB,
    coinType: 309,
    chainId: undefined,
    logo: '',
    tokenLogo: '',
  },
}
