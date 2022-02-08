import coininfo from 'coininfo'

export { Network, INetworkConfig, SegwitType } from '~/btc'

export const MAINNET_CONF = coininfo('DOGE').toBitcoinJS()

// TODO The versions.bip32 is undefined in return, it is probably a bug.
// export const TESTNET_CONF = coininfo('DOGE-TEST').toBitcoinJS()
export const TESTNET_CONF = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bech32: '',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x71,
  scriptHash: 0xc4,
  wif: 0xf1
}
