var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Message } from 'element-react';
import assign from "lodash/assign";
import concat from "lodash/concat";
import join from "lodash/join";
import reduce from "lodash/reduce";
import Utils from "..";
export function $message(config, instance, time) {
    var _this = this;
    if (instance === void 0) { instance = {}; }
    if (time === void 0) { time = 100; }
    return Utils.simpleTimeBufferInput(instance, config, function (configList) {
        var config = reduce(configList, function (_a, _b) {
            var msg = _a.msg, other = __rest(_a, ["msg"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return assign(other, iOther, {
                msg: concat(msg, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] });
        (Utils.isFunctionFilter((_this || instance).$message) || Message)(__assign({}, config, { message: join(Array.from(new Set(config.msg)), '<br />') }));
    }, time || 100);
}
$message.error = function (msg, instance, time) {
    if (instance === void 0) { instance = {}; }
    console.log(msg);
    return $message({ msg: msg, type: 'error' }, instance);
};
//# sourceMappingURL=MessageUtils.js.map