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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var element_react_1 = require("element-react");
var lodash_1 = require("lodash");
var react_1 = __importDefault(require("react"));
var _1 = __importDefault(require("."));
function $message(config, instance, time) {
    if (time === void 0) { time = 100; }
    return _1.default.simpleTimeBufferInput(instance, config, function (configList) {
        var config = lodash_1.reduce(configList, function (_a, _b) {
            var msg = _a.msg, other = __rest(_a, ["msg"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(msg, [iMsg]),
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
function $notify(config, instance, time) {
    if (time === void 0) { time = 100; }
    return _1.default.simpleTimeBufferInput(instance, config, function (configList) {
        var config = lodash_1.reduce(configList, function (_a, _b) {
            var msg = _a.msg, other = __rest(_a, ["msg"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(msg, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] });
        var message = lodash_1.reduce(Array.from(new Set(config.msg)), function (c, domGetter, index, list) { return __spread(c, [c.length > 0 && react_1.default.createElement("br", null), _1.default.isFunction(domGetter) ? domGetter(index, list) : domGetter]); }, []);
        var instance = element_react_1.Notification(__assign({}, config, { message: react_1.default.createElement("span", null, message) }), 'success');
        console.error(message, instance);
        return instance;
    }, time || 100);
}
exports.$notify = $notify;
//# sourceMappingURL=MessageUtils.js.map