import isDate from "lodash/isDate";
import moment from "moment";
import { typeUtils } from "./TypeLib";
/**
* Created by jiachenpan on 16/11/18.
*/
export function parseTime(time, cFormat) {
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
export var EDateFormatter;
(function (EDateFormatter) {
    EDateFormatter["date"] = "YYYY-MM-DD";
    EDateFormatter["dateTime"] = "YYYY-MM-DD HH:mm:ss";
})(EDateFormatter || (EDateFormatter = {}));
export function toDateString(value, formatter) {
    if (formatter === void 0) { formatter = EDateFormatter.dateTime; }
    if (isDate(value)) {
        return moment(value).format(formatter);
    }
    else if (typeUtils.isNotEmptyString(value)) {
        var date = moment(value);
        if (date.isValid()) {
            return date.format(formatter);
        }
    }
    return moment().format(formatter);
}
//# sourceMappingURL=ParseUtils.js.map