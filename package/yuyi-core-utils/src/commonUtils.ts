/**
 * @module CommonUtils
 */
import { castArray as castArrayLodash, cloneDeep, concat, escapeRegExp, forEach, isEqual as isEqualLodash, isFunction, isRegExp, isString, keys, last, property, reduce, stubArray, takeRight, toArray, toString, values } from 'lodash';
import { IKeyValueMap } from 'mobx';
import Utils from '.';
import { EventEmitter } from './EventEmitter';
import { HttpBox } from './HttpBox';
import { typeFilterUtils } from './TypeLib';

// const _ = {
//   filter,map,forEach
// }

if (!Object.keys) {
  Object.keys = keys
}
declare global {
  export interface Object {
    values: typeof values;
  }
}
if (!Object.values) {
  Object.values = values
}

export function jsxIf(bool: any, when: any, elseValue?: any) {
  if ((Utils.isFunctionFilter(bool) || (() => bool))()) {
    return when;
  } else {
    return elseValue
  }
}
export const testEmitter = new EventEmitter()

// tslint:disable-next-line: no-empty
export function stubFunction(...args: any[]) { }
export function stubObject() {
  return {};
}
/**
 * cast computed
 * @param {*} functionOrValue 
 * @param  {...any} computedArgs 计算用参数 
 */
export function castComputed<T>(functionOrValue: T extends Function ? T : any, ...computedArgs: any[]) {
  return isFunction(functionOrValue) ? functionOrValue(...computedArgs) : functionOrValue
}
export function castFunction(value: any) {
  return isFunction(value) ? value : function () { return value; };
}
export function castString(value: any) {
  return isString(value) ? value : toString(value)
}
export function argShifter(todoFunc: any, startIndex = 1) {
  return function (...args: any[]) {
    return todoFunc(...takeRight(args, args.length - startIndex))
  }
}
export function modelValidator<T>(fieldName: any, validator: any) {
  const fieldSearcher = property<any, string>(fieldName)
  if (isRegExp(validator)) {
    return (model: T) => validator.test(fieldSearcher(model));
  } else if (isFunction(validator)) {
    return (model: T) => validator(fieldSearcher(model), model, fieldName, validator);
  } else {
    return (model: T) => isEqualLodash(fieldSearcher(model), validator)
  }
}
export function getTestArray(length: number) {
  const arr = []
  for (let i = length; i > 0; i--) {
    arr[i - 1] = i
  }
  return arr
}
export function arrayMap(array: any[], iteratee: any) {
  let length = array.length;
  let result = Array(length);
  while (length--) {
    result[length] = iteratee(array[length], length);
  }
  return result;
}
export function arrayMap2(array: any[], iteratee: any) {
  // tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = array.length - rLength, result = Array(array.length);
  while (length--) {
    result[length] = iteratee(array[length], length);
  }
  while (pLength--) {
    let index = rLength + pLength
    result[index] = iteratee(array[index], index);
  }
  return result;
}
export function arrayMap3(array: any[], iteratee: any) {
// tslint:disable-next-line: one-variable-per-declaration
  let index = -1, length = array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
export function arrayMapDive(array: any[], iteratee: any) {
// tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
  while (length--) {
    if (array[length]) {
      result[length] = iteratee(array[length], length, array);
    }
  }
  while (pLength) {
    let wlength = 8
    const tmp = rLength + pLength;
    while (wlength) {
      const index = tmp - wlength--
      if (array[index]) {
        result[index] = iteratee(array[index], index, array);
      }
    }
    pLength -= 8
  }
  return result;
}
export function arrayMapToKeysDive(array: any[], key: any) {
// tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
  while (length--) {
    result[length] = Utils.isObject(array[length]) ? array[length][key] : undefined;
  }
  while (pLength) {
    let wlength = 8
    const tmp = rLength + pLength;
    while (wlength) {
      const index = tmp - wlength--
      result[index] = Utils.isObject(array[index]) ? array[index][key] : undefined;
    }
    pLength -= 8
  }
  return result;
}
export function arrayForEachDive(array: any[], iteratee: any) {
// tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength);
  while (length--) {
    iteratee(array[length], length, array);
  }
  while (pLength) {
    let wlength = 8
    const tmp = rLength + pLength;
    while (wlength) {
      const index = tmp - wlength--
      iteratee(array[index], index, array);
    }
    pLength -= 8
  }
}
export function arrayPush(array: any[], values: any[]) {
  const values2 = values
// tslint:disable-next-line: one-variable-per-declaration
  let index = 0,
    length = values2.length,
    offset = array.length;

  while (index < length) {
    // debugger
    array[offset + index] = values2[index++];
  }
  return array;
}
export function arrayPushDive(arrayTarget: any[], array: any[]) {
// tslint:disable-next-line: one-variable-per-declaration
  const rLength = array.length % 8, tLength = values.length
// tslint:disable-next-line: one-variable-per-declaration
  let length = rLength, pLength = array.length - rLength, offset = 0
  while (length--) {
    arrayTarget[tLength + offset++] = array[rLength - length - 1]
  }
  const maxPlangth = rLength + pLength + 8
  while (pLength) {
    const tmp = maxPlangth - pLength;
    let length = 8
    while (length) {
      arrayTarget[tLength + offset++] = array[tmp - length--]
    }
    pLength -= 8
  }
}
// test(length: number, pi = 8) {
//   let test = Utils.getTestArray(length)
//   let test2 = (item: any, index: any) => item > length / 2
//   let test3 = (item: any, index: any) => Utils.arrayMapDive(test, test2)
//   setTimeout(() => {
//     console.time('arrayMap')
//     Utils.arrayMap(test, test3)
//     console.timeEnd('arrayMap')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayMap2')
//     Utils.arrayMap2(test, test3)
//     console.timeEnd('arrayMap2')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayMap3')
//     Utils.arrayMap3(test, test3)
//     console.timeEnd('arrayMap3')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayMapDive')
//     Utils.arrayMapDive(test, test3)
//     console.timeEnd('arrayMapDive')
//   }, 0)
//   setTimeout(() => {
//     console.time('_.map')
//     _.map(test, test3)
//     console.timeEnd('_.map')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayFilter')
//     Utils.arrayFilter(test, test3)
//     console.timeEnd('arrayFilter')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayFilterDive')
//     Utils.arrayFilterDive(test, test3)
//     console.timeEnd('arrayFilterDive')
//   }, 0)
//   setTimeout(() => {
//     console.time('_.filter')
//     _.filter(test, test3)
//     console.timeEnd('_.filter')
//   }, 0)
//   setTimeout(() => {
//     console.time('arrayForEachDive')
//     let r8 = []
//     Utils.arrayForEachDive(test, (item: any, index: any) => {
//       r8.push(test3(item, index))
//     })
//     console.timeEnd('arrayForEachDive')
//   }, 0)
//   setTimeout(() => {
//     console.time('_.forEach')
//     let r8 = []
//     _.forEach(test, (item, index) => {
//       r8.push(test3(item, index))
//     })
//     console.timeEnd('_.forEach')
//   }, 0)
// }
export function arrayFilter(array: any[], predicate: any) {
  let length = array.length
  const result = [];
  while (length--) {
    const value = array[length]
    predicate(value, length, array) && result.push(value);
  }
  return result;
}
export function arrayFilterDive(array: any[], iteratee: any) {
  // tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = [];
  while (length--) {
    const index = rLength - length - 1
    iteratee(array[index], index, array) && result.push(array[index]);
  }
  let maxPlangth = rLength + pLength + 8
  while (pLength) {
    let wlength = 8
    const tmp = maxPlangth - pLength
    while (wlength) {
      const index = (tmp - wlength--)
      iteratee(array[index], index, array) && result.push(array[index]);
    }
    pLength -= 8
  }
  return result;
}
export function validateModelField(model: any, fieldName: any, validator: any) {
  return Utils.modelValidator(fieldName, validator)(model)
}
export function castArray(value: any, allowEmpty = true) {
  return allowEmpty ? castArrayLodash(value) : (Utils.isNotEmptyValue(value) ? castArrayLodash(value) : [])
}
export function castObjectArray(objOrArr: any[], allowEmpty = true): any[] {
  return typeFilterUtils.isArrayFilter(
    objOrArr,
    allowEmpty
      ? Utils.isObject(objOrArr) && [objOrArr]
      : Utils.isNotEmptyObject(objOrArr) && [objOrArr],
  ) || []
}
export function createGroupWith<T = any>(list: T[], keyOrWith: string | ((item: T) => string)): IKeyValueMap<T[]> {
  return reduce(Utils.isArrayFilter(list, []), function (map, item) {
    const mapKey = isString(keyOrWith) ? item[keyOrWith] : (isFunction(keyOrWith) ? keyOrWith(item) : "default")
    map[mapKey] = typeFilterUtils.isArrayFilter(map[mapKey], [])
    map[mapKey].push(item)
    return map;
  }, {})
}
export function getEventEmitter() {
  return new EventEmitter()
}
export function waitingPromise<V = any>(time: number, emitValue?: any, isError = false): Promise<V> {
  return new Promise((resolve, reject) => {
    setTimeout(isError ? reject : resolve, time, emitValue);
  })
}
/**
 * 组件返回
 * @param instance 
 * @param params 
 * @param isConfirm 是否是经过确认的离开
 */
export function pathReturn(instance: { $router: any, $route: any }, params: any, isConfirm: boolean, useBack: boolean) {
  if (useBack) {
    return instance.$router.back()
  }
  const { query = {}, path: pathSet = undefined, ...other } = Utils.isObjectFilter(params) || {}
  const path = instance.$route.path.split('\/');
  path.pop() // 吐出当前页
  instance.$router.push({
    ...other,
    path: path.join('\/'),
    query: {
      ...typeFilterUtils.isObjectFilter(query, {}),
      force: isConfirm === false || isConfirm === true
      // cb: instance.$route.query.cb || new Date().getTime(),
      // tpp: instance.$route.query.tpp,
    }
  })
}
export function isEqual<A = any, B = any>(valueA: A | any, valueB: B | any, noStrict: boolean = false): boolean {
  const ia = Utils.isNotEmptyValueFilter
  if (noStrict) {
    return ia(valueA) === ia(valueB) || isEqualLodash(ia(valueA), ia(valueB))
  } else if (valueA === valueB) {
    return true
  }
  return isEqualLodash(valueA, valueB)
}


export { HttpBox, last, cloneDeep, toArray, stubArray, toString, reduce, forEach, concat, escapeRegExp };
