const { btc } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1 } = require('./data')

const { Keypair } = btc

describe('Keypair', () => {
  describe('fromBuffer', () => {
    test('should support initialize from Buffer', () => {
      const keypair = Keypair.fromBuffer(Buffer.from(TEST_DATA_1.privateKeyHex, 'hex'))
      expect(keypair.publicKey.toString('hex')).toBe(TEST_DATA_1.publicKeyHex)
    })
  })

  describe('fromHex', () => {
    test('should support initialize from Hex', () => {
      const keypair = Keypair.fromHex(TEST_DATA_1.privateKeyHex)
      expect(keypair.publicKey.toString('hex')).toBe(TEST_DATA_1.publicKeyHex)
    })
  })

  describe('fromWIF', () => {
    test('should support initialize from Hex', () => {
      const keypair = Keypair.fromWIF(TEST_DATA_1.wif)
      expect(keypair.publicKey.toString('hex')).toBe(TEST_DATA_1.publicKeyHex)
    })
  })

  describe('toWIF', () => {
    test('should support export WIF format', () => {
      const keypair = Keypair.fromHex(TEST_DATA_1.privateKeyHex)
      expect(keypair.toWIF(btc.Network.Mainnet)).toBe(TEST_DATA_1.wif)
    })
  })
})
