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
import map from "lodash/map";
import Utils from '../../../utils';
export var checkDateToDate = function (date, itemConfig) { return (function (rule, value, callback) {
    console.log('testt, check', value, itemConfig);
    var _a = __read(Utils.isArrayFilter(value, map(itemConfig.code.split('|'), function (code) { return itemConfig.formSource[code]; })), 2), start = _a[0], end = _a[1];
    if (!Utils.isNil(start) && !Utils.isNil(end) && itemConfig.type === 'dateToDate') {
        console.log('testt, check', [start, end], itemConfig);
        // console.log(start,end,value)
        if (Utils.isNotEmptyValue(end) && Utils.isNotEmptyValue(start)) {
            var endTime = new Date(end).getTime();
            var startTime = new Date(start).getTime();
            if ((endTime - startTime) > 30 * 1000 * 60 * 60 * 24) {
                console.error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929");
                return callback(new Error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929\uFF01"));
            }
            else if (endTime < startTime) {
                return callback(new Error(itemConfig.label + "\u622A\u6B62\u65F6\u95F4\u4E0D\u80FD\u65E9\u4E8E\u8D77\u59CB\u65F6\u95F4\uFF01"));
            }
        }
    }
    // console.log('回调3', value)
    return callback();
}); };
export var checkFutureDate = function (itemConfig) { return (function (rule, value, callback) {
    if (Utils.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
        return callback(new Error(itemConfig.label + "\u4E0D\u80FD\u65E9\u4E8E\u5F53\u524D\u65F6\u95F4"));
    }
    return callback();
}); };
export var getDefaultRules = function (itemConfig) {
    return {
        dateToDate30: [{
                validator: checkDateToDate(30, itemConfig),
                trigger: ['onChange'],
            }],
        futureDate: [{
                validator: checkFutureDate(itemConfig),
                trigger: 'onChange'
            }]
    };
};
export var DateUtils = {
    getDateRange: function (days) {
        var end = new Date();
        var start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end];
    }
};
//# sourceMappingURL=Date.js.map