const { doge } = require('../../dist/sign.cjs.js')

const TEST_DATA_1 = {
  network: doge.Network.Testnet,
  privateKeyHex: '0000000000000000000000000000000000000000000000000000000000000001',
  publicKeyHex: '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
  wif: 'cejxntqoC3o8qiC8HG8DrwoNyiRDBrMCEU8QrUVpLKdXsGy8LpTM',
  legacy_address: 'nesRpRaAbTDmZHwmzBkLd2AtF7Z9L9z5S2',
}
const TEST_DATA_2 = {
  network: doge.Network.Testnet,
  privateKeyHex: '7149d6db2352c4d62e0f608aac8e2e2990f26225baaaa875da14f6f3ae7eb6ef',
  publicKeyHex: '0348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d6',
  wif: 'ciYBRxK9ejfk4QBy85NxvUGqPXWHAuSvy2hp9JBA5kTuRggdayNm',
  legacy_address: 'nVcknaQVg1BtyxPchCsWxkcqTNTtqCzGYg',
}
const TEST_DATA_3 = {
  network: doge.Network.Testnet,
  privateKeyHex: 'a950ec757af14446ffa0840a4c92d82c09aab749d835ce9c3e192b1b59174dcd',
  publicKeyHex: '02a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c51',
  wif: 'ckR6Eo3ZUULYSbz6nWPJxxzd3yuuVx3GNj1W7mE6YJ189pghCYK9',
  legacy_address: 'nhzkecebCzPcKTJ254An3ppZPEnWCM2eWE',
}

module.exports = {
  TEST_DATA_1,
  TEST_DATA_2,
  TEST_DATA_3,
}
