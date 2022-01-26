// forked from https://github.com/MetaMask/KeyringController/blob/main/index.js

import { EventEmitter } from 'events'
import { ObservableStore } from '@metamask/obs-store'
import autoBind from 'auto-bind'
import { generateMnemonic, validateMnemonic } from 'bip39'
// @ts-ignore
import encryptor from 'browser-passworder'
import { ethErrors } from 'eth-rpc-errors'
import { EthHdKeyring } from './eth-hd-keyring'
import { EthSimpleKeyring } from './eth-simple-keyring'
import { BtcHdKeyring } from '~/background/services/keyring/btc-hd-keyring'
import { BtcSimpleKeyring } from '~/background/services/keyring/btc-simple-keyring'
import {
  KeyringBase,
  KeyringHD,
  KeyringHdOpts,
  KeyringSimple,
  KeyringSimpleOpts,
  KeyringType,
  SerializedKeyringData,
} from '~/background/services/keyring/types'
import { Unikey, UniKeyChainSimple, UnikeyChainHD } from '~/background/services/unikey'
import { loadDiskStore } from '~/background/tools/diskStore'
import { storage } from '~/background/tools/storage'

const keyringTypes = [BtcSimpleKeyring, BtcHdKeyring, EthSimpleKeyring, EthHdKeyring]

interface MemStoreKeyring {
  type: string
  accounts: string[]
}

interface MemStoreData {
  isUnlocked: boolean
  keyringTypes: string[]
  keyrings: MemStoreKeyring[]
}

interface StoreData {
  vault: string
  hasMnemonic: boolean
}

interface TypedSerializedKeyring {
  type: string
  data: SerializedKeyringData
}

interface MsgParams<T = string> {
  from: string
  data: T
}

interface Encryptor {
  encrypt(password: string, privateKey: TypedSerializedKeyring[]): Promise<string>
  decrypt(password: string, encrypted: string): Promise<any>
}

interface KeyringClassType {
  type: string
  new(options?: any): KeyringBase
}

interface KeyringOpts {
  initState?: StoreData
  keyringTypes?: KeyringClassType[]
  encryptor?: Encryptor
}

export class KeyringService extends EventEmitter {
  private store!: ObservableStore<StoreData>
  private memStore!: ObservableStore<MemStoreData>
  private keyringTypes!: KeyringClassType[] // the available Classes of keyrings
  private keyrings!: KeyringBase[] // the instances of keyringTypes
  private encryptor!: Encryptor
  private password: string|null = null
  private mnemonic!: string // only used for setup vault

  constructor (opts: KeyringOpts = {}) {
    super()

    this.init(opts).then(() => console.log('KeyringService initialized'))

    autoBind(this)
  }

  private async init (opts: KeyringOpts = {}): Promise<void> {
    // @ts-ignore
    this.keyringTypes = opts.keyringTypes
      ? keyringTypes.concat(opts.keyringTypes)
      : keyringTypes

    this.encryptor = opts.encryptor || encryptor
    this.keyrings = []

    const storageKey = 'keyring'
    const store = await loadDiskStore<StoreData>(storageKey, {
      vault: '',
      hasMnemonic: false,
    })

    this.store = new ObservableStore(store)
    this.store.subscribe(value => storage.set(storageKey, value))

    this.memStore = new ObservableStore({
      isUnlocked: true, // todo: it should be locked by default
      keyringTypes: this.keyringTypes.map(krt => krt.type),
      keyrings: [],
    } as MemStoreData)
  }

  async generateMnemonic () {
    this.mnemonic = generateMnemonic()
    return this.mnemonic
  }

  async setup (password: string) {
    if (!password || password.length < 8) {
      throw new Error('Password should be at least 8 characters')
    }

    this.password = password
  }

  async isSetup (): Promise<boolean> {
    return Boolean(this.store?.getState().vault)
  }

  async hasMnemonic () {
    return this.store.getState().hasMnemonic
  }

  /**
   * Full Update
   *
   * Emits the `update` event and @returns a Promise that resolves to
   * the current state.
   *
   * Frequently used to end asynchronous chains in this class,
   * indicating consumers can often either listen for updates,
   * or accept a state-resolving promise to consume their results.
   *
   * @returns {Object} The controller state.
   */
  private fullUpdate () {
    this.emit('update', this.memStore.getState())
    return this.memStore.getState()
  }

  /**
   * CreateNewVaultAndRestore
   *
   * Destroys any old encrypted storage,
   * creates a new encrypted store with the given password,
   * creates a new HD wallet from the given seed with 1 account.
   *
   * @emits KeyringController#unlock
   * @param {string} mnemonic - The BIP44-compliant seed phrase.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  createNewVaultAndRestore (mnemonic: string): Promise<KeyringHD> {
    if (!validateMnemonic(mnemonic)) {
      return Promise.reject(new Error('Mnemonic is invalid.'))
    }

    const keyringConfig: KeyringHdOpts = {
      mnemonic,
      numberOfAccounts: 1,
    }

    const defaultKeyring = this.createKeyringByType(KeyringType.BtcHD, keyringConfig) as KeyringHD

    return this.clearKeyrings()
      .then(() => this.persistAllKeyrings())
      .then(() => this.addKeyring(defaultKeyring))
      .then(firstKeyring => firstKeyring.getAccounts())
      .then(([firstAccount]) => {
        if (!firstAccount) {
          throw new Error('KeyringController - First Account not found.')
        }
      })
      .then(() => this.store.updateState({ hasMnemonic: true }))
      .then(() => this.persistAllKeyrings())
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => defaultKeyring)
  }

  async isLocked () {
    return !this.memStore.getState().isUnlocked
  }

  /**
   * Set Locked
   * This method deallocates all secrets, and effectively locks MetaMask.
   *
   * @emits KeyringController#lock
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  async setLocked () {
    this.password = null
    this.memStore.updateState({ isUnlocked: false })
    // remove keyrings
    this.keyrings = []
    await this.updateMemStoreKeyrings()
    this.emit('lock')
    return this.fullUpdate()
  }

  /**
   * Unlock Keyrings
   *
   * Unlocks the keyrings.
   *
   * @emits KeyringController#unlock
   */
  setUnlocked () {
    this.memStore.updateState({ isUnlocked: true })
    this.emit('unlock')
  }

  /**
   * Submit Password
   *
   * Attempts to decrypt the current vault and load its keyrings
   * into memory.
   *
   * Temporarily also migrates any old-style vaults first, as well.
   * (Pre MetaMask 3.0.0)
   *
   * @emits KeyringController#unlock
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  submitPassword (password: string) {
    return this.unlockKeyrings(password).then((keyrings) => {
      this.keyrings = keyrings
      this.password = password

      this.setUnlocked()
      return this.fullUpdate()
    })
  }

  /**
   * Unlock Keyrings
   *
   * Attempts to unlock the persisted encrypted storage,
   * initializing the persisted keyrings to RAM.
   *
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Array<KeyringBase>>} The keyrings.
   */
  async unlockKeyrings (password: string) {
    const encryptedVault = this.store.getState().vault
    if (!encryptedVault) {
      throw new Error('Cannot unlock without a previous vault.')
    }

    return this.clearKeyrings()
      .then(() => this.encryptor.decrypt(password, encryptedVault))
      .then(vault => Promise.all(vault.map(this._restoreKeyring.bind(this))))
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.keyrings)
  }

  /**
   * Verify Password
   *
   * Attempts to decrypt the current vault with a given password
   * to verify its validity.
   *
   * @param {string} password
   */
  async verifyPassword (password: string) {
    // todo: the performance may be critical, therefore it should be seriously considered
    const encryptedVault = this.store.getState().vault
    if (!encryptedVault) {
      throw new Error('Cannot unlock without a previous vault.')
    }
    await this.encryptor.decrypt(password, encryptedVault)
  }

  /**
   * Checks for duplicate keypairs, using the the first account in the given
   * array. Rejects if a duplicate is found.
   *
   * Only supports 'Simple Key Pair'.
   *
   * @param {string} type - The key pair type to check for.
   * @param {Array<string>} newAccountArray - Array of new accounts.
   * @returns {Promise<Array<string>>} The account, if no duplicate is found.
   */
  checkForDuplicate (type: string, newAccountArray: string[]) {
    return this.getAccounts().then((accounts) => {
      switch (type) {
        case EthSimpleKeyring.type:
        case BtcSimpleKeyring.type: {
          const isIncluded = accounts.includes(newAccountArray[0])

          if (isIncluded) {
            throw new Error('The account you\'re are trying to import is a duplicate')
          }
          return newAccountArray
        }
        default: {
          return newAccountArray
        }
      }
    })
  }

  /**
   * Add New Account
   *
   * Calls the `addAccounts` method on the given keyring,
   * and then saves those changes.
   *
   * @param {KeyringBase} selectedKeyring - The currently selected keyring.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  addNewAccount (selectedKeyring: KeyringBase): Promise<string> {
    let newAccount: string

    return selectedKeyring
      .addAccounts(1)
      .then((accounts) => {
        accounts.forEach((account) => {
          newAccount = account
          this.emit('newAccount', account)
        })
      })
      .then(() => this.persistAllKeyrings())
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => newAccount)
  }

  /**
   * Export Account
   *
   * Requests the private key from the keyring controlling
   * the specified address.
   *
   * Returns a Promise that may resolve with the private key string.
   *
   * @param {string} address - The address of the account to export.
   * @param type
   * @returns {Promise<string>} The private key of the account.
   */
  exportAccount (address: string, type?: KeyringType) {
    try {
      return this.getKeyringForAccount(address, type).then(keyring => keyring.exportAccount(address))
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   *
   * Remove Account
   *
   * Removes a specific account from a keyring
   * If the account is the last/only one then it also removes the keyring.
   *
   * @param {string} address - The address of the account to remove.
   * @returns {Promise<void>} A Promise that resolves if the operation was successful.
   */
  removeAccount (address: string) {
    return this.getKeyringForAccount(address)
      .then((keyring) => {
        // Not all the keyrings support this, so we have to check
        if (typeof keyring.removeAccount === 'function') {
          keyring.removeAccount(address)
          this.emit('removedAccount', address)
          return keyring.getAccounts()
        }
        else {
          return Promise.reject(new Error(`Keyring ${keyring.type} doesn't support account removal operations`))
        }
      })
      .then((accounts) => {
        // Check if this was the last/only account
        if (accounts.length === 0) {
          return this.removeEmptyKeyrings()
        }
      })
      .then(this.persistAllKeyrings.bind(this))
      .then(this.updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
      .catch((e) => {
        return Promise.reject(e)
      })
  }

  /**
   * Get Accounts
   *
   * Returns the public addresses of all current accounts
   * managed by all currently unlocked keyrings.
   *
   * @returns {Promise<Array<string>>} The array of accounts.
   */
  async getAccounts (): Promise<string[]> {
    const keyrings = this.keyrings || []

    return Promise.all(
      keyrings.map(keyring => keyring.getAccounts()),
    ).then(keyringArrays => keyringArrays.flat())
  }

  async getUnikeys (): Promise<Unikey[]> {
    return Promise.all(
      this.keyrings.map(keyring => keyring.getAccounts()
        .then(accounts => accounts.map((account) => {
          return {
            key: account,
            keyringType: keyring.type,
          } as UnikeyChainHD | UniKeyChainSimple
        })),
      ),
    ).then(keyringArrays => keyringArrays.flat())
  }

  //
  // Keyring
  //
  private addKeyring (keyring: KeyringBase): Promise<KeyringBase> {
    return keyring
      .getAccounts()
      .then(accounts => this.checkForDuplicate(keyring.type, accounts))
      .then(() => this.keyrings.push(keyring))
      .then(() => keyring)
  }

  private createKeyringByType (type: string, opts: object) {
    const KeyringClass = this.getKeyringClassForType(type)
    return new KeyringClass(opts)
  }

  importPrivateKey (privateKey: string, type: KeyringType): Promise<KeyringSimple> {
    const keyring = this.createKeyringByType(type, { privateKeys: [privateKey] } as KeyringSimpleOpts) as KeyringSimple

    return this.addKeyring(keyring)
      .then(() => this.persistAllKeyrings())
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => keyring)
  }

  /**
   * Add New Keyring
   *
   * Adds a new Keyring of the given `type` to the vault
   * and the current decrypted Keyrings array.
   *
   * All Keyring classes implement a unique `type` string,
   * and this is used to retrieve them from the keyringTypes array.
   *
   * @param {string} type - The type of keyring to add.
   * @param {Object} opts - The constructor options for the keyring.
   * @returns {Promise<KeyringBase>} The new keyring.
   */
  addNewKeyring (type: string, opts: object): Promise<KeyringBase> {
    const keyring = this.createKeyringByType(type, opts)

    return this.addKeyring(keyring)
      .then(() => this.persistAllKeyrings())
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => keyring)
  }

  /**
   * Remove Empty Keyrings
   *
   * Loops through the keyrings and removes the ones with empty accounts
   * (usually used after removing the last / only account) from a keyring
   */
  async removeEmptyKeyrings () {
    const validKeyrings: KeyringBase[] = []

    // Since getAccounts returns a Promise
    // We need to wait to hear back form each keyring
    // in order to decide which ones are now valid (accounts.length > 0)

    await Promise.all(
      this.keyrings.map(async (keyring) => {
        const accounts = await keyring.getAccounts()
        if (accounts.length > 0) {
          validKeyrings.push(keyring)
        }
      }),
    )
    this.keyrings = validKeyrings
  }

  /**
   * Persist All Keyrings
   *
   * Iterates the current `keyrings` array,
   * serializes each one into a serialized array,
   * encrypts that array with the provided `password`,
   * and persists that encrypted string to storage.
   *
   * @returns {Promise<boolean>} Resolves to true once keyrings are persisted.
   */
  private persistAllKeyrings (): Promise<void> {
    if (!this.password) {
      throw new Error('There should be password to persist data')
    }
    return Promise.all(
      this.keyrings.map((keyring) => {
        return keyring.serialize().then((serialized) => {
          // Label the output values on each serialized Keyring:
          return {
            type: keyring.type,
            data: serialized,
          } as TypedSerializedKeyring
        })
      }),
    )
      .then(serializedKeyrings => this.encryptor.encrypt(this.password!, serializedKeyrings))
      .then(encryptedString => this.store.updateState({ vault: encryptedString }))
  }

  /**
   * Get Keyring Class For Type
   *
   * Searches the current `keyringTypes` array
   * for a Keyring class whose unique `type` property
   * matches the provided `type`,
   * returning it if it exists.
   *
   * @param {string} type - The type whose class to get.
   * @returns {KeyringBase|undefined} The class, if it exists.
   */
  getKeyringClassForType (type: string): KeyringClassType {
    return this.keyringTypes.find(keyring => keyring.type === type)!
  }

  /**
   * Get Keyrings by Type
   *
   * Gets all keyrings of the given type.
   *
   * @param {string} type - The keyring types to retrieve.
   * @returns {KeyringBase[]} The keyrings.
   */
  getKeyringsByType (type: KeyringType): KeyringBase[] {
    return this.keyrings.filter(keyring => keyring.type === type)
  }

  /**
   * Get only one Keyring by keyringType
   * @param {KeyringType} type the type of keyring to retrieve
   * @returns {KeyringBase} the keyring
   */
  getKeyringByType (type: KeyringType): KeyringBase {
    const keyring = this.getKeyringsByType(type)[0]

    if (!keyring) {
      throw ethErrors.rpc.internal(`No ${KeyringType.BtcHD} keyring found`)
    }

    return keyring
  }

  /**
   * Get Keyring For Account
   *
   * Returns the currently initialized keyring that manages
   * the specified `address` if one exists.
   *
   * @param {string} address - An account address.
   * @param type
   * @returns {Promise<KeyringBase>} The keyring of the account, if it exists.
   */
  getKeyringForAccount (address: string, type?: KeyringType): Promise<KeyringBase> {
    const keyrings = type ? this.getKeyringsByType(type) : this.keyrings

    return Promise.all(
      keyrings.map(async (keyring) => {
        return {
          keyring,
          accounts: await keyring.getAccounts(),
        }
      }),
    ).then((candidates) => {
      const winners = candidates.filter((candidate) => {
        const accounts = candidate.accounts
        return accounts.includes(address)
      })
      if (winners && winners.length > 0) {
        return winners[0].keyring
      }

      // Adding more info to the error
      let errorInfo = ''
      if (!address) {
        errorInfo = 'The address passed in is invalid/empty'
      }
      else if (!candidates || !candidates.length) {
        errorInfo = 'There are no keyrings'
      }
      else if (!winners || !winners.length) {
        errorInfo = 'There are keyrings, but none match the address'
      }
      throw new Error(`No keyring found for the requested account. Error info: ${errorInfo}`)
    })
  }

  /**
   * Display For Keyring
   *
   * Is used for adding the current keyrings to the state object.
   * @param {KeyringBase} keyring
   * @returns {Promise<Object>} A keyring display object, with type and accounts properties.
   */
  displayForKeyring (keyring: KeyringBase): Promise<MemStoreKeyring> {
    return keyring.getAccounts().then((accounts) => {
      return {
        type: keyring.type,
        accounts,
      }
    })
  }

  /**
   * Clear Keyrings
   *
   * Deallocates all currently managed keyrings and accounts.
   * Used before initializing a new vault.
   */
  async clearKeyrings () {
    // clear keyrings from memory
    this.keyrings = []
    this.memStore.updateState({
      keyrings: [],
    })
  }

  /**
   * Update memStore Keyrings
   *
   * Updates the in-memory keyrings, without persisting.
   */
  private async updateMemStoreKeyrings () {
    const keyrings = await Promise.all(this.keyrings.map(this.displayForKeyring))
    return this.memStore.updateState({ keyrings })
  }

  /**
   * Restore Keyring
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, updates the memStore keyrings and returns the resulting
   * keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<KeyringBase>} The deserialized keyring.
   */
  async restoreKeyring (serialized: TypedSerializedKeyring) {
    const keyring = await this._restoreKeyring(serialized)
    await this.updateMemStoreKeyrings()
    return keyring
  }

  /**
   * Restore Keyring Helper
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, returns the resulting keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<KeyringBase>} The deserialized keyring.
   */
  async _restoreKeyring (serialized: TypedSerializedKeyring) {
    const { type, data } = serialized

    const KeyringType = this.getKeyringClassForType(type)
    const keyring = new KeyringType()
    await keyring.deserialize(data)
    // getAccounts also validates the accounts for some keyrings
    await keyring.getAccounts()
    this.keyrings.push(keyring)
    return keyring
  }

  /**
   * Forget hardware keyring
   *
   * Forget hardware and update memorized state.
   * @param {KeyringBase} keyring
   */
  forgetKeyring (keyring: KeyringBase) {
    if (keyring.forgetDevice) {
      keyring.forgetDevice()

      return this.persistAllKeyrings().then(() => this.updateMemStoreKeyrings())
    }
    else {
      throw new Error(`KeyringController - keyring does not have method "forgetDevice", keyring type: ${keyring.type}`)
    }
  }

  //
  // SIGNING METHODS
  //

  /**
   * Sign A Transaction
   *
   * @param msgParams
   * @param {Object} opts - Signing options.
   * @returns {Promise<Object>} The signed transaction object.
   */
  signTransaction (msgParams: MsgParams, opts = {}) {
    const address = msgParams.from
    return this.getKeyringForAccount(address).then((keyring) => {
      return keyring.signTransaction(address, msgParams.data, opts)
    })
  }

  /**
   * Sign Message
   *
   * Attempts to sign the provided message parameters.
   *
   * @param {Object} msgParams - The message parameters to sign.
   * @param opts
   * @returns {Promise<Buffer>} The raw signature.
   */
  signPlainMessage (msgParams: MsgParams, opts = {}) {
    const address = msgParams.from
    return this.getKeyringForAccount(address).then((keyring) => {
      return keyring.signPlainMessage(address, msgParams.data, opts)
    })
  }

  /**
   * Sign Struct Message
   *
   * @param {Object} msgParams - The message parameters to sign.
   * @param opts
   * @returns {Promise<Buffer>} The raw signature.
   */
  signStructMessage (msgParams: MsgParams<object>, opts = { version: 'V1' }) {
    const address = msgParams.from
    return this.getKeyringForAccount(address).then((keyring) => {
      return keyring.signStructMessage(address, msgParams.data, opts)
    })
  }

  /**
   * Get encryption public key
   *
   * Get encryption public key for using in encrypt/decrypt process.
   *
   * @param {string} address The address to get the encryption public key for.
   * @param {object} opts
   * @returns {Promise<Buffer>} The public key.
   */
  getEncryptionPublicKey (address: string, opts = {}) {
    return this.getKeyringForAccount(address).then((keyring) => {
      return keyring.getEncryptionPublicKey(address, opts)
    })
  }

  /**
   * Decrypt Message
   *
   * Attempts to decrypt the provided message parameters.
   *
   * @param {Object} msgParams - The decryption message parameters.
   * @param opts
   * @returns {Promise<Buffer>} The raw decryption result.
   */
  decryptMessage (msgParams: MsgParams, opts = {}) {
    const address = msgParams.from
    return this.getKeyringForAccount(address).then((keyring) => {
      return keyring.decryptMessage(address, msgParams.data, opts)
    })
  }
}

export const keyringService = new KeyringService()
