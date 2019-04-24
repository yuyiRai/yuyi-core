"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const lodash_1 = require("lodash");
const _1 = __importDefault(require("./"));
const CommonDto_1 = __importDefault(require("./CommonDto"));
function zipEmptyData(object, isRemoveRepeat = true) {
    return lodash_1.isArray(object)
        ? _1.default.pipe(lodash_1.filter(object, v => _1.default.isNotEmptyValue(v)), (list) => _1.default.jsxIf(isRemoveRepeat, Array.from(new Set(list)), list))
        : lodash_1.reduce(lodash_1.filter(lodash_1.keys(object), (k) => _1.default.isNotEmptyValue(object[k])), (o, key) => lodash_1.assign(o, { [key]: object[key] }), {});
}
exports.zipEmptyData = zipEmptyData;
exports.CustomUtils = {
    uuid() {
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    },
    createObjectKey(obj) {
        return lodash_1.join(lodash_1.concat(lodash_1.keys(obj), lodash_1.values(obj)));
    },
    pipe(data, ...funcArr) {
        return lodash_1.reduce(funcArr, (value, func) => (_1.default.isFunctionFilter(func) || _1.default.stubFunction)(value), data);
    },
    zipEmptyData,
    zipEmptyDataNative(object) {
        return lodash_1.isArray(object)
            ? object.filter(v => _1.default.isNotEmptyValue(v))
            : Object.keys(object)
                .filter(k => _1.default.isNotEmptyValue(object[k]))
                .reduce((o, k) => Object.assign(o, {
                [k]: object[k]
            }), {});
    },
    downloadFile(fileId, fileName) {
        const a = document.createElement('a');
        a.href = `/api/file/get?id=${fileId}`;
        a.download = fileName || fileId;
        a.click();
        a.remove();
    },
    // 判断两个数组是否无序相等
    likeArray(arr, array) {
        // if the other array is a falsy value, return
        if (!_1.default.isArray(array) || !_1.default.isArray(arr))
            return false;
        // compare lengths - can save a lot of time 
        if (arr.length != array.length)
            return false;
        for (const v of arr) {
            if (_1.default.isNil(lodash_1.find(array, (item) => _1.default.isEqual(item, v)))) {
                return false;
            }
        }
        return true;
    },
    getDtoOrFormValue(key, formOrDto) {
        if (formOrDto instanceof CommonDto_1.default) {
            return formOrDto.get(key);
        }
        else if (_1.default.isObject(formOrDto)) {
            return formOrDto[key];
        }
        else {
            return undefined;
        }
    },
    jsGetAge(strBirthday) {
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
    connectTo(target, source, ...keyNames) {
        if (_1.default.isNil(target) || _1.default.isNil(source)) {
            return false;
        }
        if (keyNames.length == 0) {
            keyNames = Object.keys(source);
        }
        for (const keyName of keyNames) {
            if (!Object.getOwnPropertyDescriptor(target, keyName))
                Object.defineProperty(target, keyName, {
                    get() {
                        return source[keyName];
                    },
                    set(value) {
                        source[keyName] = value;
                    }
                });
        }
        return true;
    },
    getListDifferent(listA, listB, deep = false) {
        return {
            push: lodash_1.differenceWith(listB, listA, deep ? ((a, b) => lodash_1.isEqual(a, b)) : []),
            pull: lodash_1.differenceWith(listA, listB, deep ? ((a, b) => lodash_1.isEqual(a, b)) : [])
        };
    },
    createCommonDto(model) { return new CommonDto_1.default(model); },
    /**
     * 代码解释器，返回getInnerWarpField解释数组
     * @param { string } keyStr
     * @param { any } defaultValue
     * @return { [][] } 二维数组
     */
    getExpressByStr(keyStr, defaultValue) {
        const paramList = [
            ...(keyStr.match(/(.*?)\.|(.*?)\[(.*)\]|(.+?)$/ig, ''))
        ].map((i) => i.split(/\[|\]|\[\]|\./ig).filter((i) => !['', '.'].includes(i)));
        return lodash_1.reduce(paramList, (list, [prototeryName, ...indexList], reduceIndex, reduceList) => {
            return list.concat([
                [prototeryName, indexList.length > 0 ? [] : (reduceIndex < reduceList.length - 1 ? {} : defaultValue)],
                ...indexList.map((i, index) => {
                    return [parseInt(i), (index < indexList.length - 1 ? [] : ((index === indexList.length - 1 && reduceIndex === reduceList.length - 1) ? defaultValue : {}))];
                })
            ]);
        }, []);
    },
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 初始值可用[成员名|初始值]的形式来自定义
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param { {} } main
     * @param  {...(string | [string, string | [] | {}])} proteryNames
     */
    getPropertyFieldByCreate(main, ...proteryNames) {
        const { isObject, isEmptyValue, isNotEmptyArray, isString } = _1.default;
        return lodash_1.reduce(proteryNames, function (final, next, index, list) {
            if (!isObject(next)) {
                return undefined;
            }
            else if (isNotEmptyArray(next)) {
                const [keyName, defaultValue] = next;
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
    getPropByPath(obj, path, strict = false) {
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
exports.default = exports.CustomUtils;
//# sourceMappingURL=CustomUtils.js.map