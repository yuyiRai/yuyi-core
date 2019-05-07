"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var moment_1 = __importDefault(require("moment"));
var TypeLib_1 = require("./TypeLib");
/**
* Created by jiachenpan on 16/11/18.
*/
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    var date;
    if (typeof time === 'object') {
        date = time;
    }
    else {
        if (('' + time).length === 10)
            time = parseInt(time) * 1000;
        date = new Date(time);
    }
    var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
        var value = formatObj[key];
        if (key === 'a')
            return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}
exports.parseTime = parseTime;
exports.dateFormatStr = 'YYYY-MM-DD';
exports.dateTimeFormatStr = 'YYYY-MM-DD HH:mm:ss';
function toDateString(value, formatter) {
    if (formatter === void 0) { formatter = exports.dateTimeFormatStr; }
    if (lodash_1.isDate(value)) {
        return moment_1.default(value).format(formatter);
    }
    else if (TypeLib_1.typeUtils.isNotEmptyString(value)) {
        var date = moment_1.default(value);
        if (date.isValid()) {
            return date.format(formatter);
        }
    }
    return moment_1.default().format(formatter);
}
exports.toDateString = toDateString;
