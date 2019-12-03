import isFunctionLodash from 'lodash/isFunction';
import { Constant$ } from '../Constransts';
export function isFunction<T extends ((...args: any[]) => any)>(value: any): value is T {
  return typeof value === Constant$.KEY_FUNC || value instanceof Constant$.FUNCTION
}
export { isFunctionLodash }
