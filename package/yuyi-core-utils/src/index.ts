/**
 * @author yuyi
 * @packageDocumentation
 */

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
// import { LodashExtraUtils } from './LodashExtra'
import 'yuyi-core-env'

// const A = Type

export const AAA = { a: { b: { c: 1 } } }
export const AAAA = oc(AAA).a.b.c


export * from './CustomUtils'
export * from './CommonDto'
export * from './OptionsUtils'
export * from './TimeBuffer'
export * from './LodashExtra'
export * from './TypeLib'
export * from './PropertyUtils'
export * from './ParseUtils'
export * from './MobxUtils'
export * from './EventEmitter'
