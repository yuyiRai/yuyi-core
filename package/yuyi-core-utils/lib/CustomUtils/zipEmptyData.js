import assign from "lodash/assign";
import filter from "lodash/filter";
import isArray from "lodash/isArray";
import keys from "lodash/keys";
import reduce from "lodash/reduce";
import Utils from '../';
import { pipe } from "./pipe";
export function zipEmptyData(target, isRemoveRepeat) {
    if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
    return isArray(target)
        ? pipe(filter(target, function (v) { return Utils.isNotEmptyValue(v); }), function (list) { return Utils.jsxIf(isRemoveRepeat, Array.from(new Set(list)), list); })
        : reduce(filter(keys(target), function (k) { return Utils.isNotEmptyValue(target[k]); }), function (o, key) {
            var _a;
            return assign(o, (_a = {}, _a[key] = target[key], _a));
        }, {});
}
//# sourceMappingURL=zipEmptyData.js.map