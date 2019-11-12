// import '@yuyi919/ts-transformer-awesome/env'
import _invariant from 'tiny-invariant'
import _warning from 'tiny-warning'

declare global {
  var invariant: typeof _invariant
  var warning: typeof _warning
}


