import { ProtocolWithReturn } from '~~/libs/webext-bridge'

declare module '~~/libs/webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'wallet-controller': ProtocolWithReturn<{ method: string; params: any[] }, any>
    'background-to-provider': ProtocolWithReturn<{ event: string; data: any }, any>
    'provider-to-background': ProtocolWithReturn<{ method: string; params: object }, any>
  }
}
