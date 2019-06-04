import reduce from "lodash/reduce";
import Utils from '../';
/**
 * 管道
 * @param data
 * @param funcArr
 */
export function pipe(data) {
    var funcArr = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        funcArr[_i - 1] = arguments[_i];
    }
    return reduce(funcArr, function (value, func) { return (Utils.isFunctionFilter(func) || Utils.stubFunction)(value); }, data);
}
//# sourceMappingURL=pipe.js.map