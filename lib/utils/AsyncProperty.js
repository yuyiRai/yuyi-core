var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { autobind } from 'core-decorators';
import last from "lodash/last";
import { action, computed, extendObservable, observable, reaction, runInAction, isComputed, getDebugName } from 'mobx';
import { Utils } from './Utils';
var AsyncLoadProperty = /** @class */ (function () {
    function AsyncLoadProperty(type, getter, defaultValue, timeBuffer) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = null; }
        if (timeBuffer === void 0) { timeBuffer = 0; }
        this.loading = true;
        this.getterFunc = function () { return _this.defaultValue; };
        this.timeBuffer = 0;
        this.emitter = null;
        this.getValue = function (param) {
            if (param === _this.lastParam) {
                return _this.currentValue;
            }
            _this.lastParam = param;
            _this.valueGetter(param);
            return _this.currentValue;
        };
        this.type = type;
        this.reset(defaultValue, true);
        if (timeBuffer > 0) {
            this.timeBuffer = timeBuffer;
        }
        this.registerGetter(getter);
        // reaction(() => this.loading, loading => {
        //   console.log('loading change', loading)
        // }, { fireImmediately: true })
        // reaction(() => this.isInited, value => {
        //   console.log('初始化状态变更', value)
        // }, { fireImmediately: true })
        // reaction(() => this.currentValue, value => {
        //   console.log('value change', value)
        // })
    }
    AsyncLoadProperty.prototype.reset = function (nextDefaultValue, force) {
        if (this.isTypedValue(nextDefaultValue)) {
            this.defaultValue = nextDefaultValue;
            this.currentValue = this.defaultValue;
            this.isInited = false;
        }
        else if (force) {
            this.isInited = false;
        }
        return this;
    };
    AsyncLoadProperty.prototype.updateValue = function (nextValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nextValue];
                    case 1:
                        value = _a.sent();
                        console.log('update value', value, this.currentValue);
                        if (this.isTypedValue(value)) {
                            this.currentValue = value;
                            if (!this.isInited) {
                                this.isInited = true;
                            }
                            this.loadingEnd();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncLoadProperty.prototype.registerGetter = function (getter) {
        this.getterFunc = Utils.isFunctionFilter(getter, this.getterFunc);
    };
    Object.defineProperty(AsyncLoadProperty.prototype, "valueGetter", {
        get: function () {
            var _this = this;
            if (this.timeBuffer > 0) {
                var emitter_1 = Utils.createSimpleTimeBufferInput(function (resList) {
                    _this.updateValue(_this.getterFunc(last(resList)));
                }, this, this.timeBuffer, true);
                return action(function (param) {
                    runInAction(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.loadingStart();
                            return [2 /*return*/, emitter_1(param)];
                        });
                    }); });
                });
            }
            return action(function (param) {
                runInAction(function () {
                    _this.loadingStart();
                    _this.updateValue(_this.getterFunc(param));
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    AsyncLoadProperty.prototype.loadingStart = function () {
        if (!this.loading)
            this.loading = true;
    };
    AsyncLoadProperty.prototype.loadingEnd = function () {
        if (this.loading)
            this.loading = false;
    };
    AsyncLoadProperty.prototype.isTypedValue = function (value) {
        if (value == null) {
            return true;
        }
        else if (Utils.isFunction(this.type)) {
            return this.type(value);
        }
        else {
            var type = this.type;
            switch (type) {
                case String: return Utils.isString(value);
                case Boolean: return Utils.isBoolean(value);
                case Array: return Utils.isArray(value);
                case Number: return Utils.isNumber(value);
                default: return value instanceof type;
            }
        }
    };
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "type", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "defaultValue", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "currentValue", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "loading", void 0);
    __decorate([
        observable,
        __metadata("design:type", Boolean)
    ], AsyncLoadProperty.prototype, "isInited", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Function)
    ], AsyncLoadProperty.prototype, "getterFunc", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "emitter", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], AsyncLoadProperty.prototype, "reset", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AsyncLoadProperty.prototype, "updateValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AsyncLoadProperty.prototype, "registerGetter", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], AsyncLoadProperty.prototype, "valueGetter", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AsyncLoadProperty.prototype, "loadingStart", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AsyncLoadProperty.prototype, "loadingEnd", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AsyncLoadProperty.prototype, "isTypedValue", null);
    return AsyncLoadProperty;
}());
export { AsyncLoadProperty };
function getAsyncPropertyName(propertyName) {
    return "$" + propertyName + "Async";
}
var asyncPropertyNameKey = '__$$$AsyncPropertyName';
var asyncPropertyName = '__$$$AsyncProperty';
var asyncPropertyMapKey = '$$$AsyncPropertyMap';
function createInstance(nextValue, asyncName, config) {
    Object.defineProperty(nextValue, asyncPropertyNameKey, {
        value: asyncName,
        writable: false,
        enumerable: false
    });
    Object.defineProperty(nextValue, asyncPropertyName, {
        get: function () { return config; },
        enumerable: false
    });
    return nextValue;
}
/**
 * @return { PropertyDecorator }
 */
export function asyncComputed(_a) {
    var type = _a.type, defaultValue = _a.defaultValue, watcher = _a.watcher, time = _a.time;
    /**
     * @type {PropertyDecorator}
     * @param { * } target
     * @param { string } propertyName
     * @param { PropertyDescriptor } descriptor
     */
    function Async(target, propertyName, descriptor) {
        var asyncName = getAsyncPropertyName(propertyName);
        var getter = descriptor.get;
        if (getter) {
            descriptor.get = function () {
                var _this = this;
                var _a, _b;
                var sourceInstance = this;
                console.log('getter', this, isComputed(this));
                if (!this[asyncPropertyMapKey]) {
                    var map_1 = new Map();
                    extendObservable(this, (_a = {}, Object.defineProperty(_a, asyncPropertyMapKey, {
                        get: function () { return map_1; },
                        enumerable: true,
                        configurable: true
                    }), _a));
                }
                var store = this[asyncPropertyMapKey];
                var asyncConfig = this[asyncName];
                if (!this[asyncName]) {
                    var asyncConfig_1 = new AsyncLoadProperty(type, function () { return Reflect.apply(getter, sourceInstance, []); }, defaultValue, time);
                    extendObservable(this, (_b = {}, Object.defineProperty(_b, asyncName, {
                        get: function () { return asyncConfig_1; },
                        enumerable: true,
                        configurable: true
                    }), _b));
                    store.set(asyncName, asyncConfig_1);
                    if (!Utils.isNil(watcher)) {
                        reaction(function () { return _this[watcher]; }, function (trigger) {
                            asyncConfig_1.reset(asyncConfig_1.currentValue).getValue(trigger);
                            console.log('trigger update', trigger, _this[asyncName]);
                        }, { fireImmediately: true });
                        reaction(function () { return _this[propertyName]; }, function (property) {
                            console.log('property update', property, _this);
                        }, { fireImmediately: true });
                    }
                }
                var currentValue = asyncConfig.getValue(this[watcher]);
                if (currentValue === defaultValue) {
                    console.log('get init value now!');
                    return createInstance(Utils.cloneDeep(currentValue), asyncName, asyncConfig);
                }
                else {
                    console.log('get update value now!');
                }
                return currentValue;
            };
        }
        return computed(target, propertyName, descriptor);
    }
    return Async;
}
var AsyncPropertyGetter = /** @class */ (function () {
    function AsyncPropertyGetter() {
    }
    Object.defineProperty(AsyncPropertyGetter.prototype, "tt", {
        get: function () {
            return this.t;
        },
        enumerable: true,
        configurable: true
    });
    AsyncPropertyGetter.prototype.get = function (t, key) {
        this.t = t;
        // Reflect.setPrototypeOf(this, Reflect.getPrototypeOf(t))
        return getDebugName(t[key]);
    };
    __decorate([
        observable,
        __metadata("design:type", String)
    ], AsyncPropertyGetter.prototype, "name", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], AsyncPropertyGetter.prototype, "t", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], AsyncPropertyGetter.prototype, "tt", null);
    return AsyncPropertyGetter;
}());
export { AsyncPropertyGetter };
window.AsyncPropertyGetter = AsyncPropertyGetter;
window.getDebugName = getDebugName;
//# sourceMappingURL=AsyncProperty.js.map