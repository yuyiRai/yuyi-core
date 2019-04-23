"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var index_1 = require("../../../utils/index");
var CommonValueFilter = /** @class */ (function () {
    function CommonValueFilter(type) {
        this.type = type;
    }
    Object.defineProperty(CommonValueFilter.prototype, "filter", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupFilter;
                case 'check':
                    return this.groupFilter;
                case 'checkOne':
                    return function (v) { return v === '1'; };
                case 'dateTime':
                    return function (v) { return _.isDate(v) ? v :
                        (Utils.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) { return Utils.isArrayFilter(v, []).filter(function (i) { return Utils.isNotEmptyValue(i); }); };
            }
            return this.normalFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonValueFilter.prototype, "filterToValue", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupFilterToValue;
                case 'check':
                    return this.groupFilterToValue;
                case 'checkOne':
                    return function (v) {
                        return v === true ? '1' : '0';
                    };
                case 'dateTime':
                    return function (v) { return _.isDate(v) ? v :
                        (Utils.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) {
                        var _a = __read(Utils.isArrayFilter(v, []).filter(function (i) { return Utils.isNotEmptyValue(i); }), 2), s = _a[0], e = _a[1];
                        if (Utils.isNotEmptyValue(s) && Utils.isNotEmptyValue(e)) {
                            return ["" + s + (s.length < 11 ? ' 00:00:00' : ''), "" + (s.length < 11 ? index_1.parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : '')];
                        }
                        return [s, e];
                    };
            }
            return this.normalFilter;
        },
        enumerable: true,
        configurable: true
    });
    CommonValueFilter.prototype.normalFilter = function (value) {
        return Utils.isNotEmptyValueFilter(value, null);
    };
    CommonValueFilter.prototype.groupFilter = function (string) {
        return Utils.isNotEmptyString(string) ? string.split(',').filter(function (i) { return Utils.isNotEmptyString(i); }) : [];
    };
    CommonValueFilter.prototype.groupFilterToValue = function (array) {
        return Utils.isArrayFilter(array, []).filter(function (i) { return Utils.isNotEmptyString(i); }).join(',');
    };
    return CommonValueFilter;
}());
exports.CommonValueFilter = CommonValueFilter;
function getFilter(type) {
    return new CommonValueFilter(type);
}
exports.default = getFilter;
//# sourceMappingURL=CommonFilter.js.map