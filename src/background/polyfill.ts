import { Buffer } from 'buffer'

// some libs like `readable-stream` need `global` variable in node, we have to polyfill it ourselves
;(globalThis as any).global = globalThis
// some libs like `ethereumjs-util` need `Buffer` support in node, we have to polyfill it ourselves
;(globalThis as any).Buffer = Buffer
