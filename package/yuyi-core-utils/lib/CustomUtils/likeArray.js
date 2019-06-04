var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import find from "lodash/find";
import Utils from '../';
/**
 * 判断两个数组是否无序相等
 * @param arr
 * @param array
 */
export function likeArray(arr, array) {
    var e_1, _a;
    // if the other array is a falsy value, return
    if (!Utils.isArray(array) || !Utils.isArray(arr)) {
        return false;
    }
    // compare lengths - can save a lot of time 
    if (arr.length !== array.length) {
        return false;
    }
    var _loop_1 = function (v) {
        if (Utils.isNil(find(array, function (item) { return Utils.isEqual(item, v); }))) {
            return { value: false };
        }
    };
    try {
        for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
            var v = arr_1_1.value;
            var state_1 = _loop_1(v);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
//# sourceMappingURL=likeArray.js.map