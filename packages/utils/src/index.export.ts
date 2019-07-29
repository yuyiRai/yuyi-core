// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { Utils, IUtils } from './Utils'

// function map(f) {
//   var mapped = new Array(this.length)

//   for (var i = 0; i < this.length; i++) {
//     mapped[i] = f(this[i], i)
//   }

//   return mapped
// }
// const list = [1, 2, 3]
// list:: map(e => e + 1)

// const baz = (v: any) => v
// const bar = (v: any) => v
// const foo = (v: any) => v
// const result: string = 'hello world' |> baz |> bar |> foo
// console.error(result)
// import { LodashExtraUtils } from './LodashExtra'
export * from './index'
export { Utils, IUtils }
export default Utils