const path = require('path')
const fs = require('fs/promises')
// const merge = require('webpack-merge')
// const TerserPlugin = require('terser-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const ROOT = path.dirname(__dirname)
const SRC = path.resolve(ROOT, 'src')
const DIST = path.resolve(ROOT, 'dist')
const REPORTS_DIR = path.join(ROOT, 'reports')

const pkg = (async () => {
  return JSON.parse(await fs.readFile(path.join(ROOT, 'package.json')))
})();

function generateBanner (env) {
  return `@license
UniSign Sign Library v${pkg.version} in ${env}
Auth: ${pkg.author}`
}

// function generateConfigWithOptimizationOn (config, name) {
//   return merge(config, {
//     output: {
//       filename: getBundleNameFromConfig(config, name) + '.min.js',
//     },
//     optimization: {
//       minimize: true,
//       minimizer: [new TerserPlugin({
//         terserOptions: {
//           output: {
//             comments: /@license/i,
//           },
//         },
//         extractComments: false,
//       })]
//     },
//     devtool: false,
//   })
// }
//
// function shouldGenerateReport (env, config, name) {
//   // 生成 bundle 分析报告
//   if (env.analysis) {
//     config.plugins.push(new BundleAnalyzerPlugin({
//       analyzerMode: 'static',
//       reportFilename: path.join(REPORTS_DIR, getBundleNameFromConfig(config, name) + '.report.html'),
//       openAnalyzer: false
//     }))
//   }
// }

module.exports = {
  ROOT,
  SRC,
  DIST,
  REPORTS_DIR,
  generateBanner,
}
