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
var SelectAndSearchStore_1;
const mobx_1 = require("mobx");
const EventStore_1 = require("../../utils/EventStore");
const ItemConfig_1 = require("../ItemConfig");
const core_decorators_1 = require("core-decorators");
const OptionsStore_1 = require("./OptionsStore");
const utils_1 = __importDefault(require("../../utils"));
const lodash_decorators_1 = require("lodash-decorators");
const lodash_1 = require("lodash");
const _ = {
    last: lodash_1.last, toString: lodash_1.toString, pullAllBy: lodash_1.pullAllBy, pullAll: lodash_1.pullAll, some: lodash_1.some, map: lodash_1.map, filter: lodash_1.filter, concat: lodash_1.concat, get: lodash_1.get
};
let SelectAndSearchStore = SelectAndSearchStore_1 = class SelectAndSearchStore {
    constructor() {
        this.type = 'select';
        /**
         * 至今为止选择过的optionList
         * @type { Array }
         */
        this.selectedOptions = [];
    }
    // shadowOptionObserve = observe(this.shadowOption, 'value', next => console.log('shadowOption', next))
    get shadowOption() {
        return this.optionsStore.shadowOption || {};
    }
    setShadowOption(label, source) {
        this.optionsStore.setShadowOption(label, source);
    }
    setShadowOptionByValue(value, source) {
        this.optionsStore.setShadowOptionByValue(value, source);
    }
    get displayOptions() {
        return this.optionsStore.displayOptions || [];
    }
    /**
     * 设置当前值
     * @param {string | Array<string>} value
     * @param {string} source
     */
    setValue(value, source) {
        if (this.itemConfig.multiple) {
            const nextValue = utils_1.default.zipEmptyData(utils_1.default.castArray(value));
            if (!utils_1.default.isEqual(nextValue, this.value)) {
                this.value = nextValue;
            }
        }
        else {
            if (!utils_1.default.isString(value))
                value = _.toString(value);
            if (value !== this.value) {
                this.value = value;
                if (this.itemConfig.allowInput && value !== this.shadowOption.value) {
                    this.optionsStore.setShadowOptionByValue(value, 'valueUpdate');
                }
            }
        }
    }
    /**
     * 设置配置
     * @param {'select' | 'search'} type
     * @param { ItemConfig } itemConfig
     */
    setConfig(type, itemConfig) {
        this.type = ['select', 'search'].includes(type) ? type : 'select';
        this.itemConfig = (itemConfig instanceof ItemConfig_1.ItemConfig) ? itemConfig : (utils_1.default.isObject(itemConfig) ? new ItemConfig_1.ItemConfig(itemConfig) : this.itemConfig);
        this.optionsStore = new OptionsStore_1.OptionsStore(this.itemConfig);
        this.searchEventEmitter = utils_1.default.createSimpleTimeBufferInput((keywordList) => {
            this.remoteMethod(_.last(keywordList));
        }, this, 300);
    }
    /**
     *
     * @param { string | string[] } key
     */
    searchMethods(key) {
        const keyArr = utils_1.default.castArray(key);
        // console.log('keyword list', keyArr, this.selectedLables, key)
        if (utils_1.default.isNotEmptyArray(keyArr) && (keyArr !== this.selectedLables) && !utils_1.default.likeArray(keyArr, this.selectedLables)) {
            if (this.itemConfig.allowInput) {
                // debugger
                this.optionsStore.setShadowOption(utils_1.default.castString(key), 'search');
            }
            this.searchEventEmitter(keyArr);
        }
    }
    get placeholder() {
        switch (this.type) {
            case 'select': return utils_1.default.isNotEmptyStringFilter(this.itemConfig.placeholder, '请选择' + (this.itemConfig.label || ''));
            case 'search': return utils_1.default.isNotEmptyStringFilter(this.itemConfig.placeholder, '请输入关键字搜索...');
            default: return '';
        }
    }
    get isSearch() {
        return this.type === "search";
    }
    get hasNameCode() {
        return utils_1.default.isNotEmptyString(this.itemConfig.nameCode);
    }
    get useEmpty() {
        const { useHint, useEmpty } = this.itemConfig;
        return utils_1.default.isNil(useHint) && useEmpty !== false ? (options) => options && options.length > 0 : () => false;
    }
    get isCenter() {
        return this.itemConfig.center === true;
    }
    get popperClass() {
        return (this.isCenter ? 'center' : '');
    }
    /**
     * 远程搜索方法
     * @param {string | Array<string>} keyWord 搜索关键字，可以是数组
     */
    remoteMethod(keyWord) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.itemConfig.label=="受伤部位" && console.log('start remoteMethod', this.itemConfig.label, response)
            const { itemConfig } = this;
            // // this.itemConfig.label=="受伤部位" && console.log(this.itemConfig.remoteMethod)
            const { remoteSearch, multiple, setOptions, label } = itemConfig;
            const keyWordArr = utils_1.default.zipEmptyData(utils_1.default.castArray(keyWord));
            console.log('尝试搜索', label, keyWord, typeof keyWord, keyWordArr);
            // debugger
            const lastValue = utils_1.default.cloneDeep(this.value);
            mobx_1.runInAction(() => __awaiter(this, void 0, void 0, function* () {
                if (utils_1.default.isFunction(setOptions) && utils_1.default.isFunction(remoteSearch)) {
                    const nextOptions = yield remoteSearch(keyWordArr);
                    // 去除之前选择过的重复项
                    if (!utils_1.default.isNil(multiple))
                        utils_1.default.arrayPush(nextOptions, _.pullAllBy(this.selectedOptions, nextOptions, 'value'));
                    setOptions(nextOptions);
                    this.patchSelectedOption(nextOptions);
                    // debugger
                    // 如果输入的完整字符匹配到选项，自动选中
                    // this.itemConfig.label=="受伤部位" && console.log('setOptions', this, setOptions, nextOptions)
                    const selectedOptions = utils_1.default.getOptionsByLabel(nextOptions, keyWordArr);
                    if (selectedOptions.length > 0) {
                        const selectValue = multiple
                            ? utils_1.default.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                            : _.get(selectedOptions, '[0].value');
                        console.log('搜索完毕', label, selectedOptions, selectValue, this.value);
                        if (!utils_1.default.likeArray(selectValue, utils_1.default.castArray(this.value)))
                            this.onChange(selectValue, 'options patch');
                        // this.itemConfig.label=="手术名称" && console.log('搜索完毕', label, keyWordArr, itemConfig, nextOptions, this.selectedOptions, this.itemConfig.loading)
                    }
                }
            }));
        });
    }
    onChangeWithLabel(label) {
        const value = this.optionsStore.labelToValue(label);
        // console.log('onBlur', label, value, this.value)
        // if(Utils.isEqual(value, this.value)) {
        //   return
        // }
        return this.onChange(value, 'blur');
    }
    defaultCreater(value) {
        return ({ label: value, value });
    }
    onChange(value, source) {
        if (!utils_1.default.isEqual(value, this.value)) {
            const { options, label, nameCode, allowCreate } = this.itemConfig;
            // 原始选项中是否选中
            const selectedObj = utils_1.default.getOptionsByValue(options, value);
            // const { pull: pullList, push: pushList } = Utils.getListDifferent(this.value, value)
            // this.patchSelectedOption(pushList)
            // this.value = value
            const isSelected = selectedObj.length > 0;
            const isAllowCreateOption = allowCreate && !isSelected && utils_1.default.isNotEmptyValue(value) && this.optionsStore.isValidShadowOption;
            console.log(`onChange by ${source} label: "${label}" value: "${value}" last-value: "${this.value}" allow-create:${isAllowCreateOption}`);
            if (isAllowCreateOption) {
                const additionOption = utils_1.default.isFunctionFilter(allowCreate, this.defaultCreater)(value);
                if (utils_1.default.getOptionsByValue(options, additionOption.value || additionOption).length == 0) {
                    // this.itemConfig.label=="受伤部位" && console.log('update options additions',allowCreate, selectedObj)
                    options.push(additionOption);
                    selectedObj.push(additionOption);
                    console.log('createOptions', additionOption);
                    this.itemConfig.setOptions(options);
                }
                // this.itemConfig.setOptions(options.concat([{label: value, value}]))
            }
            else if (!isSelected && utils_1.default.getOptionsByValue([this.shadowOption], value)) {
                selectedObj.push(this.shadowOption);
            }
            // debugger
            if (utils_1.default.isNotEmptyString(nameCode)) {
                // this.itemConfig.label=="受伤部位" && console.log('change-with', label, selectedObj)
                this.$emit('change-with', _.map(selectedObj, 'label').join(','), nameCode);
            }
            return this.$emit('change', value);
        }
    }
    patchSelectedOption(pushOptionsList) {
        // const { options } = this.itemConfig;
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(pushOptionsList, item => !_.some(this.selectedOptions, option => option.value === item.value)));
    }
    get selectedLables() {
        return utils_1.default.zipEmptyData(utils_1.default.isNotEmptyArrayFilter(this.valuesToLabels(this.value)) || [this.shadowOption.label]);
    }
    get selectedLablesStr() {
        return this.selectedLables.join(',');
    }
    get selectedLablesConfig() {
        return _.map(this.selectedLables, (label) => {
            return {
                label,
                remove: () => {
                    console.log('close', this.value, this.labelsToValues(label));
                    this.onChange(_.pullAll([...utils_1.default.castArray(this.value)], this.labelsToValues(label)), 'options delete');
                }
            };
        });
    }
    get hasSelectedTag() {
        return this.selectedLablesConfig.length > 0;
    }
    /**
     * 格式化Label
     * @param { string } str
     * @return { {prefix: string, label: string, suffix: string} } {prefix, label, suffix}
     */
    static getConvertLabel(str) {
        const [prefix, label, suffix] = utils_1.default.isStringFilter(str, ',,').replace(/^(\[(.*?)\]|)(.*?)(\[(.*?)\]|)$/, '$2,$3,$5').split(',');
        return { prefix, label, suffix };
    }
    /**
     * @type {{ prefix: string, label: string, suffix: string }}
     */
    get selectedLabelConveration() {
        return SelectAndSearchStore_1.getConvertLabel(this.selectedLablesStr);
    }
    /**
     * @type {{ prefix: string, label: string, suffix: string }}
     */
    get shadowLabelConveration() {
        return SelectAndSearchStore_1.getConvertLabel(this.shadowOption.label);
    }
    labelsToValues(label) {
        return utils_1.default.labelsToValues(this.isSearch ? this.selectedOptions : this.itemConfig.options, label);
    }
    valuesToLabels(value, joinKey) {
        return utils_1.default.valuesToLabels(this.isSearch ? this.selectedOptions : this.itemConfig.options, value, joinKey);
    }
};
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], SelectAndSearchStore.prototype, "type", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", ItemConfig_1.ItemConfig)
], SelectAndSearchStore.prototype, "itemConfig", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", OptionsStore_1.OptionsStore)
], SelectAndSearchStore.prototype, "optionsStore", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Function)
], SelectAndSearchStore.prototype, "searchEventEmitter", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Array)
], SelectAndSearchStore.prototype, "selectedOptions", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], SelectAndSearchStore.prototype, "value", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "shadowOption", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setShadowOption", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setShadowOptionByValue", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "displayOptions", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ItemConfig_1.ItemConfig]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setConfig", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "searchMethods", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "placeholder", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "isSearch", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "hasNameCode", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "useEmpty", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "isCenter", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "popperClass", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SelectAndSearchStore.prototype, "remoteMethod", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "onChangeWithLabel", null);
__decorate([
    lodash_decorators_1.Debounce(10),
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "onChange", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "patchSelectedOption", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLables", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLablesStr", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLablesConfig", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "hasSelectedTag", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLabelConveration", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "shadowLabelConveration", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "labelsToValues", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "valuesToLabels", null);
SelectAndSearchStore = SelectAndSearchStore_1 = __decorate([
    EventStore_1.EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig_1.ItemConfig })
], SelectAndSearchStore);
exports.SelectAndSearchStore = SelectAndSearchStore;
//# sourceMappingURL=Store.js.map