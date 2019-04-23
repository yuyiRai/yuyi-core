/* eslint-disable */
import { assign, concat, differenceWith, filter, isArray, isEqual, join, keys, reduce, values } from 'lodash';
import Utils from './';
import CommonDto from "./CommonDto";
export var CustomUtils = {
    uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    },
    createObjectKey: function (obj) {
        return join(concat(keys(obj), values(obj)));
    },
    pipe: function (data) {
        var funcArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funcArr[_i - 1] = arguments[_i];
        }
        return reduce(funcArr, function (value, func) { return (Utils.isFunctionFilter(func) || Utils.stubFunction)(value); }, data);
    },
    zipEmptyData: function (object, isRemoveRepeat) {
        if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
        return isArray(object)
            ? Utils.pipe(filter(object, function (v) { return Utils.isNotEmptyValue(v); }), function (list) { return Utils.jsxIf(isRemoveRepeat, Array.from(new Set(list)), list); })
            : reduce(filter(keys(object), function (k) { return Utils.isNotEmptyValue(object[k]); }), function (o, key) {
                var _a;
                return assign(o, (_a = {}, _a[key] = object[key], _a));
            }, {});
    },
    zipEmptyDataNative: function (object) {
        return isArray(object)
            ? object.filter(function (v) { return Utils.isNotEmptyValue(v); })
            : Object.keys(object)
                .filter(function (k) { return Utils.isNotEmptyValue(object[k]); })
                .reduce(function (o, k) {
                var _a;
                return Object.assign(o, (_a = {},
                    _a[k] = object[k],
                    _a));
            }, {});
    },
    downloadFile: function (fileId, fileName) {
        var a = document.createElement('a');
        a.href = "/api/file/get?id=" + fileId;
        a.download = fileName || fileId;
        a.click();
        a.remove();
    },
    // 判断两个数组是否无序相等
    likeArray: function (arr, array) {
        // if the other array is a falsy value, return
        if (!Utils.isArray(array) || !Utils.isArray(arr))
            return false;
        // compare lengths - can save a lot of time 
        if (arr.length != array.length)
            return false;
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var v = arr_1[_i];
            if (!array.includes(v)) {
                return false;
            }
        }
        return true;
    },
    getDtoOrFormValue: function (key, formOrDto) {
        if (formOrDto instanceof CommonDto) {
            return formOrDto.get(key);
        }
        else if (Utils.isObject(formOrDto)) {
            return formOrDto[key];
        }
        else {
            return undefined;
        }
    },
    jsGetAge: function (strBirthday) {
        var returnAge;
        var strBirthdayArr = strBirthday.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];
        var d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();
        if (nowYear + '' == birthYear) {
            returnAge = 0; //同年 则为0岁
        }
        else {
            var ageDiff = nowYear - parseInt(birthYear); //年之差
            if (ageDiff > 0) {
                if (nowMonth + '' == birthMonth) {
                    var dayDiff = nowDay - parseInt(birthDay); //日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
                else {
                    var monthDiff = nowMonth - parseInt(birthMonth); //月之差
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
            }
            else {
                returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
            }
        }
        return returnAge; //返回周岁年龄
    },
    connectTo: function (target, source) {
        var keyNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keyNames[_i - 2] = arguments[_i];
        }
        if (Utils.isNil(target) || Utils.isNil(source)) {
            return false;
        }
        if (keyNames.length == 0) {
            keyNames = Object.keys(source);
        }
        var _loop_1 = function (keyName) {
            if (!Object.getOwnPropertyDescriptor(target, keyName))
                Object.defineProperty(target, keyName, {
                    get: function () {
                        return source[keyName];
                    },
                    set: function (value) {
                        source[keyName] = value;
                    }
                });
        };
        for (var _a = 0, keyNames_1 = keyNames; _a < keyNames_1.length; _a++) {
            var keyName = keyNames_1[_a];
            _loop_1(keyName);
        }
        return true;
    },
    getListDifferent: function (listA, listB, deep) {
        if (deep === void 0) { deep = false; }
        return {
            push: differenceWith(listB, listA, deep ? (function (a, b) { return isEqual(a, b); }) : []),
            pull: differenceWith(listA, listB, deep ? (function (a, b) { return isEqual(a, b); }) : [])
        };
    },
    createCommonDto: function (model) { return new CommonDto(model); },
    /**
     * 代码解释器，返回getInnerWarpField解释数组
     * @param { string } keyStr
     * @param { any } defaultValue
     * @return { [][] } 二维数组
     */
    getExpressByStr: function (keyStr, defaultValue) {
        var paramList = (keyStr.match(/(.*?)\.|(.*?)\[(.*)\]|(.+?)$/ig, '')).slice().map(function (i) { return i.split(/\[|\]|\[\]|\./ig).filter(function (i) { return !['', '.'].includes(i); }); });
        return reduce(paramList, function (list, _a, reduceIndex, reduceList) {
            var prototeryName = _a[0], indexList = _a.slice(1);
            return list.concat([
                [prototeryName, indexList.length > 0 ? [] : (reduceIndex < reduceList.length - 1 ? {} : defaultValue)]
            ].concat(indexList.map(function (i, index) {
                return [parseInt(i), (index < indexList.length - 1 ? [] : ((index === indexList.length - 1 && reduceIndex === reduceList.length - 1) ? defaultValue : {}))];
            })));
        }, []);
    },
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 初始值可用[成员名|初始值]的形式来自定义
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param { {} } main
     * @param  {...(string | [string, string | [] | {}])} proteryNames
     */
    getPropertyFieldByCreate: function (main) {
        var proteryNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            proteryNames[_i - 1] = arguments[_i];
        }
        var isObject = Utils.isObject, isEmptyValue = Utils.isEmptyValue, isNotEmptyArray = Utils.isNotEmptyArray, isString = Utils.isString;
        return reduce(proteryNames, function (final, next, index, list) {
            if (!isObject(next)) {
                return undefined;
            }
            else if (isNotEmptyArray(next)) {
                var keyName = next[0], defaultValue = next[1];
                if (isEmptyValue(final[keyName])) {
                    final[keyName] = (defaultValue === undefined ? (index < list.length - 2 ? {} : undefined) : defaultValue);
                }
                return final[keyName];
            }
            else if (isString(next)) {
                if (isEmptyValue(final[next])) {
                    final[next] = {};
                }
                return final[next];
            }
            else {
                return undefined;
            }
        }, main);
    },
    getPropByPath: function (obj, path, strict) {
        if (strict === void 0) { strict = false; }
        var tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var keyArr = path.split('.');
        var i = 0;
        for (var len = keyArr.length; i < len - 1; ++i) {
            if (!tempObj && !strict)
                break;
            var key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            }
            else {
                if (strict) {
                    throw new Error('please transfer a valid prop path to form item!');
                }
                break;
            }
        }
        return {
            o: tempObj,
            k: keyArr[i],
            v: tempObj ? tempObj[keyArr[i]] : null
        };
    }
};
export default CustomUtils;
//# sourceMappingURL=CustomUtils.js.map