'use strict'

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./index.cjs.development.js')
} else {
  module.exports = require('./index.cjs.production.min.js')
}
