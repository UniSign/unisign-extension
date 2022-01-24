/**
 * Reexport the Buffer class from buffer module directly
 *
 * This is required by webpack.ProvidePlugin to provide default imports for some dependencies.
 */
const { Buffer } = require('buffer')
module.exports = Buffer
