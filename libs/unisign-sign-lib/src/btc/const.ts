import { networks } from 'ecpair'

export type INetworkConfig = networks.Network

export const MAINNET_CONF = networks.bitcoin
export const TESTNET_CONF = networks.testnet

export enum Network {
  Mainnet,
  Testnet,
}

export enum SegwitType {
  Native,
  P2SH,
}
