/* eslint-disable */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { observable, computed, action, runInAction, reaction, extendObservable } from 'mobx';
import { Utils } from './Utils';
import { autobind } from 'core-decorators';
var AsyncLoadProperty = /** @class */ (function () {
    function AsyncLoadProperty(type, getter, defaultValue, timeBuffer) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = null; }
        if (timeBuffer === void 0) { timeBuffer = 0; }
        this.loading = true;
        this.getterFunc = function () { return _this.defaultValue; };
        this.timeBuffer = false;
        this.emitter = null;
        this.getValue = function (param) {
            if (param === _this.lastParam) {
                return _this.currentValue;
            }
            _this.lastParam = param;
            _this.valueGetter(param);
            return _this.defaultValue;
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
                    _this.updateValue(_this.getterFunc(_.last(resList)));
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
            var Type = this.Type;
            switch (Type) {
                case String: return Utils.isString(value);
                case Boolean: return Utils.isBoolean(value);
                case Array: return Utils.isArray(value);
                case Number: return Utils.isNumber(value);
                default: return value instanceof Type;
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
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "isInited", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "getterFunc", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], AsyncLoadProperty.prototype, "emitter", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
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
/**
 * @return { PropertyDecorator }
 */
export function asyncComputed(_a) {
    var type = _a.type, defaultValue = _a.defaultValue, resetFrom = _a.resetFrom, watcher = _a.watcher, time = _a.time;
    /**
     * @type {PropertyDecorator}
     * @param { * } target
     * @param { string } propertyName
     * @param { PropertyDescriptor } descriptor
     */
    function Async(target, propertyName, descriptor) {
        var asyncName = "$" + propertyName + "Async";
        var getter = descriptor.get, set = descriptor.set, other = __rest(descriptor, ["get", "set"]);
        if (getter) {
            descriptor.get = function () {
                var _this = this;
                var _a;
                var sourceInstance = this;
                if (!this[asyncName]) {
                    var asyncNpm_1 = new AsyncLoadProperty(type, function (param) { return Reflect.apply(getter, sourceInstance, []); }, defaultValue, time);
                    extendObservable(this, (_a = {},
                        Object.defineProperty(_a, asyncName, {
                            get: function () {
                                return asyncNpm_1;
                            },
                            enumerable: true,
                            configurable: true
                        }),
                        _a));
                    if (!_.isNil(watcher)) {
                        reaction(function () { return _this[watcher]; }, function (trigger) {
                            _this[asyncName].reset(asyncNpm_1.currentValue).getValue(trigger);
                        }, { fireImmediately: true });
                    }
                }
                return this[asyncName].getValue(this[watcher]);
            };
        }
        return computed.struct(target, propertyName, descriptor);
    }
    return Async;
}
var OptionsPipeStore = /** @class */ (function () {
    function OptionsPipeStore() {
        var _this = this;
        /**
         * 至今为止选择过的optionList
         * @type { Array }
         */
        this.selectedOptions = [];
        this.valuesToLabels = function (value, joinKey) {
            if (joinKey === void 0) { joinKey = false; }
            var result = Utils.isArrayFilter(Utils.arrayMapToKeysDive(Utils.getOptionsByValue(Utils.isArrayFilter(_this.isSearch ? _this.selectedOptions : _this.itemConfig.options), value), 'label'), []);
            return joinKey !== false ? result.join(joinKey) : result;
        };
    }
    OptionsPipeStore.prototype.setItemConfig = function (itemConfig) {
        this.itemConfig = itemConfig;
    };
    OptionsPipeStore.prototype.patchSelectedOption = function (optionsList) {
        var _this = this;
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(optionsList, function (item) { return !_.some(_this.selectedOptions, function (option) { return option.value === item.value; }); }));
    };
    OptionsPipeStore.prototype.patchSelectedOptionByValues = function (valueList, options) {
        var _this = this;
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(Utils.getOptionsByValue(options, valueList), function (item) { return !_.some(_this.selectedOptions, function (option) { return option.value === item.value; }); }));
    };
    OptionsPipeStore.prototype.nextOptionsWillUpdateValue = function (nextOptions, keyWordArr, lastValue) {
        var selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr);
        if (selectedOptions.length > 0) {
            var selectValue = multiple
                ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                : _.get(selectedOptions, '[0].value');
            if (!Utils.likeArray(selectValue, lastValue))
                true;
        }
        return false;
    };
    OptionsPipeStore.prototype.labelsToValues = function () {
        var _this = this;
        return function (label) {
            return Utils.arrayMapToKeysDive(Utils.getOptionsByLabel(_this.isSearch ? _this.selectedOptions : _this.itemConfig.options, label), 'value');
        };
    };
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], OptionsPipeStore.prototype, "itemConfig", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsPipeStore.prototype, "setItemConfig", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], OptionsPipeStore.prototype, "selectedOptions", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsPipeStore.prototype, "patchSelectedOption", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], OptionsPipeStore.prototype, "patchSelectedOptionByValues", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OptionsPipeStore.prototype, "labelsToValues", null);
    return OptionsPipeStore;
}());
export { OptionsPipeStore };
//# sourceMappingURL=AsyncProperty.js.map