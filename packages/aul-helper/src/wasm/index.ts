
import * as wasm from '@yuyi/core'
import { repeat } from 'lodash'
import { uuid } from '@yuyi919/utils';

const { get_uuid } = wasm;

function rrr(str, times) {
  return str.repeat ? str.repeat(times) : repeat(str, times)
}
console.time('lodash')
repeat("a", 10)
// console.error(uuid())
console.timeEnd('lodash')

console.time('native')
rrr("a", 10000);
console.timeEnd('native')


console.time('wasm')
// console.error(get_uuid());
wasm.repeat_native("a", 10);
console.timeEnd('wasm')
