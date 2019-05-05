"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = require("./EventEmitter");
var core_decorators_1 = require("core-decorators");
var operators_1 = require("rxjs/operators");
var lodash_1 = require("lodash");
var _1 = __importDefault(require("."));
;
// @staticImplements<IEventStoreStatic>()
var EventStore = /** @class */ (function (_super) {
    __extends(EventStore, _super);
    function EventStore(eventNames) {
        var _this = _super.call(this) || this;
        _this.eventMap = new WeakMap();
        // public static injectedValidEventNames: string[];
        _this.eventNames = [];
        _this.eventNames = eventNames;
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
                listeners.set(callback, this.pipe(operators_1.filter(function (_a) {
                    var type = _a.type;
                    return type === eventName;
                })).subscribe(function (e) { return callback.apply(void 0, __spread(e.args, [e])); }));
                return true;
            }
        }
        return false;
    };
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "isValidEventName", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "$emit", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Function, Object]),
        __metadata("design:returntype", void 0)
    ], EventStore.prototype, "$on", null);
    return EventStore;
}(EventEmitter_1.EventEmitter));
exports.EventStore = EventStore;
var fake = { $emit: function () { }, $on: function () { } };
/**
 * @param { string[] } eventNames
 * @param { {[key: string]: Function} } extendTarget
 */
function EventStoreInject(eventNames, extendTarget) {
    var allowExtendKey = lodash_1.reduce(extendTarget, function (r, t, key) {
        var _a;
        return _1.default.isArray(t.injectedValidEventNames)
            ? lodash_1.assign(r, (_a = {},
                _a[key] = lodash_1.filter(eventNames, function (eName) {
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
                                lodash_1.forEach(allowExtendKey, function (value, key) {
                                    if (_this[key] && _this[key].$on) {
                                        lodash_1.forEach(value, function (name) {
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
exports.EventStoreInject = EventStoreInject;
