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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import isString from "lodash/isString";
import { inject, observer } from 'mobx-react';
export function commonInjectItem(Target) {
    var append = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        append[_i - 1] = arguments[_i];
    }
    if (isString(Target)) {
        return function (InjectTarget) {
            return inject.apply(void 0, __spread(['formStore', 'antdForm', 'itemConfig', Target], append))(observer(InjectTarget));
        };
    }
    return inject('formStore', 'antdForm', 'itemConfig')(observer(Target));
}
// export const commonInjectItem = () => function <T extends IReactComponent>(target: T) {
//   return inject('formStore', 'antdForm')(observer(target));
// };
//# sourceMappingURL=commonInjectItem.js.map