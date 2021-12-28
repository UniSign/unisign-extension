export interface SerializedKeyringData {
  // this can be anything
}

// todo: this should be modified to meet our needs
export interface KeyringBase<T extends SerializedKeyringData = SerializedKeyringData> {
  type: string

  serialize (): Promise<T>

  deserialize (obj: T): Promise<void>

  addAccounts (n: number): Promise<string[]>

  getAccounts (): Promise<string[]>

  signTransaction (address: string, transaction: object, opts: object): Promise<object>

  signMessage (address: string, data: string, opts: object): Promise<string>

  signPersonalMessage (address: string, msgHex: string, opts: object): Promise<string>

  decryptMessage (withAccount: string, encryptedData: string, opts: object): string

  signTypedData (withAccount: string, typedData: string, opts: object): Promise<Buffer>

  getEncryptionPublicKey (withAccount: string, opts: object): Promise<string>

  getAppKeyAddress (address: string, origin: string): Promise<string>

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

// export type Keyring = KeyringHD | KeyringBase
