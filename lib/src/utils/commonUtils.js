/* eslint-disable */
import { castArray, cloneDeep, filter, forEach, isEqual, isFunction, isRegExp, concat, isString, keys, last, map, property, reduce, stubArray, takeRight, toArray, toString, values } from 'lodash';
import { EventEmitter } from './EventEmitter';
import { HttpBox } from './HttpBox';
import Utils from '.';
import { typeFilterUtils } from './TypeLib';
const _ = {
    filter, map, forEach
};
if (!Object.keys) {
    Object.keys = keys;
}
if (!Object.values) {
    Object.values = values;
}
export function jsxIf(bool, when, elseValue) {
    if ((Utils.isFunctionFilter(bool) || Utils.stubFunction)()) {
        return when;
    }
    else {
        return elseValue;
    }
}
export default {
    jsxIf,
    stubArray: stubArray,
    stubFunction() { },
    stubObject() {
        return {};
    },
    /**
     * cast computed
     * @param {*} functionOrValue
     * @param  {...any} computedArgs 计算用参数
     */
    castComputed(functionOrValue, ...computedArgs) {
        return isFunction(functionOrValue) ? functionOrValue(...computedArgs) : functionOrValue;
    },
    castFunction(value) {
        return isFunction(value) ? value : function () { return value; };
    },
    castString(value) {
        return isString(value) ? value : toString(value);
    },
    argShifter(todoFunc, startIndex = 1) {
        return function (...args) {
            return todoFunc(...takeRight(args, args.length - startIndex));
        };
    },
    modelValidator(fieldName, validator) {
        const fieldSearcher = property(fieldName);
        if (isRegExp(validator)) {
            return (model) => validator.test(fieldSearcher(model));
        }
        else if (isFunction(validator)) {
            return (model) => validator(fieldSearcher(model), model, fieldName, validator);
        }
        else {
            return (model) => isEqual(fieldSearcher(model), validator);
        }
    },
    getTestArray(length) {
        const arr = [];
        for (let i = length; i > 0; i--) {
            arr[i - 1] = i;
        }
        return arr;
    },
    arrayMap(array, iteratee) {
        var length = array.length;
        var result = Array(length);
        while (length--) {
            result[length] = iteratee(array[length], length);
        }
        return result;
    },
    arrayMap2(array, iteratee) {
        var rLength = array.length % 8, length = rLength, pLength = array.length - rLength, result = Array(array.length);
        while (length--) {
            result[length] = iteratee(array[length], length);
        }
        while (pLength--) {
            var index = rLength + pLength;
            result[index] = iteratee(array[index], index);
        }
        return result;
    },
    arrayMap3(array, iteratee) {
        var index = -1, length = array.length, result = Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    },
    arrayMapDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            if (array[length])
                result[length] = iteratee(array[length], length, array);
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                if (array[index])
                    result[index] = iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
        return result;
    },
    arrayMapToKeysDive(array, key) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            result[length] = Utils.isObject(array[length]) ? array[length][key] : undefined;
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                result[index] = Utils.isObject(array[index]) ? array[index][key] : undefined;
            }
            pLength -= 8;
        }
        return result;
    },
    arrayForEachDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength);
        while (length--) {
            iteratee(array[length], length, array);
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
    },
    arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
            array[offset + index] = values[index];
        }
        return array;
    },
    arrayPushDive(arrayTarget, array) {
        const rLength = array.length % 8, tLength = values.length;
        let length = rLength, pLength = array.length - rLength, offset = 0;
        while (length--) {
            arrayTarget[tLength + offset++] = array[rLength - length - 1];
        }
        const maxPlangth = rLength + pLength + 8;
        while (pLength) {
            const tmp = maxPlangth - pLength;
            let length = 8;
            while (length) {
                arrayTarget[tLength + offset++] = array[tmp - length--];
            }
            pLength -= 8;
        }
    },
    test(length, pi = 8) {
        var test = Utils.getTestArray(length);
        var test2 = (item, index) => item > length / 2;
        var test3 = (item, index) => Utils.arrayMapDive(test, test2);
        setTimeout(() => {
            console.time('arrayMap');
            Utils.arrayMap(test, test3);
            console.timeEnd('arrayMap');
        }, 0);
        setTimeout(() => {
            console.time('arrayMap2');
            Utils.arrayMap2(test, test3);
            console.timeEnd('arrayMap2');
        }, 0);
        setTimeout(() => {
            console.time('arrayMap3');
            Utils.arrayMap3(test, test3);
            console.timeEnd('arrayMap3');
        }, 0);
        setTimeout(() => {
            console.time('arrayMapDive');
            Utils.arrayMapDive(test, test3);
            console.timeEnd('arrayMapDive');
        }, 0);
        setTimeout(() => {
            console.time('_.map');
            _.map(test, test3);
            console.timeEnd('_.map');
        }, 0);
        setTimeout(() => {
            console.time('arrayFilter');
            Utils.arrayFilter(test, test3);
            console.timeEnd('arrayFilter');
        }, 0);
        setTimeout(() => {
            console.time('arrayFilterDive');
            Utils.arrayFilterDive(test, test3);
            console.timeEnd('arrayFilterDive');
        }, 0);
        setTimeout(() => {
            console.time('_.filter');
            _.filter(test, test3);
            console.timeEnd('_.filter');
        }, 0);
        setTimeout(() => {
            console.time('arrayForEachDive');
            var r8 = [];
            Utils.arrayForEachDive(test, (item, index) => {
                r8.push(test3(item, index));
            });
            console.timeEnd('arrayForEachDive');
        }, 0);
        setTimeout(() => {
            console.time('_.forEach');
            var r8 = [];
            _.forEach(test, (item, index) => {
                r8.push(test3(item, index));
            });
            console.timeEnd('_.forEach');
        }, 0);
    },
    arrayFilter(array, predicate) {
        let length = array.length;
        const result = [];
        while (length--) {
            const value = array[length];
            predicate(value, length, array) && result.push(value);
        }
        return result;
    },
    arrayFilterDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = [];
        while (length--) {
            const index = rLength - length - 1;
            iteratee(array[index], index, array) && result.push(array[index]);
        }
        let maxPlangth = rLength + pLength + 8;
        while (pLength) {
            let wlength = 8;
            const tmp = maxPlangth - pLength;
            while (wlength) {
                const index = (tmp - wlength--);
                iteratee(array[index], index, array) && result.push(array[index]);
            }
            pLength -= 8;
        }
        return result;
    },
    validateModelField(model, fieldName, validator) {
        return Utils.modelValidator(fieldName, validator)(model);
    },
    castArray(value, allowEmpty = true) {
        return allowEmpty ? castArray(value) : (Utils.isNotEmptyValue(value) ? castArray(value) : []);
    },
    castObjectArray(objOrArr, allowEmpty = true) {
        return typeFilterUtils.isArrayFilter(objOrArr, allowEmpty
            ? Utils.isObject(objOrArr) && [objOrArr]
            : Utils.isNotEmptyObject(objOrArr) && [objOrArr]) || [];
    },
    createGroupWith(list, keyOrWith) {
        return reduce(Utils.isArrayFilter(list, []), function (map, item) {
            const mapKey = isString(keyOrWith) ? item[keyOrWith] : (isFunction(keyOrWith) ? keyOrWith(item) : "default");
            map[mapKey] = typeFilterUtils.isArrayFilter(map[mapKey], []);
            map[mapKey].push(item);
            return map;
        }, {});
    },
    getEventEmitter() {
        return new EventEmitter();
    },
    waitingPromise(time, emitValue, isError = false) {
        return new Promise((resolve, reject) => {
            setTimeout(isError ? reject : resolve, time, emitValue);
        });
    },
    /**
     * 组件返回
     * @param { { $router: any, $route: any } } instance
     * @param {*} params
     * @param { boolean } isConfirm 是否是经过确认的离开
     */
    pathReturn(instance, params, isConfirm, useBack) {
        if (useBack) {
            return instance.$router.back();
        }
        const { query = {}, path: pathSet = undefined, ...other } = Utils.isObjectFilter(params) || {};
        const path = instance.$route.path.split('\/');
        path.pop(); // 吐出当前页
        instance.$router.push({
            ...other,
            path: path.join('\/'),
            query: {
                ...typeFilterUtils.isObjectFilter(query, {}),
                force: isConfirm === false || isConfirm === true
                // cb: instance.$route.query.cb || new Date().getTime(),
                // tpp: instance.$route.query.tpp,
            }
        });
    },
    HttpBox,
    testEmitter: new EventEmitter(),
    last,
    cloneDeep,
    toArray,
    isEqual,
    reduce,
    forEach,
    concat
};
//# sourceMappingURL=commonUtils.js.map