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
import { observable, computed, action, runInAction, reaction, extendObservable } from 'mobx';
import { Utils } from './Utils';
import { ItemConfig } from '../stores/ItemConfig';
import { autobind } from 'core-decorators';
export class AsyncLoadProperty {
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
    async updateValue(nextValue) {
        const value = await nextValue;
        if (this.isTypedValue(value)) {
            this.currentValue = value;
            if (!this.isInited) {
                this.isInited = true;
            }
            this.loadingEnd();
        }
    }
    registerGetter(getter) {
        this.getterFunc = Utils.isFunctionFilter(getter, this.getterFunc);
    }
    get valueGetter() {
        if (this.timeBuffer > 0) {
            const emitter = Utils.createSimpleTimeBufferInput((resList) => {
                this.updateValue(this.getterFunc(_.last(resList)));
            }, this, this.timeBuffer, true);
            return action((param) => {
                runInAction(async () => {
                    this.loadingStart();
                    return emitter(param);
                });
            });
        }
        return action((param) => {
            runInAction(() => {
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
        else if (Utils.isFunction(this.type)) {
            return this.type(value);
        }
        else {
            const { Type } = this;
            switch (Type) {
                case String: return Utils.isString(value);
                case Boolean: return Utils.isBoolean(value);
                case Array: return Utils.isArray(value);
                case Number: return Utils.isNumber(value);
                default: return value instanceof Type;
            }
        }
    }
}
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
window.AsyncLoadProperty = AsyncLoadProperty;
/**
 * @return { PropertyDecorator }
 */
export function asyncComputed({ type, defaultValue, resetFrom, watcher, time }) {
    /**
     * @type {PropertyDecorator}
     * @param { * } target
     * @param { string } propertyName
     * @param { PropertyDescriptor } descriptor
     */
    function Async(target, propertyName, descriptor) {
        const asyncName = `$${propertyName}Async`;
        const { get: getter, set, ...other } = descriptor;
        if (getter) {
            descriptor.get = function () {
                let sourceInstance = this;
                if (!this[asyncName]) {
                    const asyncNpm = new AsyncLoadProperty(type, param => Reflect.apply(getter, sourceInstance, []), defaultValue, time);
                    extendObservable(this, {
                        get [asyncName]() {
                            return asyncNpm;
                        }
                    });
                    if (!_.isNil(watcher)) {
                        reaction(() => this[watcher], trigger => {
                            this[asyncName].reset(asyncNpm.currentValue).getValue(trigger);
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
export class OptionsPipeStore {
    constructor() {
        /**
         * 至今为止选择过的optionList
         * @type { Array }
         */
        this.selectedOptions = [];
        this.valuesToLabels = (value, joinKey = false) => {
            const result = Utils.isArrayFilter(Utils.arrayMapToKeysDive(Utils.getOptionsByValue(Utils.isArrayFilter(this.isSearch ? this.selectedOptions : this.itemConfig.options), value), 'label'), []);
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
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(Utils.getOptionsByValue(options, valueList), item => !_.some(this.selectedOptions, option => option.value === item.value)));
    }
    nextOptionsWillUpdateValue(nextOptions, keyWordArr, lastValue) {
        const selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr);
        if (selectedOptions.length > 0) {
            const selectValue = multiple
                ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                : _.get(selectedOptions, '[0].value');
            if (!Utils.likeArray(selectValue, lastValue))
                true;
        }
        return false;
    }
    labelsToValues() {
        return (label) => {
            return Utils.arrayMapToKeysDive(Utils.getOptionsByLabel(this.isSearch ? this.selectedOptions : this.itemConfig.options, label), 'value');
        };
    }
}
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
window.ItemConfig = ItemConfig;
//# sourceMappingURL=AsyncProperty.js.map