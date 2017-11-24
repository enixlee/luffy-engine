var merge = require('webpack-merge')
var version = require('./version')

module.exports = merge(version, {
  NODE_ENV: '"production"'
})
