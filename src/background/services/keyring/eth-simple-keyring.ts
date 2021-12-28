// @ts-ignore
import SimpleKeyring from 'eth-simple-keyring'

const type = 'ETH Simple Key Pair'

export class EthSimpleKeyring extends SimpleKeyring {
  static type = type

  type = type
}
