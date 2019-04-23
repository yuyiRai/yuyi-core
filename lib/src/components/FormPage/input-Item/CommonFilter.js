"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const index_1 = require("../../../utils/index");
class CommonValueFilter {
    constructor(type) {
        this.type = type;
    }
    get filter() {
        switch (this.type) {
            case 'group':
                return this.groupFilter;
            case 'check':
                return this.groupFilter;
            case 'checkOne':
                return (v) => v === '1';
            case 'dateTime':
                return (v) => _.isDate(v) ? v :
                    (Utils.isNotEmptyString(v)
                        ? (v.length < 11 ? (v + " 00:00:00") : v)
                        : undefined);
            case 'dateToDate':
                return (v) => Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i));
        }
        return this.normalFilter;
    }
    get filterToValue() {
        switch (this.type) {
            case 'group':
                return this.groupFilterToValue;
            case 'check':
                return this.groupFilterToValue;
            case 'checkOne':
                return (v) => {
                    return v === true ? '1' : '0';
                };
            case 'dateTime':
                return (v) => _.isDate(v) ? v :
                    (Utils.isNotEmptyString(v)
                        ? (v.length < 11 ? (v + " 00:00:00") : v)
                        : undefined);
            case 'dateToDate':
                return (v) => {
                    const [s, e] = Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i));
                    if (Utils.isNotEmptyValue(s) && Utils.isNotEmptyValue(e)) {
                        return [`${s}${s.length < 11 ? ' 00:00:00' : ''}`, `${s.length < 11 ? index_1.parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : ''}`];
                    }
                    return [s, e];
                };
        }
        return this.normalFilter;
    }
    normalFilter(value) {
        return Utils.isNotEmptyValueFilter(value, null);
    }
    groupFilter(string) {
        return Utils.isNotEmptyString(string) ? string.split(',').filter(i => Utils.isNotEmptyString(i)) : [];
    }
    groupFilterToValue(array) {
        return Utils.isArrayFilter(array, []).filter(i => Utils.isNotEmptyString(i)).join(',');
    }
}
exports.CommonValueFilter = CommonValueFilter;
function getFilter(type) {
    return new CommonValueFilter(type);
}
exports.default = getFilter;
//# sourceMappingURL=CommonFilter.js.map