export enum Network {
  Mainnet,
  Testnet,
}

// Copy from ckb-sdk-js
export const MAX_BECH32_LIMIT = 1023

export enum SystemScriptTypeId {
  SighashAll = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  MultisigAll = '0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8',
}

export const EMPTY_WITNESS_ARGS: CKBComponents.WitnessArgs = {
  lock: '',
  inputType: '',
  outputType: '',
}
