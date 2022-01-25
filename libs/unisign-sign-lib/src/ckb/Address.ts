import { Buffer } from 'buffer'
import * as ckbUtil from '@nervosnetwork/ckb-sdk-utils'

import { MAX_BECH32_LIMIT, Network, SystemScriptTypeId } from './const'

export class Address {
  #script: CKBComponents.Script

  protected constructor (script: CKBComponents.Script) {
    this.#script = script
  }

  get script (): CKBComponents.Script {
    return this.#script
  }

  static fromBuffer (publicKey: Buffer): Address {
    const script: CKBComponents.Script = {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type',
      args: '0x' + ckbUtil.blake160(publicKey, 'hex'),
    }

    return new Address(script)
  }

  static fromScript (script: CKBComponents.Script): Address {
    return new Address(script)
  }

  toLegacyShortAddress (network = Network.Mainnet): string {
    let prefix
    if (network === Network.Mainnet) {
      prefix = ckbUtil.AddressPrefix.Mainnet
    }
    else {
      prefix = ckbUtil.AddressPrefix.Testnet
    }

    const args = this.#script.args
    let codeHashIndex
    switch (this.#script.codeHash) {
      case SystemScriptTypeId.SighashAll:
        codeHashIndex = '0x00'
        break
      case SystemScriptTypeId.MultisigAll:
        codeHashIndex = '0x01'
        break
    }
    const payload = ckbUtil.toAddressPayload(args, ckbUtil.AddressType.HashIdx, codeHashIndex)

    return ckbUtil.bech32.encode(prefix, ckbUtil.bech32.toWords(payload), MAX_BECH32_LIMIT)
  }

  toFullAddress (network = Network.Mainnet): string {
    return ckbUtil.scriptToAddress(this.#script, network === Network.Mainnet)
  }
}
