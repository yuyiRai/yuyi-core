import { isFunction as isFunctionLodash } from 'lodash';
import { Constant$ } from '../Constransts';
export function isFunction<T extends ((...args: any[]) => any)>(value: any): value is T {
  return typeof value === Constant$.KEY_FUNC || value instanceof Constant$.FUNCTION || isFunctionLodash(value)
}
export { isFunctionLodash }
