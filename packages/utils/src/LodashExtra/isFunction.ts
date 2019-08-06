import { isFunction as isFunctionLodash } from 'lodash';
export function isFunction<T extends ((...args: any[]) => any)>(value: any): value is T {
  return typeof value === 'function' || value instanceof Function || isFunctionLodash(value)
}
export { isFunctionLodash }