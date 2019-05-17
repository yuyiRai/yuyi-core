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
import Notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';
import assign from "lodash/assign";
import concat from "lodash/concat";
import reduce from "lodash/reduce";
import React from 'react';
import ReactDom from 'react-dom';
import Utils from "..";
import styled from 'styled-components';
import { autobind } from 'core-decorators';
export var YuyiContainer = styled.div.withConfig({ displayName: "YuyiContainer", componentId: "sc-1dxc9xj" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  z-index: 2048;\n"], ["\n  position: fixed;\n  z-index: 2048;\n"])));
var div = document.createElement('div');
export function $notify(config, instance, time) {
    if (time === void 0) { time = 100; }
    return Utils.simpleTimeBufferInput(instance, config, function (configList) {
        var _a = reduce(configList, function (_a, _b) {
            var msg = _a.msg, other = __rest(_a, ["msg"]);
            var iMsg = _b.msg, iOther = __rest(_b, ["msg"]);
            return assign(other, iOther, {
                msg: concat(msg, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] }), msg = _a.msg, config = __rest(_a, ["msg"]);
        var message = reduce(Array.from(new Set(msg)), function (c, domGetter, index, list) {
            return concat(c, [c.length > 0 && React.createElement("br", { key: index + list.length + 1 }), Utils.isFunction(domGetter) ? domGetter(index, list) : domGetter]);
        }, []);
        var instance = new NotificationStore(__assign({ key: Utils.uuid() }, config, (config.title ? { message: config.title, description: React.createElement("span", null, message) } : { message: React.createElement("span", null, message) })));
        // console.error(message, instance);
        return instance;
    }, time || 100);
}
var NotificationStore = /** @class */ (function () {
    function NotificationStore(props) {
        this.open = Notification.open;
        this.key = props.key;
        this.prepare();
        this.open(props);
    }
    NotificationStore.prototype.close = function () {
        Notification.close(this.key);
    };
    NotificationStore.prototype.destroy = function () {
        Notification.destroy();
    };
    NotificationStore.prototype.prepare = function () {
        document.body.append(div);
        if (!NotificationStore.inited)
            ReactDom.render(React.createElement(YuyiContainer, { ref: NotificationStore.init }), div);
    };
    NotificationStore.init = function (container) {
        if (container) {
            NotificationStore.container = container;
            Notification.config({
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
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "close", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "destroy", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NotificationStore.prototype, "prepare", null);
    return NotificationStore;
}());
export { NotificationStore };
var templateObject_1;
//# sourceMappingURL=NotificationStore.js.map