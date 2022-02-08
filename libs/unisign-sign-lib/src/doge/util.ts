import { INetworkConfig, MAINNET_CONF, Network, TESTNET_CONF } from './const'
import { util } from '~/btc'

export const { hash256, hash160 } = util

export function getNetworkConfig (network: Network): INetworkConfig {
  switch (network) {
    case Network.Mainnet:
      return MAINNET_CONF
    case Network.Testnet:
      return TESTNET_CONF
  }
}
