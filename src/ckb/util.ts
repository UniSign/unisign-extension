import { Buffer } from 'buffer'
import resultFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'

import { crypto } from '~/core'

export const fromRPCFormatter = resultFormatter
export const toRPCFormatter = paramsFormatter

export function hash256 (buf: Buffer): Buffer {
  return Buffer.from(crypto.sha256(crypto.sha256(buf)))
}

export function hash160 (buf: Buffer): Buffer {
  return Buffer.from(crypto.ripemd160(crypto.sha256(buf)))
}

export function fromRPCRawTransaction (tx: RPC.RawTransaction): CKBComponents.RawTransaction {
  if (!tx) return tx
  const {
    cell_deps: cellDeps = [],
    inputs = [],
    outputs = [],
    outputs_data: outputsData = [],
    header_deps: headerDeps = [],
    ...rest
  } = tx

  return {
    cellDeps: cellDeps.map(fromRPCFormatter.toCellDep),
    inputs: inputs.map(fromRPCFormatter.toInput),
    outputs: outputs.map(fromRPCFormatter.toOutput),
    outputsData,
    headerDeps,
    ...rest,
  }
}

export const toRPCRawTransaction = toRPCFormatter.toRawTransaction
