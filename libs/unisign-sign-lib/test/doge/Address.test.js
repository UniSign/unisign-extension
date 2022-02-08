const { doge } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1 } = require('./data')

const { Address } = doge

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
      address.toLegacyAddress(doge.Network.Testnet)
      expect(address.toLegacyAddress(doge.Network.Testnet)).toBe(TEST_DATA_1.legacy_address)
    })
  })
})
