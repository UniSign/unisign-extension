import * as base from 'base-x'
import { Buffer } from 'buffer'
import { sha256 } from 'ethereum-cryptography/sha256'

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = base.default(BASE58_ALPHABET)

/**
 * Encode a buffer as a base58-check encoded string
 *
 * @param {Buffer} payload
 * @returns {string}
 */
export function encode (payload: Buffer): string {
  const checksum = sha256(sha256(payload))

  return base58.encode(Buffer.concat([
    payload,
    checksum
  ], payload.length + 4))
}

/**
 * Decode a base58-check encoded string to a buffer
 *
 * @param {string} str
 * @returns {Buffer | null}
 */
export function decode (str: string): Buffer | null {
  const buf = base58.decode(str)
  const payload = decodeRaw(buf)
  if (!payload) throw new Error('Invalid checksum')
  return payload
}

/**
 * Decode a base58-check encoded string to a buffer, return null if checksum is wrong
 *
 * @param {string} str
 * @returns {Buffer | null}
 */
export function decodeUnsafe (str: string): Buffer | null {
  const buf = base58.decodeUnsafe(str)
  if (!buf) return null

  return decodeRaw(buf)
}

/**
 * Decode a base58-check encoded string to buffer
 *
 * @param {Buffer} buf
 * @returns {Buffer | null}
 */
function decodeRaw (buf: Buffer): Buffer | null {
  const payload = buf.slice(0, -4)
  const checksum = buf.slice(-4)
  const newChecksum = Buffer.from(sha256(sha256(payload)))

  if (checksum[0] ^ newChecksum[0] |
    checksum[1] ^ newChecksum[1] |
    checksum[2] ^ newChecksum[2] |
    checksum[3] ^ newChecksum[3]) return null

  return payload
}
