/**
 * 封装自lodash的实用工具集合
 * @packageDocumentation
 */
import {
  toArray, toString, escapeRegExp,
  isArray, isArrayLike, isRegExp, isBoolean, isDate, isEmpty, isFunction, isNil, isObject, isString,
  includes, forEach, last, assign, filter, map, reduce,
  cloneDeep, trim, keys, values, concat, find, join, some,
  differenceWith, property, takeRight, set, get,
  camelCase,
  ArrayIterator
} from 'lodash';

export {
  toArray, toString, escapeRegExp,
  isArray, isArrayLike, isRegExp, isBoolean, isDate, isEmpty, isFunction, isNil, isObject, isString,
  includes, forEach, last, assign, filter, map, reduce,
  cloneDeep, trim, keys, values, concat, find, join, some,
  differenceWith, property, takeRight, set, get,
  camelCase,
  ArrayIterator
}


export * from './isEqual'
export * from './castUtils'
export * from './isEqual'
export * from './isNumber'
export * from './stub'
export * from './reduceMap'
export * from './createGroupWith'