"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const Utils_1 = require("./Utils");
const ItemConfig_1 = require("../components/FormPage/input-Item/ItemConfig");
const core_decorators_1 = require("core-decorators");
class AsyncLoadProperty {
    constructor(type, getter, defaultValue = null, timeBuffer = 0) {
        this.loading = true;
        this.getterFunc = () => this.defaultValue;
        this.timeBuffer = false;
        this.emitter = null;
        this.getValue = (param) => {
            if (param === this.lastParam) {
                return this.currentValue;
            }
            this.lastParam = param;
            this.valueGetter(param);
            return this.defaultValue;
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
    reset(nextDefaultValue, force) {
        if (this.isTypedValue(nextDefaultValue)) {
            this.defaultValue = nextDefaultValue;
            this.currentValue = this.defaultValue;
            this.isInited = false;
        }
        else if (force) {
            this.isInited = false;
        }
        return this;
    }
    updateValue(nextValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield nextValue;
            if (this.isTypedValue(value)) {
                this.currentValue = value;
                if (!this.isInited) {
                    this.isInited = true;
                }
                this.loadingEnd();
            }
        });
    }
    registerGetter(getter) {
        this.getterFunc = Utils_1.Utils.isFunctionFilter(getter, this.getterFunc);
    }
    get valueGetter() {
        if (this.timeBuffer > 0) {
            const emitter = Utils_1.Utils.createSimpleTimeBufferInput((resList) => {
                this.updateValue(this.getterFunc(_.last(resList)));
            }, this, this.timeBuffer, true);
            return mobx_1.action((param) => {
                mobx_1.runInAction(() => __awaiter(this, void 0, void 0, function* () {
                    this.loadingStart();
                    return emitter(param);
                }));
            });
        }
        return mobx_1.action((param) => {
            mobx_1.runInAction(() => {
                this.loadingStart();
                this.updateValue(this.getterFunc(param));
            });
        });
    }
    loadingStart() {
        if (!this.loading)
            this.loading = true;
    }
    loadingEnd() {
        if (this.loading)
            this.loading = false;
    }
    isTypedValue(value) {
        if (value == null) {
            return true;
        }
        else if (Utils_1.Utils.isFunction(this.type)) {
            return this.type(value);
        }
        else {
            const { Type } = this;
            switch (Type) {
                case String: return Utils_1.Utils.isString(value);
                case Boolean: return Utils_1.Utils.isBoolean(value);
                case Array: return Utils_1.Utils.isArray(value);
                case Number: return Utils_1.Utils.isNumber(value);
                default: return value instanceof Type;
            }
        }
    }
}
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "type", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "defaultValue", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "currentValue", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "loading", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "isInited", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "getterFunc", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "emitter", void 0);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "reset", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AsyncLoadProperty.prototype, "updateValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "registerGetter", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], AsyncLoadProperty.prototype, "valueGetter", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "loadingStart", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "loadingEnd", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "isTypedValue", null);
exports.AsyncLoadProperty = AsyncLoadProperty;
window.AsyncLoadProperty = AsyncLoadProperty;
/**
 * @return { PropertyDecorator }
 */
function asyncComputed({ type, defaultValue, resetFrom, watcher, time }) {
    /**
     * @type {PropertyDecorator}
     * @param { * } target
     * @param { string } propertyName
     * @param { PropertyDescriptor } descriptor
     */
    function Async(target, propertyName, descriptor) {
        const asyncName = `$${propertyName}Async`;
        const { get: getter, set } = descriptor, other = __rest(descriptor, ["get", "set"]);
        if (getter) {
            descriptor.get = function () {
                let sourceInstance = this;
                if (!this[asyncName]) {
                    const asyncNpm = new AsyncLoadProperty(type, param => Reflect.apply(getter, sourceInstance, []), defaultValue, time);
                    mobx_1.extendObservable(this, {
                        get [asyncName]() {
                            return asyncNpm;
                        }
                    });
                    if (!_.isNil(watcher)) {
                        mobx_1.reaction(() => this[watcher], trigger => {
                            this[asyncName].reset(asyncNpm.currentValue).getValue(trigger);
                        }, { fireImmediately: true });
                    }
                }
                return this[asyncName].getValue(this[watcher]);
            };
        }
        return mobx_1.computed.struct(target, propertyName, descriptor);
    }
    return Async;
}
exports.asyncComputed = asyncComputed;
class OptionsPipeStore {
    constructor() {
        /**
         * 至今为止选择过的optionList
         * @type { Array }
         */
        this.selectedOptions = [];
        this.valuesToLabels = (value, joinKey = false) => {
            const result = Utils_1.Utils.isArrayFilter(Utils_1.Utils.arrayMapToKeysDive(Utils_1.Utils.getOptionsByValue(Utils_1.Utils.isArrayFilter(this.isSearch ? this.selectedOptions : this.itemConfig.options), value), 'label'), []);
            return joinKey !== false ? result.join(joinKey) : result;
        };
    }
    setItemConfig(itemConfig) {
        this.itemConfig = itemConfig;
    }
    patchSelectedOption(optionsList) {
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(optionsList, item => !_.some(this.selectedOptions, option => option.value === item.value)));
    }
    patchSelectedOptionByValues(valueList, options) {
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(Utils_1.Utils.getOptionsByValue(options, valueList), item => !_.some(this.selectedOptions, option => option.value === item.value)));
    }
    nextOptionsWillUpdateValue(nextOptions, keyWordArr, lastValue) {
        const selectedOptions = Utils_1.Utils.getOptionsByLabel(nextOptions, keyWordArr);
        if (selectedOptions.length > 0) {
            const selectValue = multiple
                ? Utils_1.Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                : _.get(selectedOptions, '[0].value');
            if (!Utils_1.Utils.likeArray(selectValue, lastValue))
                true;
        }
        return false;
    }
    labelsToValues() {
        return (label) => {
            return Utils_1.Utils.arrayMapToKeysDive(Utils_1.Utils.getOptionsByLabel(this.isSearch ? this.selectedOptions : this.itemConfig.options, label), 'value');
        };
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], OptionsPipeStore.prototype, "itemConfig", void 0);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsPipeStore.prototype, "setItemConfig", null);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], OptionsPipeStore.prototype, "selectedOptions", void 0);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsPipeStore.prototype, "patchSelectedOption", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OptionsPipeStore.prototype, "patchSelectedOptionByValues", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OptionsPipeStore.prototype, "labelsToValues", null);
exports.OptionsPipeStore = OptionsPipeStore;
window.ItemConfig = ItemConfig_1.ItemConfig;
//# sourceMappingURL=AsyncProperty.js.map