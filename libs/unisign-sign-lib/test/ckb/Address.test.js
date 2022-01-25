const { ckb } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1 } = require('./data')

const { Address } = ckb

describe('Address', () => {
  describe('fromScript', () => {
    test('should support initialize from script', () => {
      const address = Address.fromScript(TEST_DATA_1.script)
      expect(address.script).toEqual({
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
        args: '0x75178f34549c5fe9cd1a0c57aebd01e7ddf9249e',
      })
    })
  })

  describe('toLegacyShortAddress', () => {
    test('should support export legacy short format', () => {
      const address = Address.fromScript(TEST_DATA_1.script)
      expect(address.toLegacyShortAddress(ckb.Network.Testnet)).toBe(TEST_DATA_1.shortAddress)
    })
  })

  describe('toFullAddress', () => {
    test('should support export latest full format', () => {
      const address = Address.fromScript(TEST_DATA_1.script)
      expect(address.toFullAddress(ckb.Network.Testnet)).toBe(TEST_DATA_1.fullAddress)
    })
  })
})
