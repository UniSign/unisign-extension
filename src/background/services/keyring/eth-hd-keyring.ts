// @ts-ignore
import HdKeyring from 'eth-hd-keyring'

const type = 'ETH HD Key Tree'

export class EthHdKeyring extends HdKeyring {
  static type = type

  type = type
}
