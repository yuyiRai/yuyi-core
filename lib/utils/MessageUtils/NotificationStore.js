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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var notification_1 = __importDefault(require("antd/lib/notification"));
require("antd/lib/notification/style/css");
// import './style/index.css'
var lodash_1 = require("lodash");
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var __1 = __importDefault(require(".."));
var styled_components_1 = __importDefault(require("styled-components"));
var core_decorators_1 = require("core-decorators");
exports.YuyiContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  z-index: 2048;\n"], ["\n  position: fixed;\n  z-index: 2048;\n"])));
var div = document.createElement('div');
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
            return lodash_1.concat(c, [c.length > 0 && react_1.default.createElement("br", { key: index + list.length + 1 }), __1.default.isFunction(domGetter) ? domGetter(index, list) : domGetter]);
        }, []);
        var instance = new NotificationStore(__assign({ key: __1.default.uuid() }, config, (config.title ? { message: config.title, description: react_1.default.createElement("span", null, message) } : { message: react_1.default.createElement("span", null, message) })));
        // console.error(message, instance);
        return instance;
    }, time || 100);
}
exports.$notify = $notify;
var NotificationStore = /** @class */ (function () {
    function NotificationStore(props) {
        this.open = notification_1.default.open;
        this.key = props.key;
        this.prepare();
        this.open(props);
    }
    NotificationStore.prototype.close = function () {
        notification_1.default.close(this.key);
    };
    NotificationStore.prototype.destroy = function () {
        notification_1.default.destroy();
    };
    NotificationStore.prototype.prepare = function () {
        document.body.append(div);
        if (!NotificationStore.inited)
            react_dom_1.default.render(react_1.default.createElement(exports.YuyiContainer, { ref: NotificationStore.init }), div);
    };
    NotificationStore.init = function (container) {
        if (container) {
            NotificationStore.container = container;
            notification_1.default.config({
                getContainer: function () {
                    // div.style.zIndex = '2048'
                    // div.style.position = 'fixed'
                    // div.setAttribute('id', 'yuyi-container')
                    return NotificationStore.container;
                }
            });
            NotificationStore.inited = true;
        }
    };
    NotificationStore.inited = false;
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "close", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "destroy", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "prepare", null);
    return NotificationStore;
}());
exports.NotificationStore = NotificationStore;
var templateObject_1;
