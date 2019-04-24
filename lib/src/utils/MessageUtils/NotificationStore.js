"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var notification_1 = __importDefault(require("antd/lib/notification"));
require("antd/lib/notification/style/css");
require("./style/index.css");
var lodash_1 = require("lodash");
var react_1 = __importDefault(require("react"));
var __1 = __importDefault(require(".."));
var styled_components_1 = require("styled-components");
styled_components_1.createGlobalStyle(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-notification.ant-notification-bottomLeft {\n    z-index: 2048;\n  }\n  .ant-notification.ant-notification-topLeft {\n    z-index: 2048;\n  }\n"], ["\n  .ant-notification.ant-notification-bottomLeft {\n    z-index: 2048;\n  }\n  .ant-notification.ant-notification-topLeft {\n    z-index: 2048;\n  }\n"])));
exports.Container = function () {
};
function $notify(config, instance, time) {
    if (time === void 0) { time = 100; }
    return __1.default.simpleTimeBufferInput(instance, config, function (configList) {
        var _a = lodash_1.reduce(configList, function (_a, _b) {
            var msg = _a.msg, other = __rest(_a, ["msg"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(msg, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] }), msg = _a.msg, config = __rest(_a, ["msg"]);
        var message = lodash_1.reduce(Array.from(new Set(msg)), function (c, domGetter, index, list) {
            return __spread(c, [c.length > 0 && react_1.default.createElement("br", { key: index + list.length + 1 }), __1.default.isFunction(domGetter) ? domGetter(index, list) : domGetter]);
        }, []);
        notification_1.default.config({
            getContainer: function () {
                var div = document.createElement('div');
                div.style.zIndex = '2048';
                div.setAttribute('id', 'yuyi-container');
                document.body.append(div);
                console.log('getContainer', div);
                return div;
            }
        });
        var instance = new NotificationStore(__assign({ key: __1.default.uuid() }, config, (config.title ? { message: config.title, description: react_1.default.createElement("span", null, message) } : { message: react_1.default.createElement("span", null, message) })));
        console.error(message, instance);
        return instance;
    }, time || 100);
}
exports.$notify = $notify;
var NotificationStore = /** @class */ (function () {
    // static container: HTMLDivElement
    function NotificationStore(props) {
        this.key = props.key;
        notification_1.default.open(props);
        // if(!NotificationStore.container){
        // }
        // setTimeout(() => {
        //   (document.querySelector('.ant-notification.ant-notification-bottomLeft') as any).style.zIndex = 2048
        // }, 10);
    }
    NotificationStore.prototype.close = function () {
        notification_1.default.close(this.key);
    };
    NotificationStore.prototype.destroy = function () {
        notification_1.default.destroy();
    };
    return NotificationStore;
}());
exports.NotificationStore = NotificationStore;
var templateObject_1;
//# sourceMappingURL=NotificationStore.js.map