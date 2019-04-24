"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var element_react_1 = require("element-react");
var lodash_1 = require("lodash");
var __1 = __importDefault(require(".."));
function $message(config, instance, time) {
    if (time === void 0) { time = 100; }
    return __1.default.simpleTimeBufferInput(instance, config, function (configList) {
        var config = lodash_1.reduce(configList, function (_a, _b) {
            var message = _a.message, other = __rest(_a, ["message"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                message: lodash_1.concat(message, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] });
        element_react_1.Message(__assign({}, config, { message: lodash_1.join(Array.from(new Set(config.msg)), '<br />') }));
    }, time || 100);
}
exports.$message = $message;
$message.error = function (msg, instance, time) {
    return $message({ msg: msg, type: 'error' }, instance);
};
//# sourceMappingURL=MessageUtils.js.map