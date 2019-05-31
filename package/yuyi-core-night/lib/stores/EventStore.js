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
import { EventEmitter } from "../utils";
import { autobind } from "core-decorators";
import { filter } from "rxjs/_esm5/internal/operators/filter";
import forEach from "lodash/forEach";
import assign from "lodash/assign";
import reduce from "lodash/reduce";
import { default as lFilter } from "lodash/filter";
import Utils from "../utils";
import { Subscription } from "rxjs";
var EventStoreProvider = /** @class */ (function () {
    function EventStoreProvider() {
    }
    return EventStoreProvider;
}());
export { EventStoreProvider };
;
// @staticImplements<IEventStoreStatic>()
var EventStore = /** @class */ (function (_super) {
    __extends(EventStore, _super);
    // public static injectedValidEventNames: string[];
    function EventStore(eventNames) {
        var _this = _super.call(this) || this;
        _this.eventNames = eventNames;
        _this.eventMap = new WeakMap();
        return _this;
    }
    /**
     * 是否是合法事件名
     * @param {string} eventName
     */
    EventStore.prototype.isValidEventName = function (eventName) {
        return this.eventNames.includes(eventName);
    };
    /**
     * 发送事件
     * @param {string} eventName 事件名
     * @param {string[]} args 参数
     */
    EventStore.prototype.$emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // console.log('log $emit', this.eventNames.includes(eventName), eventName, ...args)
        if (this.eventNames.includes(eventName)) {
            this.emit({
                type: eventName,
                args: args
            });
            return true;
        }
        return false;
    };
    /**
     * 监听事件
     * @param {string} eventName 事件名
     * @param {(...args, event) => void} callback 事件名
     */
    EventStore.prototype.$on = function (eventName, callback, instance) {
        if (instance === void 0) { instance = this; }
        if (this.eventNames.includes(eventName)) {
            var listeners = this.eventMap.get(instance);
            if (!listeners) {
                listeners = new WeakMap();
                this.eventMap.set(instance, listeners);
            }
            if (listeners.has(callback)) {
                listeners.get(callback).unsubscribe();
                listeners.delete(callback);
            }
            if (!listeners.has(callback)) {
                listeners.set(callback, this.pipe(filter(function (_a) {
                    var type = _a.type;
                    return type === eventName;
                })).subscribe(function (e) { return callback.apply(void 0, __spread(e.args, [e])); }));
                return true;
            }
        }
        return false;
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "isValidEventName", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "$emit", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Function, Object]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "$on", null);
    return EventStore;
}(EventEmitter));
export { EventStore };
var fake = { $emit: function () { }, $on: function () { } };
/**
 * @param { string[] } eventNames
 * @param { {[key: string]: Function} } extendTarget
 */
export function EventStoreInject(eventNames, extendTarget) {
    var allowExtendKey = reduce(extendTarget, function (r, t, key) {
        var _a;
        return Utils.isArray(t.injectedValidEventNames)
            ? assign(r, (_a = {},
                _a[key] = lFilter(eventNames, function (eName) {
                    return t.injectedValidEventNames.includes(eName);
                }),
                _a))
            : r;
    }, {});
    return function (target) {
        Object.defineProperty(target, 'injectedValidEventNames', {
            value: eventNames,
            enumerable: true,
            writable: false
        });
        Object.defineProperty(target.prototype, '__getEventListenersHooks', {
            value: function (validEventNames, allowExtendKey, force) {
                if (!this.$__event__store && !force) {
                    return fake;
                }
                if (force && !this.$__event__store) {
                    Object.defineProperty(this, '$__event__store', {
                        get: function () {
                            var _this = this;
                            if (!this.$__event__store__core) {
                                Object.defineProperty(this, '$__event__store__core', {
                                    value: new EventStore(validEventNames),
                                    enumerable: false,
                                    configurable: true,
                                    writable: false
                                });
                                // console.log(validEventNames, allowExtendKey)
                                forEach(allowExtendKey, function (value, key) {
                                    if (_this[key] && _this[key].$on) {
                                        forEach(value, function (name) {
                                            _this[key].$on(name, function () {
                                                var args = [];
                                                for (var _i = 0; _i < arguments.length; _i++) {
                                                    args[_i] = arguments[_i];
                                                }
                                                // console.log('on register', name, args)
                                                _this.$emit.apply(_this, __spread([name], args));
                                            });
                                            // console.log(`this.${key}.$on('${name}', this.$emit.bind(this, '${name}'))`)
                                        });
                                    }
                                });
                            }
                            return this.$__event__store__core;
                        },
                        enumerable: false,
                        configurable: true
                    });
                }
                return this.$__event__store;
            },
            enumerable: true,
            writable: false
        });
        Object.defineProperty(target.prototype, '$on', {
            get: function () { return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey, true).$on; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(target.prototype, '$emit', {
            get: function () {
                return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey).$emit;
            },
            enumerable: true,
            configurable: true
        });
        return target;
    };
}
//# sourceMappingURL=EventStore.js.map