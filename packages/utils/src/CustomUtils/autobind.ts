import { cloneDeep } from '../LodashExtra/lodash';
import { isPureObj } from '../LodashExtra/isObject';

/**
 * 自动绑定对象中的方法的this
 * @param obj 
 * @param isCloneDeep default is true
 * @default true
 */
export function autoBindObj<T>(obj: T, isCloneDeep = true) {
  isCloneDeep && (obj = cloneDeep(obj));
  if (isPureObj(obj)) {
    Object.entries(obj).forEach(entry => {
      if (entry[1] instanceof Function) {
        obj[entry[0]] = entry[1].bind(obj);
      }
    });
  }
  return obj;
}
