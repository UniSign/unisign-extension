const { core, btc } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1, TEST_DATA_2, TEST_DATA_3 } = require('./data')

const { SignProvider } = btc

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
      {
        privateKey: Buffer.from(TEST_DATA_3.privateKeyHex, 'hex'),
        publicKey: Buffer.from(TEST_DATA_3.publicKeyHex, 'hex'),
      },
    ]
  })

  describe('signPlainMessage', () => {
    const message = 'hello stackoverflow'

    test('should be able to sign plain message for legacy address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signPlainMessage(keypair, message)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.legacy_address, message, signature)).toBeTruthy()
    })

    test('should be able to sign plain message for native segwit address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signPlainMessage(keypair, message, btc.SegwitType.Native)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.native_segwit_address, message, signature)).toBeTruthy()
    })

    test('should be able to sign plain message for segwit address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signPlainMessage(keypair, message, btc.SegwitType.P2SH)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.segwit_address, message, signature)).toBeTruthy()
    })
  })

  describe('signStructMessage', () => {
    const message = {
      coinType: core.CoinType.BTC,
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

      expect(signProvider.verifySignatureWithAddress(TEST_DATA_1.legacy_address, JSON.stringify(message), signature))
    })

    test('should be able to sign struct message for native segwit address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signStructMessage(keypair, message, btc.SegwitType.Native)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.native_segwit_address, JSON.stringify(message), signature)).toBeTruthy()
    })

    test('should be able to sign struct message for segwit address', async () => {
      const keypair = signProvider.getKeypair(0)
      const signature = await signProvider.signStructMessage(keypair, message, btc.SegwitType.P2SH)

      expect(await signProvider.verifySignatureWithAddress(TEST_DATA_1.segwit_address, JSON.stringify(message), signature)).toBeTruthy()
    })
  })

  describe('signTransaction', () => {
    test('should be able to sign psbt format segwit transaction.', async () => {
      const pbstHex = await signProvider.signTransaction('70736274ff0100c2020000000291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac000000000001011fa0860100000000001600140f9eed4333a8438f90e958a012d51a5ccea2f1100001011f102700000000000016001497697908b1f81654b2aab68f77525538890216e700000000')
      const expected = '0x70736274ff0100c2020000000291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac000000000001011fa0860100000000001600140f9eed4333a8438f90e958a012d51a5ccea2f11001086b0247304402200a019e07659887949f186418ecd66822ec4aa2551662e14b11d0207994776dc402201951d7baad8311fa2f1a107a2c8285a390876701bb155fbe9d144a398864ed2901210348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d60001011f102700000000000016001497697908b1f81654b2aab68f77525538890216e701086b024730440220486745413280db2bc7823758f49f45b3146719c53dad1965bf7040df3d49544c022012f48c167609593817a148309c71967bfe4b18440320f9e1484572989983c441012102a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c5100000000'

      expect(pbstHex).toBe(expected)
    })

    test('should be able to return raw transaction', async () => {
      const txHex = await signProvider.signTransaction('70736274ff0100c2020000000291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac000000000001011fa0860100000000001600140f9eed4333a8438f90e958a012d51a5ccea2f1100001011f102700000000000016001497697908b1f81654b2aab68f77525538890216e700000000', true)
      const expected = '0x0200000000010291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac0247304402200a019e07659887949f186418ecd66822ec4aa2551662e14b11d0207994776dc402201951d7baad8311fa2f1a107a2c8285a390876701bb155fbe9d144a398864ed2901210348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d6024730440220486745413280db2bc7823758f49f45b3146719c53dad1965bf7040df3d49544c022012f48c167609593817a148309c71967bfe4b18440320f9e1484572989983c441012102a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c5100000000'

      expect(txHex).toBe(expected)
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
        await signProvider.signTransaction('70736274ff0100c2020000000291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac000000000001011fa0860100000000001600140f9eed4333a8438f90e958a012d51a5ccea2f1100001011f102700000000000016001497697908b1f81654b2aab68f77525538890216e700000000', true)
      }
      catch (e) {
        expect(e.code).toBe(core.ParamErrorCode.TransactionSignFailed)
      }
    })
  })
})
