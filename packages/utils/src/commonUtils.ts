import { Constant$ } from './Constransts';
import { EventEmitter } from './EventEmitter';
import { isEqual, isFunction, isRegExp, keys, property, values } from './LodashExtra';
import { IFunction } from './TsUtils';
import { expect$ } from './TypeLib';

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

/**
 * @beta
 * @param bool 
 * @param when 
 * @param elseValue 
 */
export function jsxIf(bool: any, when: any, elseValue?: any) {
  if ((expect$.isFunction.filter(bool) || (() => bool))()) {
    return when;
  } else {
    return elseValue
  }
}
export const testEmitter = new EventEmitter()

// tslint:disable-next-line: no-empty

/**
 * 函数参数偏移
 * @param fn 
 * @param startIndex 起始偏移量
 * @param endIndex 如有必要，末尾偏移量（必须大于startIndex）
 */
export function argShifter(fn: (...values: any[]) => any, startIndex?: number, endIndex?: number): any
export function argShifter(fn: (...values: any[]) => any) {
  // tslint:disable-next-line: one-variable-per-declaration
  var _args = arguments, _lg = _args.length
  var startIndex = _lg > 1 && _args[1] !== undefined ? _args[1] : 1;
  var endIndex = _lg > 2 ? _args[2] : undefined;
  return startIndex > 0 && fn ? (function () {
    // console.log('args', Constant$.ARR_SLICE(arguments, startIndex))
    return Constant$.APPLY(fn, Constant$.ARR_SLICE(arguments, startIndex, endIndex))
  }) : fn
}

export function modelValidator<T>(fieldName: string, validator: RegExp | IFunction | T) {
  const fieldSearcher = property<any, string>(fieldName)
  if (isRegExp(validator)) {
    return (model: T) => validator.test(fieldSearcher(model));
  } else if (isFunction(validator)) {
    return (model: T) => validator(fieldSearcher(model), model, fieldName, validator);
  } else {
    return (model: T) => isEqual._(fieldSearcher(model), validator)
  }
}
export function validateModelField(model: any, fieldName: any, validator: any) {
  return modelValidator(fieldName, validator)(model)
}

// export function getTestArray(length: number) {
//   const arr = []
//   for (let i = length; i > 0; i--) {
//     arr[i - 1] = i
//   }
//   return arr
// }
// export function arrayMap(array: any[], iteratee: any) {
//   let length = array.length;
//   let result = Array(length);
//   while (length--) {
//     result[length] = iteratee(array[length], length);
//   }
//   return result;
// }
// export function arrayMap2(array: any[], iteratee: any) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   let rLength = array.length % 8, length = rLength, pLength = array.length - rLength, result = Array(array.length);
//   while (length--) {
//     result[length] = iteratee(array[length], length);
//   }
//   while (pLength--) {
//     let index = rLength + pLength
//     result[index] = iteratee(array[index], index);
//   }
//   return result;
// }
// export function arrayMap3(array: any[], iteratee: any) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   let index = -1, length = array.length, result = Array(length);
//   while (++index < length) {
//     result[index] = iteratee(array[index], index, array);
//   }
//   return result;
// }
// export function arrayMapDive(array: any[], iteratee: any) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
//   while (length--) {
//     if (array[length]) {
//       result[length] = iteratee(array[length], length, array);
//     }
//   }
//   while (pLength) {
//     let wlength = 8
//     const tmp = rLength + pLength;
//     while (wlength) {
//       const index = tmp - wlength--
//       if (array[index]) {
//         result[index] = iteratee(array[index], index, array);
//       }
//     }
//     pLength -= 8
//   }
//   return result;
// }
export function mapToKeyValues(array: any[], key: any) {
  // tslint:disable-next-line: one-variable-per-declaration
  let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
  while (length--) {
    result[length] = array[length] ? array[length][key] : undefined;
  }
  while (pLength) {
    let wlength = 8
    const tmp = rLength + pLength;
    while (wlength) {
      const index = tmp - wlength--
      result[index] = array[index] ? array[index][key] : undefined;
    }
    pLength -= 8
  }
  return result;
}
// export function arrayForEachDive(array: any[], iteratee: any) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength);
//   while (length--) {
//     iteratee(array[length], length, array);
//   }
//   while (pLength) {
//     let wlength = 8
//     const tmp = rLength + pLength;
//     while (wlength) {
//       const index = tmp - wlength--
//       iteratee(array[index], index, array);
//     }
//     pLength -= 8
//   }
// }
// export function arrayPush(array: any[], values: any[]) {
//   const values2 = values
//   // tslint:disable-next-line: one-variable-per-declaration
//   let index = 0,
//     length = values2.length,
//     offset = array.length;

//   while (index < length) {
//     // debugger
//     array[offset + index] = values2[index++];
//   }
//   return array;
// }
// export function arrayPushDive(arrayTarget: any[], array: any[]) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   const rLength = array.length % 8, tLength = values.length
//   // tslint:disable-next-line: one-variable-per-declaration
//   let length = rLength, pLength = array.length - rLength, offset = 0
//   while (length--) {
//     arrayTarget[tLength + offset++] = array[rLength - length - 1]
//   }
//   const maxPlangth = rLength + pLength + 8
//   while (pLength) {
//     const tmp = maxPlangth - pLength;
//     let length = 8
//     while (length) {
//       arrayTarget[tLength + offset++] = array[tmp - length--]
//     }
//     pLength -= 8
//   }
// }
// // test(length: number, pi = 8) {
// //   let test = getTestArray(length)
// //   let test2 = (item: any, index: any) => item > length / 2
// //   let test3 = (item: any, index: any) => arrayMapDive(test, test2)
// //   setTimeout(() => {
// //     console.time('arrayMap')
// //     arrayMap(test, test3)
// //     console.timeEnd('arrayMap')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayMap2')
// //     arrayMap2(test, test3)
// //     console.timeEnd('arrayMap2')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayMap3')
// //     arrayMap3(test, test3)
// //     console.timeEnd('arrayMap3')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayMapDive')
// //     arrayMapDive(test, test3)
// //     console.timeEnd('arrayMapDive')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('_.map')
// //     _.map(test, test3)
// //     console.timeEnd('_.map')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayFilter')
// //     arrayFilter(test, test3)
// //     console.timeEnd('arrayFilter')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayFilterDive')
// //     arrayFilterDive(test, test3)
// //     console.timeEnd('arrayFilterDive')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('_.filter')
// //     _.filter(test, test3)
// //     console.timeEnd('_.filter')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('arrayForEachDive')
// //     let r8 = []
// //     arrayForEachDive(test, (item: any, index: any) => {
// //       r8.push(test3(item, index))
// //     })
// //     console.timeEnd('arrayForEachDive')
// //   }, 0)
// //   setTimeout(() => {
// //     console.time('_.forEach')
// //     let r8 = []
// //     _.forEach(test, (item, index) => {
// //       r8.push(test3(item, index))
// //     })
// //     console.timeEnd('_.forEach')
// //   }, 0)
// // }
// export function arrayFilter(array: any[], predicate: any) {
//   let length = array.length
//   const result = [];
//   while (length--) {
//     const value = array[length]
//     predicate(value, length, array) && result.push(value);
//   }
//   return result;
// }
// export function arrayFilterDive(array: any[], iteratee: any) {
//   // tslint:disable-next-line: one-variable-per-declaration
//   let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = [];
//   while (length--) {
//     const index = rLength - length - 1
//     iteratee(array[index], index, array) && result.push(array[index]);
//   }
//   let maxPlangth = rLength + pLength + 8
//   while (pLength) {
//     let wlength = 8
//     const tmp = maxPlangth - pLength
//     while (wlength) {
//       const index = (tmp - wlength--)
//       iteratee(array[index], index, array) && result.push(array[index]);
//     }
//     pLength -= 8
//   }
//   return result;
// }
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
  const { query = {}, path: pathSet = undefined, ...other } = expect$.isObject.filter(params) || {} as any
  const path = instance.$route.path.split('\/');
  path.pop() // 吐出当前页
  instance.$router.push({
    ...other,
    path: path.join('/'),
    query: {
      ...expect$.isObject.filter(query, {}),
      force: isConfirm === false || isConfirm === true
      // cb: instance.$route.query.cb || new Date().getTime(),
      // tpp: instance.$route.query.tpp,
    }
  })
}

