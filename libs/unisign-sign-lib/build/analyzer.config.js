const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')

const baseConfigGenerator = require('./base.config')
const buildUtil = require('./util.js')
const { DIST } = buildUtil

module.exports = async function (env, argv) {
  const baseConfig = baseConfigGenerator(env, argv)
  return merge(baseConfig, {
    target: 'web',
    output: {
      libraryTarget: 'module',
      module: true,
      filename: '[name].mjs',
      path: DIST,
    },
    experiments: {
      outputModule: true,
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerHost: '127.0.0.1',
        analyzerPort: 3001,
        defaultSizes: 'gzip'
      })
    ]
  })
}
