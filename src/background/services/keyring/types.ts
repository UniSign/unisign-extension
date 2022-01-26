export interface SerializedKeyringData {
  // this can be anything
}

// export type Keyring = KeyringHD | KeyringBase
export enum KeyringType {
  BtcSimple = 'BTC Simple Key Pair', // BtcSimpleKeyring.type
  BtcHD = 'BTC HD Key Tree', // BtcHdKeyring.type
  EthSimple = 'ETH Simple Key Pair', // EthSimpleKeyring.type
  EthHD = 'ETH HD Key Tree', // EthHdKeyring.type

  // not in use
  WalletConnect = 'WalletConnect',
  OpenPGP = 'openPGP',
  Ledger = 'Ledger Hardware',
  Trezor = 'Trezor Hardware'
}

// todo: this should be modified to meet our needs
export interface KeyringBase<T extends SerializedKeyringData = SerializedKeyringData> {
  type: KeyringType

  serialize (): Promise<T>

  deserialize (obj: T): Promise<void>

  addAccounts (n: number): Promise<string[]>

  getAccounts (): Promise<string[]>

  signTransaction (address: string, transaction: object, opts: object): Promise<object>

  signPlainMessage (address: string, data: string, opts: object): Promise<string>

  signStructMessage (address: string, typedData: object, opts: object): Promise<string>

  decryptMessage (withAccount: string, encryptedData: string, opts: object): string

  getEncryptionPublicKey (withAccount: string, opts: object): Promise<string>

  exportAccount (address: string, opts?: object): Promise<string>

  removeAccount? (address: string): void

  forgetDevice? (): boolean
}

export interface KeyringSimpleOpts {
  privateKeys: string[]
}

export interface KeyringSimple extends KeyringBase<KeyringSimpleOpts> {
}

export interface KeyringHdOpts {
  mnemonic: string
  numberOfAccounts: number
}

export interface KeyringHD extends KeyringBase<KeyringHdOpts> {
  mnemonic: string
}
