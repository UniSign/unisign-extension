import filter from 'lodash/filter'
import find from 'lodash/find'
import keyBy from 'lodash/keyBy'
import keys from 'lodash/keys'
import includes from 'lodash/includes'
import isPlainObject from 'lodash/isPlainObject'
import toNumber from 'lodash/toNumber'
import trimEnd from 'lodash/trimEnd'
import isNil from 'lodash/isNil'
import uniq from 'lodash/uniq'
import values from 'lodash/values'
import range from 'lodash/range'
import * as bip39 from 'bip39'
// TODO Replace tiny-secp256k1 with js-ethereum-cryptography
import * as ecc from 'tiny-secp256k1'
import { BIP32Factory, BIP32Interface } from 'bip32'
import { Buffer } from 'buffer'

import { ParamError, ParamErrorCode } from './error'
import { getRandomBytesSync } from './crypto'

const BCP47_LANG_MAP: { [key: string]: string } = {
  'zh-Hans': 'chinese_simplified',
  'zh-Hant': 'chinese_traditional',
  en: 'english',
  fr: 'french',
  it: 'italian',
  ja: 'japanese',
  ko: 'korean',
  es: 'spanish',
}

const bip32 = BIP32Factory(ecc)

export {
  filter,
  find,
  keyBy,
  keys,
  includes,
  isPlainObject,
  toNumber,
  trimEnd,
  uniq,
  values,
  isNil,
  range,
}

/**
 * Check if the string is a valid hex string
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isHex (str: string): boolean {
  return /^(?:0x)?[0-9a-f]+$/i.test(str)
}

/**
 * Prefix a string with 0x
 *
 * @param {string} str
 * @returns {string}
 */
export function padHexPrefix (str: string): string {
  return !str.startsWith('0x') ? '0x' + str : str
}

/**
 * Strip 0x-prefix from a string
 *
 * @param {string} str
 * @return {string}
 */
export function stripHexPrefix (str: string): string {
  return str.startsWith('0x') ? str.slice(2) : str
}

/**
 * Convert a hex string to buffer
 *
 * @param {string} str
 * @returns {Buffer}
 */
export function hexToBuffer (str: string): Buffer {
  return Buffer.from(stripHexPrefix(str), 'hex')
}

/**
 * Convert buffer to a hex string
 *
 * @param {Buffer | Uint8Array} buf
 * @returns {string}
 */
export function bufferToHex (buf: Buffer | Uint8Array): string {
  return padHexPrefix(Buffer.from(buf).toString('hex'))
}

/**
 * Convert a boolean value to `true` or `false` string
 *
 * @param {boolean} bool
 * @returns {string}
 */
export function boolToString (bool: boolean): string {
  return bool ? 'true' : 'false'
}

/**
 * Check if the string is a valid mnemonic
 *
 * @param {string} mnemonic
 * @returns {boolean}
 */
export function isMnemonicValid (mnemonic: string): boolean {
  try {
    bip39.mnemonicToEntropy(mnemonic)
    return true
  }
  catch (e: any) {
    return !!e.message.includes('Invalid mnemonic checksum')
  }
}

/**
 * Check if the string is a valid mnemonic and its checksum is correct
 *
 * @param {string} mnemonic
 * @returns {boolean}
 */
export function isMnemonicChecksumValid (mnemonic: string): boolean {
  try {
    bip39.mnemonicToEntropy(mnemonic)
    return true
  }
  catch (e: any) {
    return !!e.message.includes('Invalid mnemonic checksum')
  }
}

/**
 * Generate a mnemonic
 *
 * @param {string} lang For the language supported, please see BCP47_LANG_MAP
 * @param {number} length The available length of mnmonic: 12, 15, 18, 21, 24
 * @returns {string}
 */
export function generateMnemonic (lang = 'en', length = 12): string {
  if (!Object.prototype.hasOwnProperty.call(BCP47_LANG_MAP, lang)) {
    throw ParamError.fromCode(ParamErrorCode.MnemonicUndefinedLang, 'lang')
  }
  if (!includes([12, 15, 18, 21, 24], length)) {
    throw ParamError.fromCode(ParamErrorCode.MnemonicInvalidLength, 'length')
  }

  const strength = length / 3 * 32
  function rand (size: number): Buffer {
    return Buffer.from(getRandomBytesSync(size))
  }
  return bip39.generateMnemonic(strength, rand, bip39.wordlists[BCP47_LANG_MAP[lang]])
}

/**
 * Calculate a seed from a mnemonic
 *
 * CAREFUL: It is impossible to verify if the password is correct, it works just like salt.
 *
 * @param {string} mnemonic
 * @param {string} password
 * @return {Promise<Buffer>}
 */
export async function mnemonicToSeed (mnemonic: string, password?: string): Promise<Buffer> {
  if (!isMnemonicValid(mnemonic)) {
    throw ParamError.fromCode(ParamErrorCode.MnemonicInvalid, 'mnemonic')
  }

  const words = filter(mnemonic.split(' '))
  try {
    return await bip39.mnemonicToSeed(words.join(' '), password)
  }
  catch (err) {
    throw ParamError.fromCode(ParamErrorCode.MnemonicUnknownError, 'mnemonic')
  }
}

/**
 * Derive a key pair from a seed
 *
 * @param {Buffer} seed The seed can be calculated by `mnemonicToSeed` function.
 * @param {string} path
 * @returns {BIP32Interface}
 */
export function deriveFromSeed (seed: Buffer, path: string): BIP32Interface {
  const root = bip32.fromSeed(seed)
  try {
    return root.derivePath(path)
  }
  catch (err: any) {
    // This mean the path is invalid.
    if (err.message.match('Expected BIP32Path')) {
      throw ParamError.fromCode(ParamErrorCode.MnemonicInvalidBIP32Path, 'path')
    }
    else {
      throw err
    }
  }
}

/**
 * Derive a key pair from a mnemonic
 *
 * CAREFUL: It is impossible to verify if the password is correct, it works just like salt.
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {Promise<BIP32Interface>}
 */
export async function deriveFromMnemonic (mnemonic: string, path: string, password?: string): Promise<BIP32Interface> {
  if (!isMnemonicValid(mnemonic)) {
    throw ParamError.fromCode(ParamErrorCode.MnemonicInvalid, 'mnemonic')
  }

  const words = filter(mnemonic.split(' '))
  const seed = await bip39.mnemonicToSeed(words.join(' '), password)
  return deriveFromSeed(seed, path)
}
