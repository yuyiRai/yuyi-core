
import sample from './imports.wasm'

var instance = sample({
  env: {
    foobar: x => t.is(x, 10, 'got callback')
  }
})

instance.exports.main()
