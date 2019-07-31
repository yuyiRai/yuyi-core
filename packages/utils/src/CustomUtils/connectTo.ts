/**
 * @module CustomUtils
 */
import { typeUtils } from '../TypeLib';
export function connectTo(target: any, source: any, ...keyNames: string[]) {
  if (typeUtils.isNil(target) || typeUtils.isNil(source)) {
    return false;
  }
  if (keyNames.length === 0) {
    keyNames = Object.keys(source);
  }
  for (const keyName of keyNames) {
    if (!Object.getOwnPropertyDescriptor(target, keyName)) {
      Object.defineProperty(target, keyName, {
        get() {
          return source[keyName];
        },
        set(value) {
          source[keyName] = value;
        }
      });
    }
  }
  return true;
}
