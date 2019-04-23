var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OptionsStore_1;
import { observable, computed, action, runInAction } from 'mobx';
import { EventStoreInject } from '../../utils/EventStore';
import { ItemConfig } from '../ItemConfig';
import { autobind } from 'core-decorators';
import Utils from '../../utils';
import { findIndex } from 'lodash';
let OptionsStore = OptionsStore_1 = class OptionsStore {
    constructor(itemConfig) {
        this.__keyMap = {};
        this.__optionMap = new WeakMap();
        this.shadowOption = { key: Utils.uuid(), errorMsg: null, label: '', value: '', highlight: true };
        this.itemConfig = itemConfig;
        if (this.itemConfig.allowInput) {
            console.log(this);
            this.$on('options-change', () => {
                // console.log(options, this.shadowOption.value)
                // if(this.itemConfig.label==='归属车辆')
                //   debugger
                this.setShadowOptionByValue(this.shadowOption.value, 'options-update');
            });
            // reaction(() => this.itemConfig.options, options => {
            //   // console.log(options, this.shadowOption.value)
            //   // if(this.itemConfig.label==='归属车辆')
            //   //   debugger
            //   this.setShadowOptionByValue(this.shadowOption.value, 'options-update')
            // }, { fireImmediately: true })
        }
    }
    get shadowOptionMode() {
        return this.itemConfig.code === this.itemConfig.nameCode ? 'text' : 'code';
    }
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    async setShadowOptionByValue(value, source) {
        const options = await this.itemConfig.getOptionsSafe();
        // if(this.itemConfig.label==='交强险承保单位')
        //   debugger
        const label = Utils.isStringFilter(Utils.valueToLabel(options, value), this.itemConfig.searchName);
        this.shadowUpdateDispatcher(label, value, source);
    }
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    async setShadowOption(label, source) {
        await this.itemConfig.getOptionsSafe();
        // if(this.itemConfig.label==='交强险承保单位')
        //   debugger
        const value = this.labelToValue(label);
        this.shadowUpdateDispatcher(label, value, source);
    }
    labelToValue(label) {
        return Utils.isStringFilter(Utils.labelToValue(this.displayOptions, new RegExp(`^(\\\[(.*)\\\]|)${label}(\\\[(.*)\\\]|)$`)), label);
    }
    async shadowUpdateDispatcher(label, value, source) {
        // console.log(`setShadowOption by ${source} mode: ${this.shadowOptionMode}, value: ${value}, label: ${label}`, _.cloneDeep(this.displayOptions), _.cloneDeep(this.itemConfig.options))
        try {
            if (Utils.isNotEmptyString(value)) {
                await this.itemConfig.validateHandler(value);
                // console.log(result, value)
            }
            else {
                throw new Error();
            }
            // console.error('shadowOption result', result, value)
            runInAction(() => this.updateShadowOption(value, label));
        }
        catch (error) {
            // console.log('shadowOption', error)
            if (this.shadowOption.label !== value) {
                this.shadowOption.value = value;
                this.shadowOption.label = label;
                this.shadowOption.errorMsg = error;
            }
        }
    }
    updateShadowOption(value, label = undefined) {
        if (Utils.isString(this.shadowOption.errorMsg)) {
            this.shadowOption.errorMsg = null;
        }
        if (this.itemConfig.label === '交强险承保单位')
            debugger;
        if (value === this.value && this.shadowOption.value != this.value) {
            // console.log(this.selectedLablesStr)
            this.shadowOption.label = label || this.selectedLablesStr;
            this.shadowOption.value = this.value;
        }
        else if (value !== this.value) {
            const shadowOptionSafe = Utils.getOptionsByValue(this.filterOptions, value, true);
            if (shadowOptionSafe) {
                this.shadowOption.label = shadowOptionSafe.label;
            }
            else {
                const { allowCreate } = this.itemConfig;
                if (Utils.isFunction(allowCreate)) {
                    const { label } = allowCreate(value);
                    this.shadowOption.label = Utils.isStringFilter(label, value, '');
                }
                else {
                    this.shadowOption.label = Utils.isStringFilter(label, value, '');
                }
            }
            this.shadowOption.value = value;
        }
        // debugger
        // if (value === this.value && this.shadowOption.value != this.value) {
        //   // console.log(this.selectedLablesStr)
        //   this.shadowOption.label = label || this.selectedLablesStr
        //   this.shadowOption.value = this.value
        // } else if(value !== this.value) {
        //   if (Utils.isFunction(allowCreate)) {
        //     const { label } = allowCreate(value)
        //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
        //   } else {
        //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
        //   }
        //   this.shadowOption.value = Utils.isStringFilter(value, '')
        // }
        console.log(Utils.cloneDeep(this.shadowOption));
        return this.shadowOption = { ...this.shadowOption };
    }
    get isValidShadowOption() {
        return !this.itemConfig.allowInput || !Utils.isString(this.shadowOption.errorMsg);
    }
    static getOptionsKey(item, index) {
        return Utils.isStringFilter(item.id, item.key, item.value, (Utils.isObject(item) ? index : item) + '');
    }
    get __optionArr() {
        const { options } = this.itemConfig;
        const next = [];
        // this.arrayMap(this.__optionArr, this.toConvertedOption)
        for (const item of Utils.isArrayFilter(options) || []) {
            if (!Utils.isNil(item)) {
                const index = next.length;
                next.push(Utils.isObject(item) ? (item.__key == null ? { ...item, __key: OptionsStore_1.getOptionsKey(item, index) } : item) : {
                    __key: OptionsStore_1.getOptionsKey(item, index),
                    value: item
                });
            }
        }
        return next;
    }
    toConvertedOption(item, index) {
        if (!this.__optionMap.get(item)) {
            if (!Utils.isNumber(this.__keyMap[item.__key])) {
                this.__keyMap[item.__key] = 0;
            }
            this.__keyMap[item.__key]++;
            this.__optionMap.set(item, {
                ...item,
                key: `${item.__key}.${this.__keyMap[item.__key]}`,
                label: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''),
                value: Utils.isStringFilter(item.value, (Utils.isObject(item) ? index : item) + '')
            });
        }
        return this.__optionMap.get(item);
    }
    get convertedOption() {
        // console.time(`2displayOptionsNative${this.itemConfig.label}`)
        const result = Utils.arrayMapDive(this.__optionArr, this.toConvertedOption);
        // console.timeEnd(`2displayOptionsNative${this.itemConfig.label}`)
        // console.time(`displayOptionsNative${this.itemConfig.label}`)
        // const result = [], array = this.__optionArr
        // while (result.length < array.length) {
        //   result[result.length] = (this.toConvertedOption(array[result.length], result.length, this.__keyMap, this.__optionMap))
        // }
        // console.timeEnd(`displayOptionsNative${this.itemConfig.label}`)
        return result;
    }
    get filterOptions() {
        // trace()
        const { filterOptions } = this.itemConfig;
        return Utils.isNotEmptyArray(filterOptions)
            ? Utils.arrayFilterDive(this.convertedOption, (item) => !filterOptions.includes(item.label)) : this.convertedOption;
    }
    get selectedItemIndex() {
        const value = Utils.isNotEmptyValueFilter(this.shadowOption.value, this.value);
        return findIndex(this.filterOptions, ({ value: v, label }) => {
            // debugger
            return Utils.isEqual(v, value) || (Utils.isEqual(label, value));
        });
    }
    get displayOptions() {
        const { allowInput } = this.itemConfig;
        const defaultOptions = this.filterOptions;
        if (allowInput) {
            // debugger
            // console.log('getShadowOption', defaultOptions, this.shadowOption)
            if (this.selectedItemIndex > -1) {
                return Utils.arrayMapDive(defaultOptions, (option, index) => this.selectedItemIndex === index ? { ...option, highlight: true } : option);
            }
            else if (Utils.isNotEmptyString(this.shadowOption.value) && !Utils.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
                // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
                return Utils.concat(this.shadowOption, defaultOptions);
            }
        }
        return defaultOptions;
    }
};
__decorate([
    observable,
    __metadata("design:type", ItemConfig)
], OptionsStore.prototype, "itemConfig", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], OptionsStore.prototype, "shadowOption", void 0);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "shadowOptionMode", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "setShadowOptionByValue", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "setShadowOption", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsStore.prototype, "labelToValue", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "shadowUpdateDispatcher", null);
__decorate([
    action.bound,
    Utils.logger('testt'),
    Utils.timebuffer(10),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OptionsStore.prototype, "updateShadowOption", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "isValidShadowOption", null);
__decorate([
    computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "__optionArr", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Object)
], OptionsStore.prototype, "toConvertedOption", null);
__decorate([
    computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "convertedOption", null);
__decorate([
    computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "filterOptions", null);
__decorate([
    computed,
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "selectedItemIndex", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "displayOptions", null);
OptionsStore = OptionsStore_1 = __decorate([
    EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig }),
    __metadata("design:paramtypes", [ItemConfig])
], OptionsStore);
export { OptionsStore };
//# sourceMappingURL=OptionsStore.js.map