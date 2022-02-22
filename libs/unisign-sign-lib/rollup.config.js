// not in use - by jeff 20220222
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import wasm from '@rollup/plugin-wasm'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      browser: true,
    }),
    resolve({ extensions: ['.js', '.ts'], preferBuiltins: true, browser: true }),
    commonjs({
      browser: true,
    }),
    wasm({
      // sync: ['./secp256k1.wasm']
      maxFileSize: 100000000,
    }),
  ],
  // external: ['readable-stream', 'buffer', 'stream', 'string_decoder'],
}
