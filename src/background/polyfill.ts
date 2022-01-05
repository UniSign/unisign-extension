import { Buffer } from 'buffer'

// some libs like `readable-stream` need `global` variable in node, we have to polyfill it ourselves
;(window as any).global = window
// some libs like `ethereumjs-util` need `Buffer` support in node, we have to polyfill it ourselves
;(window as any).Buffer = Buffer
