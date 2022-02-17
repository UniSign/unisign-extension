const { ckb } = require('../../dist/sign.cjs.js')

const TEST_DATA_1 = {
  network: ckb.Network.Testnet,
  privateKeyHex: '0000000000000000000000000000000000000000000000000000000000000001',
  publicKeyHex: '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
  script: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0x75178f34549c5fe9cd1a0c57aebd01e7ddf9249e',
  },
  shortAddress: 'ckt1qyq829u0x32fchlfe5dqc4awh5q70h0eyj0qh8ngj4',
  fullAddress: 'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt4z78ng4yutl5u6xsv27ht6q08mhujf8s2r0n40',
}
const TEST_DATA_2 = {
  network: ckb.Network.Testnet,
  privateKeyHex: '0000000000000000000000000000000000000000000000000000000000000002',
  publicKeyHex: '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
  script: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0xa3c778981c19e1dcc611fb2132dcdaac075a5064',
  },
  shortAddress: 'ckt1qyq283mcnqwpncwuccglkgfjmnd2cp662pjqykjl03',
  fullAddress: '',
}
const TEST_DATA_3 = {
  network: ckb.Network.Testnet,
  privateKeyHex: '0000000000000000000000000000000000000000000000000000000000000003',
  publicKeyHex: '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
  script: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0x67f08e2153e10e8d4f358b6090b44bd6a9745a6d',
  },
  shortAddress: 'ckt1qyqx0uywy9f7zr5dfu6ckcysk39ad2t5tfksfauavq',
  fullAddress: '',
}

const UNSIGNED_TX = `{
  "transaction": {
    "version": "0x0",
    "cell_deps": [
      {
        "out_point": {
          "tx_hash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
          "index": "0x0"
        },
        "dep_type": "dep_group"
      }
    ],
    "header_deps": [],
    "inputs": [
      {
        "since": "0x0",
        "previous_output": {
          "tx_hash": "0x429c949b807ce7b4ff937eb0c7b7b61efa1bbfceccb5eda0b4ab73ede447bf57",
          "index": "0x0"
        }
      },
      {
        "since": "0x0",
        "previous_output": {
          "tx_hash": "0x430663d7b2ec39cd6e6020ec72ed56f346744c157ed181c844843843354b908b",
          "index": "0x0"
        }
      }
    ],
    "outputs": [
      {
        "capacity": "0x2e8af7ef00",
        "lock": {
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type",
          "args": "0x67f08e2153e10e8d4f358b6090b44bd6a9745a6d"
        },
        "type": null
      }
    ],
    "outputs_data": [
      "0x68656c6c6f20776f726c64"
    ],
    "witnesses": []
  },
  "multisig_configs": {},
  "cells": [
    {
      "out_point": {
        "tx_hash": "0x429c949b807ce7b4ff937eb0c7b7b61efa1bbfceccb5eda0b4ab73ede447bf57",
        "index": "0x0"
      },
      "output": {
        "capacity": "0x174876e800",
        "lock": {
          "args": "0xa3c778981c19e1dcc611fb2132dcdaac075a5064",
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type"
        },
        "type": null
      }
    },
    {
      "out_point": {
        "tx_hash": "0x430663d7b2ec39cd6e6020ec72ed56f346744c157ed181c844843843354b908b",
        "index": "0x0"
      },
      "output": {
        "capacity": "0x174876e800",
        "lock": {
          "args": "0x75178f34549c5fe9cd1a0c57aebd01e7ddf9249e",
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type"
        },
        "type": null
      }
    }
  ],
  "signatures": {}
}`
const SIGNED_TX = '{"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37","index":"0x0"},"dep_type":"dep_group"}],"inputs":[{"previous_output":{"tx_hash":"0x429c949b807ce7b4ff937eb0c7b7b61efa1bbfceccb5eda0b4ab73ede447bf57","index":"0x0"},"since":"0x0"},{"previous_output":{"tx_hash":"0x430663d7b2ec39cd6e6020ec72ed56f346744c157ed181c844843843354b908b","index":"0x0"},"since":"0x0"}],"outputs":[{"capacity":"0x2e8af7ef00","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0x67f08e2153e10e8d4f358b6090b44bd6a9745a6d"},"type":null}],"outputs_data":["0x68656c6c6f20776f726c64"],"header_deps":[],"witnesses":["0x55000000100000005500000055000000410000003a7112e220b789e963c2f609b960caaf11c8eb3bed89f701b9532ca1020c03a45d5998440c60768b7b71e6ca587c879df8c83ca6da6d5f51f033678abf40ebc000","0x5500000010000000550000005500000041000000068df73c55e617f2cb9ef61a349c6e5832779dbe1c87af74c1e4876c5ba6617749aaf96404c97dfa89539bec08d132900b9aaae4149b471ba35d3f6f8d60ce8c01"]}'

module.exports = {
  TEST_DATA_1,
  TEST_DATA_2,
  TEST_DATA_3,
  UNSIGNED_TX,
  SIGNED_TX,
}
