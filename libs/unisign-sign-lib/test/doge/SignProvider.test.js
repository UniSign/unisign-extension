const { core, doge } = require('../../dist/sign.cjs.js')
const { TEST_DATA_1, TEST_DATA_2, TEST_DATA_3 } = require('./data')

const { SignProvider } = doge

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
  })

  describe('signTransaction', () => {
    test('should be able to sign psbt format transaction.', async () => {
      const pbstHex = await signProvider.signTransaction('70736274ff0100c20100000002892935dcbe2b0fb82e6b629621a3ea0f272c7adb2e1e18d9d8a8e9ceac90de150000000000fffffffff846b0b715e1d5951f99178006cbd4171ee74a78c45a780c807e866275d931b90100000000ffffffff030084d717000000001976a914751e76e8199196d454941c45d1b3a323f1433bd688ac00397b12020000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088ac00397b12020000001976a91497697908b1f81654b2aab68f77525538890216e788ac00000000000100e10100000001c4d4fc07b9b2f708167c5072220730b7a8c77ad1d1a57f45a20900b82cbf44d3010000006a47304402203800701089159fd8debcab1267ba8244830f009912f30b6317822bcdb126c19c022073ce4063f3a3e7eddcb5ed97d4d1ecd1227c9dea1f8ed7b86677ce35c6d259df012102d336f15742c8ea21de1cb943a8825e36288842ae50a0583b8be62b6c90b85db8feffffff0210e5fa4f010000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acf0e00bd7450600001976a914e53c38e0c8547c9d3c8aab20fc8bca2eb581fa3188acb4713600000100e201000000014f6d73d6eaa42e43e0ecb2403435ecf554410eaabe6658165728be1cc1fe2e29010000006b483045022100b4a17d5b56c7e46cdfa1098931a97302c24bbcb2ee07daa8ef997a51231d3abc02206ce92427f197f326a3018cf4244f4e3d6d3dc0d21fff1f142dd4a094d30c3b27012102af4d1aa7fbc35980cf797ff5ed9e886c9c025284031900dbd534ee36a2d259dbfeffffff02e092980d3b0600001976a914ae266570dc531ab057310db9c08ded4d2c164bc588ac608d12f8020000001976a91497697908b1f81654b2aab68f77525538890216e788ac3774360000000000')
      const expected = '0x70736274ff0100c20100000002892935dcbe2b0fb82e6b629621a3ea0f272c7adb2e1e18d9d8a8e9ceac90de150000000000fffffffff846b0b715e1d5951f99178006cbd4171ee74a78c45a780c807e866275d931b90100000000ffffffff030084d717000000001976a914751e76e8199196d454941c45d1b3a323f1433bd688ac00397b12020000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088ac00397b12020000001976a91497697908b1f81654b2aab68f77525538890216e788ac00000000000100e10100000001c4d4fc07b9b2f708167c5072220730b7a8c77ad1d1a57f45a20900b82cbf44d3010000006a47304402203800701089159fd8debcab1267ba8244830f009912f30b6317822bcdb126c19c022073ce4063f3a3e7eddcb5ed97d4d1ecd1227c9dea1f8ed7b86677ce35c6d259df012102d336f15742c8ea21de1cb943a8825e36288842ae50a0583b8be62b6c90b85db8feffffff0210e5fa4f010000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acf0e00bd7450600001976a914e53c38e0c8547c9d3c8aab20fc8bca2eb581fa3188acb471360001076a4730440220766784c322445dea3e144c94163ace3d8381f118dacabe08a805cc9b6bd4b7520220256be292b76aeca43d28826fa5eb0a726bc50b37fcab4d506a039c249038653001210348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d6000100e201000000014f6d73d6eaa42e43e0ecb2403435ecf554410eaabe6658165728be1cc1fe2e29010000006b483045022100b4a17d5b56c7e46cdfa1098931a97302c24bbcb2ee07daa8ef997a51231d3abc02206ce92427f197f326a3018cf4244f4e3d6d3dc0d21fff1f142dd4a094d30c3b27012102af4d1aa7fbc35980cf797ff5ed9e886c9c025284031900dbd534ee36a2d259dbfeffffff02e092980d3b0600001976a914ae266570dc531ab057310db9c08ded4d2c164bc588ac608d12f8020000001976a91497697908b1f81654b2aab68f77525538890216e788ac3774360001076a47304402206936356cd16ac2b6701d0f901e5f6ee4b37a7c70352077051c4174e5b516c73a022026e553241c22f3b37b1393d2d3d8e41fcdfa4b3e057c0e089917ad8bb7801bef012102a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c5100000000'

      expect(pbstHex).toBe(expected)
    })

    test('should be able to return raw transaction', async () => {
      const txHex = await signProvider.signTransaction('70736274ff0100c20100000002892935dcbe2b0fb82e6b629621a3ea0f272c7adb2e1e18d9d8a8e9ceac90de150000000000fffffffff846b0b715e1d5951f99178006cbd4171ee74a78c45a780c807e866275d931b90100000000ffffffff030084d717000000001976a914751e76e8199196d454941c45d1b3a323f1433bd688ac00397b12020000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088ac00397b12020000001976a91497697908b1f81654b2aab68f77525538890216e788ac00000000000100e10100000001c4d4fc07b9b2f708167c5072220730b7a8c77ad1d1a57f45a20900b82cbf44d3010000006a47304402203800701089159fd8debcab1267ba8244830f009912f30b6317822bcdb126c19c022073ce4063f3a3e7eddcb5ed97d4d1ecd1227c9dea1f8ed7b86677ce35c6d259df012102d336f15742c8ea21de1cb943a8825e36288842ae50a0583b8be62b6c90b85db8feffffff0210e5fa4f010000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acf0e00bd7450600001976a914e53c38e0c8547c9d3c8aab20fc8bca2eb581fa3188acb4713600000100e201000000014f6d73d6eaa42e43e0ecb2403435ecf554410eaabe6658165728be1cc1fe2e29010000006b483045022100b4a17d5b56c7e46cdfa1098931a97302c24bbcb2ee07daa8ef997a51231d3abc02206ce92427f197f326a3018cf4244f4e3d6d3dc0d21fff1f142dd4a094d30c3b27012102af4d1aa7fbc35980cf797ff5ed9e886c9c025284031900dbd534ee36a2d259dbfeffffff02e092980d3b0600001976a914ae266570dc531ab057310db9c08ded4d2c164bc588ac608d12f8020000001976a91497697908b1f81654b2aab68f77525538890216e788ac3774360000000000', true)
      const expected = '0x0100000002892935dcbe2b0fb82e6b629621a3ea0f272c7adb2e1e18d9d8a8e9ceac90de15000000006a4730440220766784c322445dea3e144c94163ace3d8381f118dacabe08a805cc9b6bd4b7520220256be292b76aeca43d28826fa5eb0a726bc50b37fcab4d506a039c249038653001210348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d6fffffffff846b0b715e1d5951f99178006cbd4171ee74a78c45a780c807e866275d931b9010000006a47304402206936356cd16ac2b6701d0f901e5f6ee4b37a7c70352077051c4174e5b516c73a022026e553241c22f3b37b1393d2d3d8e41fcdfa4b3e057c0e089917ad8bb7801bef012102a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c51ffffffff030084d717000000001976a914751e76e8199196d454941c45d1b3a323f1433bd688ac00397b12020000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088ac00397b12020000001976a91497697908b1f81654b2aab68f77525538890216e788ac00000000'

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
        await signProvider.signTransaction('70736274ff0100c20100000002892935dcbe2b0fb82e6b629621a3ea0f272c7adb2e1e18d9d8a8e9ceac90de150000000000fffffffff846b0b715e1d5951f99178006cbd4171ee74a78c45a780c807e866275d931b90100000000ffffffff030084d717000000001976a914751e76e8199196d454941c45d1b3a323f1433bd688ac00397b12020000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088ac00397b12020000001976a91497697908b1f81654b2aab68f77525538890216e788ac00000000000100e10100000001c4d4fc07b9b2f708167c5072220730b7a8c77ad1d1a57f45a20900b82cbf44d3010000006a47304402203800701089159fd8debcab1267ba8244830f009912f30b6317822bcdb126c19c022073ce4063f3a3e7eddcb5ed97d4d1ecd1227c9dea1f8ed7b86677ce35c6d259df012102d336f15742c8ea21de1cb943a8825e36288842ae50a0583b8be62b6c90b85db8feffffff0210e5fa4f010000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acf0e00bd7450600001976a914e53c38e0c8547c9d3c8aab20fc8bca2eb581fa3188acb4713600000100e201000000014f6d73d6eaa42e43e0ecb2403435ecf554410eaabe6658165728be1cc1fe2e29010000006b483045022100b4a17d5b56c7e46cdfa1098931a97302c24bbcb2ee07daa8ef997a51231d3abc02206ce92427f197f326a3018cf4244f4e3d6d3dc0d21fff1f142dd4a094d30c3b27012102af4d1aa7fbc35980cf797ff5ed9e886c9c025284031900dbd534ee36a2d259dbfeffffff02e092980d3b0600001976a914ae266570dc531ab057310db9c08ded4d2c164bc588ac608d12f8020000001976a91497697908b1f81654b2aab68f77525538890216e788ac3774360000000000', true)
      }
      catch (e) {
        expect(e.code).toBe(core.ParamErrorCode.TransactionSignFailed)
      }
    })
  })
})