import { INetworkConfig, MAINNET_CONF, Network, TESTNET_CONF } from './const'
import { Buffer } from 'buffer'
import { crypto } from '~/core'

export function getNetworkConfig (network: Network): INetworkConfig {
  switch (network) {
    case Network.Mainnet:
      return MAINNET_CONF
    case Network.Testnet:
      return TESTNET_CONF
  }
}

export function hash256 (buf: Buffer): Buffer {
  return Buffer.from(crypto.sha256(crypto.sha256(buf)))
}

export function hash160 (buf: Buffer): Buffer {
  return Buffer.from(crypto.ripemd160(crypto.sha256(buf)))
}
