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
import get from "lodash/get";
import { intercept, observable, observe, reaction } from "mobx";
var CommonStore2 = /** @class */ (function () {
    function CommonStore2() {
        this.destorySet = new Set();
    }
    CommonStore2.prototype.reaction = function (source, callback, options) {
        this.destorySet.add(reaction(source, callback, options));
    };
    ;
    CommonStore2.prototype.onceReaction = function (source, callback, options) {
        var a = reaction(source, function (arg, r) {
            callback(arg, r);
            a();
        }, options);
    };
    CommonStore2.prototype.observe = function (value, listener, fireImmediately) {
        this.destorySet.add(observe(value, listener, fireImmediately));
    };
    CommonStore2.prototype.intercept = function (object, handler) {
        this.destorySet.add(intercept(object, handler));
    };
    CommonStore2.prototype.interceptProperty = function (object, property, handler) {
        this.destorySet.add(intercept(object, property, handler));
    };
    CommonStore2.prototype.destory = function () {
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
    CommonStore2.prototype.registerKey = function (target, key, deep) {
        if (deep === void 0) { deep = false; }
        var keyDeep = key.split('.');
        // const coreKey = `$$core_${keyDeep[0]}`;
        var resolver = keyDeep[0];
        var defaultV = get(target, resolver, null);
        var d = (deep ? observable : observable.ref);
        d(target, resolver, { value: defaultV, enumerable: false, configurable: true });
        // computed.struct(target, keyDeep[0], {
        //   get() { return get(this, coreKey) },
        //   set(value) { set(this, coreKey, value) }
        // })
        // console.log('registerKey', target, key);
    };
    return CommonStore2;
}());
export { CommonStore2 };
//# sourceMappingURL=index.js.map