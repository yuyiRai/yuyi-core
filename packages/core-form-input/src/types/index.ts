import _invariant from 'tiny-invariant'
import _warning from 'tiny-warning'
declare global {
  var invariant: typeof _invariant
  var warning: typeof _warning
}

if (__DEV__) {
  window.invariant = require('tiny-invariant').default
  window.warning = require('tiny-warning').default
}