const { btc } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1 } = require('./data')

const { Address } = btc

describe('Address', () => {
  describe('fromBuffer', () => {
    test('should support initialize from Buffer', () => {
      const address = Address.fromBuffer(Buffer.from(TEST_DATA_1.publicKeyHex, 'hex'))
      expect(address.publicKey.toString('hex')).toBe(TEST_DATA_1.publicKeyHex)
    })
  })

  describe('fromHex', () => {
    test('should support initialize from Hex', () => {
      const address = Address.fromHex(TEST_DATA_1.publicKeyHex)
      expect(address.publicKey.toString('hex')).toBe(TEST_DATA_1.publicKeyHex)
    })
  })

  describe('toLegacyAddress', () => {
    test('should support export legacy format', () => {
      const address = Address.fromHex(TEST_DATA_1.publicKeyHex)
      expect(address.toLegacyAddress()).toBe(TEST_DATA_1.legacy_address)
    })
  })

  describe('toSegwitAddress', () => {
    test('should support export segwit format via P2SH', () => {
      const address = Address.fromHex(TEST_DATA_1.publicKeyHex)
      expect(address.toSegwitAddress()).toBe(TEST_DATA_1.segwit_address)
    })
  })

  describe('toNativeSegwitAddress', () => {
    test('should support export native segwit format', () => {
      const address = Address.fromHex(TEST_DATA_1.publicKeyHex)
      expect(address.toNativeSegwitAddress()).toBe(TEST_DATA_1.native_segwit_address)
    })
  })
})
