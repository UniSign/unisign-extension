const { core } = require('../../dist/sign.cjs.js')
const { util } = core

describe('util', () => {
  describe('isHex', () => {
    test('should return true for strings with 0x-prefix', () => {
      expect(util.isHex('0xFFFF')).toBeTruthy()

      expect(util.isHex('0xffff')).toBeTruthy()
    })

    test('should return true for strings without 0x-prefix', () => {
      expect(util.isHex('FFFF')).toBeTruthy()

      expect(util.isHex('ffff')).toBeTruthy()
    })

    test('should return false for invalid strings with 0x-prefix', () => {
      expect(util.isHex('0xwxyz')).toBeFalsy()
    })

    test('should return false for invalid strings without 0x-prefix', () => {
      expect(util.isHex('wxyz')).toBeFalsy()
    })
  })

  describe('padHexPrefix', () => {
    test('should pad 0x-prefix if the string not start with 0x-prefix', () => {
      expect(util.padHexPrefix('FFFF')).toBe('0xFFFF')

      expect(util.padHexPrefix('ffff')).toBe('0xffff')
    })

    test('should return directly if the string has started with 0x-prefix', () => {
      expect(util.padHexPrefix('0xFFFF')).toBe('0xFFFF')

      expect(util.padHexPrefix('0xffff')).toBe('0xffff')
    })
  })
})
