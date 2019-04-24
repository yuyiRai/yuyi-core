"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsStore_1;
const mobx_1 = require("mobx");
const EventStore_1 = require("../../utils/EventStore");
const ItemConfig_1 = require("../ItemConfig");
const core_decorators_1 = require("core-decorators");
const utils_1 = __importDefault(require("../../utils"));
const lodash_1 = require("lodash");
let OptionsStore = OptionsStore_1 = class OptionsStore {
    constructor(itemConfig) {
        this.__keyMap = {};
        this.__optionMap = new WeakMap();
        this.shadowOption = { key: utils_1.default.uuid(), errorMsg: null, label: '', value: '', highlight: true };
        this.itemConfig = itemConfig;
        if (this.itemConfig.allowInput) {
            console.log(this);
            this.$on('options-change', (options) => {
                console.log(options, this.lastOptions, this.shadowOption);
                this.lastOptions = lodash_1.cloneDeep(options);
                // if(this.itemConfig.label==='归属车辆')
                //   debugger
                this.setShadowOption(this.shadowOption.label, 'options-update');
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
    setShadowOptionByValue(value, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.itemConfig.getOptionsSafe();
            // if(this.itemConfig.label==='交强险承保单位')
            //   debugger
            const label = utils_1.default.isStringFilter(utils_1.default.valueToLabel(options, value), this.itemConfig.searchName);
            this.shadowUpdateDispatcher(label, value, source + 'byvaue');
        });
    }
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    setShadowOption(label, source) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.itemConfig.getOptionsSafe();
            // if(this.itemConfig.label==='交强险承保单位')
            //   debugger
            const value = this.labelToValue(label);
            this.shadowUpdateDispatcher(label, value, source);
        });
    }
    labelToValue(label) {
        return utils_1.default.isStringFilter(utils_1.default.labelToValue(this.displayOptions, new RegExp(`^(\\\[(.*)\\\]|)${label}(\\\[(.*)\\\]|)$`)), label);
    }
    shadowUpdateDispatcher(label, value, source) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`setShadowOption by ${source} mode: ${this.shadowOptionMode}, value: ${value}, label: ${label}`, {
                options: lodash_1.cloneDeep(this.displayOptions), config: this.itemConfig, options1: lodash_1.cloneDeep(this.itemConfig.options)
            });
            try {
                yield this.itemConfig.validateHandler(value);
                // if (Utils.isNotEmptyString(value)) {
                //   // console.log(result, value)
                // } else {
                //   throw new Error();
                // }
                // console.error('shadowOption result', result, value)
                mobx_1.runInAction(() => this.updateShadowOption(value, label));
            }
            catch (error) {
                console.log('shadowOption', error);
                if (this.shadowOption.label !== value) {
                    this.shadowOption.value = value;
                    this.shadowOption.label = label;
                    this.shadowOption.errorMsg = error;
                }
            }
        });
    }
    updateShadowOption(value, label = undefined) {
        if (utils_1.default.isString(this.shadowOption.errorMsg)) {
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
            const shadowOptionSafe = utils_1.default.getOptionsByValue(this.filterOptions, value, true);
            if (shadowOptionSafe) {
                this.shadowOption.label = shadowOptionSafe.label;
            }
            else {
                const { allowCreate } = this.itemConfig;
                if (utils_1.default.isFunction(allowCreate)) {
                    const { label } = allowCreate(value);
                    this.shadowOption.label = utils_1.default.isStringFilter(label, value, '');
                }
                else {
                    this.shadowOption.label = utils_1.default.isStringFilter(label, value, '');
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
        console.log(utils_1.default.cloneDeep(this.shadowOption));
        return this.shadowOption = Object.assign({}, this.shadowOption);
    }
    get isValidShadowOption() {
        return !this.itemConfig.allowInput || !utils_1.default.isString(this.shadowOption.errorMsg);
    }
    static getOptionsKey(item, index) {
        return utils_1.default.isStringFilter(item.id, item.key, item.value, (utils_1.default.isObject(item) ? index : item) + '');
    }
    get __optionArr() {
        const options = utils_1.default.isArrayFilter(this.itemConfig.options) || [];
        // this.arrayMap(this.__optionArr, this.toConvertedOption)
        const length = Math.min(options.length, 100);
        const next = Array(length);
        let index = -1;
        while (++index < length) {
            const item = options[index];
            if (!utils_1.default.isNil(item)) {
                next[index] = (utils_1.default.isObject(item) ? (item.__key == null ? Object.assign({}, item, { __key: OptionsStore_1.getOptionsKey(item, index) }) : item) : {
                    __key: OptionsStore_1.getOptionsKey(item, index),
                    value: item
                });
            }
        }
        return next;
    }
    toConvertedOption(item, index) {
        if (!this.__optionMap.get(item)) {
            if (!utils_1.default.isNumber(this.__keyMap[item.__key])) {
                this.__keyMap[item.__key] = 0;
            }
            this.__keyMap[item.__key]++;
            this.__optionMap.set(item, Object.assign({}, item, { key: `${item.__key}.${this.__keyMap[item.__key]}`, label: utils_1.default.isStringFilter(item.label, item.value, (utils_1.default.isObject(item) ? index : item) + ''), value: utils_1.default.isStringFilter(item.value, (utils_1.default.isObject(item) ? index : item) + '') }));
        }
        return this.__optionMap.get(item);
    }
    get convertedOption() {
        // console.time(`2displayOptionsNative${this.itemConfig.label}`)
        const result = utils_1.default.arrayMapDive(this.__optionArr, this.toConvertedOption);
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
        return utils_1.default.isNotEmptyArray(filterOptions)
            ? utils_1.default.arrayFilterDive(this.convertedOption, (item) => !filterOptions.includes(item.label)) : this.convertedOption;
    }
    get selectedItemIndex() {
        const value = utils_1.default.isNotEmptyValueFilter(this.shadowOption.value, this.value);
        return lodash_1.findIndex(this.filterOptions, ({ value: v, label }) => {
            // debugger
            return utils_1.default.isEqual(v, value) || (utils_1.default.isEqual(label, value));
        });
    }
    get displayOptions() {
        const { allowInput } = this.itemConfig;
        const defaultOptions = this.filterOptions;
        if (allowInput) {
            // debugger
            // console.log('getShadowOption', defaultOptions, this.shadowOption)
            if (this.selectedItemIndex > -1) {
                return utils_1.default.arrayMapDive(defaultOptions, (option, index) => this.selectedItemIndex === index ? Object.assign({}, option, { highlight: true }) : option);
            }
            else if (utils_1.default.isNotEmptyString(this.shadowOption.value) && !utils_1.default.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
                // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
                return utils_1.default.concat(this.shadowOption, defaultOptions);
            }
        }
        return defaultOptions;
    }
};
__decorate([
    mobx_1.observable,
    __metadata("design:type", ItemConfig_1.ItemConfig)
], OptionsStore.prototype, "itemConfig", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], OptionsStore.prototype, "shadowOption", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "shadowOptionMode", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "setShadowOptionByValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "setShadowOption", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptionsStore.prototype, "labelToValue", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OptionsStore.prototype, "shadowUpdateDispatcher", null);
__decorate([
    utils_1.default.timebuffer(10), mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OptionsStore.prototype, "updateShadowOption", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "isValidShadowOption", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "__optionArr", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Object)
], OptionsStore.prototype, "toConvertedOption", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "convertedOption", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "filterOptions", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "selectedItemIndex", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OptionsStore.prototype, "displayOptions", null);
OptionsStore = OptionsStore_1 = __decorate([
    EventStore_1.EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig_1.ItemConfig }),
    __metadata("design:paramtypes", [ItemConfig_1.ItemConfig])
], OptionsStore);
exports.OptionsStore = OptionsStore;
//# sourceMappingURL=OptionsStore.js.map