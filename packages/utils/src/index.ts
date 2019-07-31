/**
 * @author yuyi
 * @packageDocumentation
 */

import { oc } from 'ts-optchain';
import { ArrayList } from 'typescriptcollectionsframework'
// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
// import { LodashExtraUtils } from './LodashExtra'
// import '@yuyi/env'

// const A = Type

export const AAA = { a: { b: { c: 3 } } }
export const AAAA = oc(AAA).a.b.c

export const A = new ArrayList(undefined);


export * from './CustomUtils'
export * from './OptionsUtils'
export * from './TimeBuffer'
export * from './LodashExtra'
export * from './TypeLib'
export * from './PropertyUtils'
export * from './ParseUtils'
export * from './MobxUtils'
export * from './EventEmitter'
export * from './WasmLoader'

export * from './Utils'
