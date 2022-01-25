const { btc } = require('../../dist/sign.cjs.js')

const TEST_DATA_1 = {
  network: btc.Network.Mainnet,
  privateKeyHex: '0000000000000000000000000000000000000000000000000000000000000001',
  publicKeyHex: '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
  wif: 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn',
  legacy_address: '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH',
  native_segwit_address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  segwit_address: '3JvL6Ymt8MVWiCNHC7oWU6nLeHNJKLZGLN'
}
const TEST_DATA_2 = {
  network: btc.Network.Testnet,
  privateKeyHex: '7149d6db2352c4d62e0f608aac8e2e2990f26225baaaa875da14f6f3ae7eb6ef',
  publicKeyHex: '0348ecd0e3414d1bf5e2d67ba6c4f3db537fa68cb77ec6dc331443a303a23f10d6',
  wif: 'cRNvHdbMJRqU7NAS1vbBL85rtf6yW4uUe9TZ2PUy6nxUs2HdPa7C',
  legacy_address: 'mgwYpMovFeG9M67SeNCszW5GCMx1TPZTMq',
  native_segwit_address: 'tb1qp70w6sen4ppcly8ftzsp94g6tn829ugslpawy3',
  segwit_address: '2NEDp5epe4Xyddbt8oSJfcBezuVrcG3ovBt'
}
const TEST_DATA_3 = {
  network: btc.Network.Testnet,
  privateKeyHex: 'a950ec757af14446ffa0840a4c92d82c09aab749d835ce9c3e192b1b59174dcd',
  publicKeyHex: '02a8669749c0cf5d647dc092f679aefde3b4b2a62ce10d2ea5642e5345b50a3c51',
  wif: 'cTFq6UKm8AWGVZxZgMbXNcoeZ7Wbq7Vp3qmEzrXuZLVhbAGHYRZ8',
  legacy_address: 'muKYgQ41ndTrgb1r2DW95aGz8EGco5b7ya',
  native_segwit_address: 'tb1qja5hjz93lqt9fv42k68hw5j48zysy9h88z050h',
  segwit_address: '2MuZRKaEDH5Wm2nosbs5ijPDK5sGjmdRaZd'
}

// wif: 'cRVhNydd21CYXUNBrWywoTGvX5AqNbHoicYmr96gaKwSdsutCbE9',
// legacy_address: 'mq82iyB6rShjDM5ahDG1yCirh9Gz9CwNZH',
// native_segwit_address: 'tb1qd9dkx633vnsgxmthhnjqvc43ymslzrz42e59qc',

module.exports = {
  TEST_DATA_1,
  TEST_DATA_2,
  TEST_DATA_3,
}
