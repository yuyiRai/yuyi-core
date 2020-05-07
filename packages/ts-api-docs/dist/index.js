
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ts-api-docs.cjs.production.min.js')
} else {
  module.exports = require('./ts-api-docs.cjs.development.js')
}
