var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { EventStoreProvider } from "../../EventStore";
import { autobind } from 'core-decorators';
import { Utils } from "../../../utils";
import difference from "lodash/difference";
import forEach from "lodash/forEach";
import get from "lodash/get";
import isNil from "lodash/isNil";
import keys from "lodash/keys";
import set from "lodash/set";
import { action, autorun, computed, intercept, isObservableProp, observable, observe, reaction } from "mobx";
var CommonStore = /** @class */ (function (_super) {
    __extends(CommonStore, _super);
    function CommonStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.destorySet = new Set();
        return _this;
    }
    CommonStore.prototype.reaction = function (source, callback, options) {
        this.destorySet.add(reaction(source, callback, options));
    };
    CommonStore.prototype.onceReaction = function (source, callback, options) {
        var a = reaction(source, function (arg, r) {
            callback(arg, r);
            a();
        }, options);
    };
    CommonStore.prototype.autorun = function (view, opts) {
        this.destorySet.add(autorun(view, opts));
    };
    ;
    CommonStore.prototype.observe = function (a, b, c, d) {
        this.destorySet.add(observe(a, b, c, d));
    };
    CommonStore.prototype.intercept = function (a, b, c) {
        this.destorySet.add(intercept(a, b, c));
    };
    CommonStore.prototype.interceptProperty = function (object, property, handler) {
        if (isObservableProp(object, property)) {
            this.destorySet.add(intercept(object, property, handler));
        }
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
        return this;
    };
    CommonStore.prototype.mapToDiff = function (map, source, cahce) {
        var push = difference(keys(source), Array.from(map.keys()));
        forEach(map.toPOJO(), function (value, key) {
            if (isNil(source[key])) {
                map.delete(key);
            }
            else if (!Utils.isEqual(source[key], value)) {
                map.set(key, source[key]);
            }
        });
        forEach(push, function (key) {
            map.set(key, source[key]);
        });
        return map;
    };
    CommonStore.prototype.objectToDiff = function (obj, source) {
        var push = difference(keys(source), keys(obj));
        forEach(obj, function (value, key) {
            if (isNil(source[key]))
                delete obj[key];
            else if (!Utils.isEqual(source[key], value)) {
                obj[key] = source[key];
            }
        });
        forEach(push, function (key) {
            obj[key] = source[key];
        });
        return obj;
    };
    CommonStore.prototype.registerKey = function (target, key, deep) {
        if (deep === void 0) { deep = false; }
        if (!Utils.isNil(key)) {
            var keyDeep = key.split('.');
            // const coreKey = `$$core_${keyDeep[0]}`;
            var resolver = keyDeep[0];
            var defaultV = get(target, resolver, null);
            var d = (deep ? observable : observable.ref);
            d(target, resolver, { value: defaultV, enumerable: false, configurable: true });
            return true;
        }
        return false;
        // computed.struct(target, keyDeep[0], {
        //   get() { return get(this, coreKey) },
        //   set(value) { set(this, coreKey, value) }
        // })
        // console.log('registerKey', target, key);
    };
    CommonStore.prototype.registerGet = function (target, key, getter) {
        var keyDeep = key.split('.');
        var resolver = keyDeep.pop();
        if (keyDeep.length > 0) {
            var deepResolver = keyDeep.length > 0 ? keyDeep.join('.') : resolver;
            // const coreKey = `$$core_${keyDeep[0]}`;
            var deepTarget = Utils.isObjectFilter(get(target, deepResolver)) || {};
            computed(deepTarget, resolver, { get: getter, enumerable: false, configurable: true });
            set(target, deepResolver, deepTarget);
        }
        else {
            computed(target, resolver, { get: getter, enumerable: false, configurable: true });
        }
        // computed.struct(target, keyDeep[0], {
        //   get() { return get(this, coreKey) },
        //   set(value) { set(this, coreKey, value) }
        // })
        // console.log('registerKey', target, key);
    };
    CommonStore.prototype.safeGet = function (path, defaultValue) {
        return get(this, path, defaultValue);
    };
    Object.defineProperty(CommonStore.prototype, "propertyNameList", {
        get: function () {
            return keys(this);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable,
        __metadata("design:type", Set)
    ], CommonStore.prototype, "destorySet", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Function, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "reaction", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Function, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "onceReaction", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "autorun", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "observe", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "intercept", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Function]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "interceptProperty", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "destory", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CommonStore.prototype, "safeGet", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], CommonStore.prototype, "propertyNameList", null);
    return CommonStore;
}(EventStoreProvider));
export { CommonStore };
//# sourceMappingURL=CommonStore.js.map