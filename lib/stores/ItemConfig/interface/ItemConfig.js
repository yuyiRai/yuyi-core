"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var CommonStore = /** @class */ (function () {
    function CommonStore() {
        this.destorySet = new Set();
    }
    CommonStore.prototype.reaction = function (source, callback, options) {
        this.destorySet.add(mobx_1.reaction(source, callback, options));
    };
    ;
    CommonStore.prototype.observe = function (value, listener, fireImmediately) {
        this.destorySet.add(mobx_1.observe(value, listener, fireImmediately));
    };
    CommonStore.prototype.intercept = function (object, handler) {
        this.destorySet.add(mobx_1.intercept(object, handler));
    };
    CommonStore.prototype.interceptProperty = function (object, property, handler) {
        this.destorySet.add(mobx_1.intercept(object, property, handler));
    };
    CommonStore.prototype.destory = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.destorySet), _c = _b.next(); !_c.done; _c = _b.next()) {
                var destory = _c.value;
                destory();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.destorySet.clear();
    };
    return CommonStore;
}());
exports.CommonStore = CommonStore;
