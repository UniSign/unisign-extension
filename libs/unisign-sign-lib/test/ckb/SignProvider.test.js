const { core, ckb } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1, TEST_DATA_2, UNSIGNED_TX, SIGNED_TX } = require('./data')

const { SignProvider } = ckb

describe('SignProvider', () => {
  // core.logger.setLevel({ level: 0 })
  const signProvider = SignProvider.create({
    keypairs: [
      {
        privateKey: Buffer.from(TEST_DATA_1.privateKeyHex, 'hex'),
        publicKey: Buffer.from(TEST_DATA_1.publicKeyHex, 'hex'),
      },
      {
        privateKey: Buffer.from(TEST_DATA_2.privateKeyHex, 'hex'),
        publicKey: Buffer.from(TEST_DATA_2.publicKeyHex, 'hex'),
      },
    ]
  })

  describe('signPlainMessage', () => {
    const message = 'hello stackoverflow'

    test('should be able to sign plain message for legacy address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signPlainMessage(keypair, message)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.shortAddress, message, signature)).toBeTruthy()
    })
  })

  describe('signStructMessage', () => {
    const message = {
      coinType: core.CoinType.CKB,
      dAppName: 'unittest',
      detail: 'This is a unit test',
      subject: 'Unit Test',
      version: 1,
      content: {
        txId: '0x0000000000000000000000000000000000000000000000000000000000000000'
      },
    }

    test('should be able to sign struct message for legacy address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signStructMessage(keypair, message)

      expect(signProvider.verifySignatureWithAddress(TEST_DATA_1.shortAddress, JSON.stringify(message), signature))
    })
  })

  describe('signTransaction', () => {
    test('should be able to sign ckb-cli format transaction with cells.', async () => {
      const pbstHex = await signProvider.signTransaction(UNSIGNED_TX)
      const expected = SIGNED_TX

      expect(pbstHex).toBe(expected)
    })

    test('should throw if there is any inputs not signed', async () => {
      const signProvider = SignProvider.create({
        keypairs: [
          {
            privateKey: Buffer.from(TEST_DATA_1.privateKeyHex, 'hex'),
            publicKey: Buffer.from(TEST_DATA_1.publicKeyHex, 'hex'),
          },
        ]
      })

      expect.assertions(1)
      try {
        await signProvider.signTransaction(UNSIGNED_TX)
      }
      catch (e) {
        expect(e.code).toBe(core.ParamErrorCode.TransactionSignFailed)
      }
    })
  })
})
