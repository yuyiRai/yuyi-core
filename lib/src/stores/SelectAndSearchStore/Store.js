var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SelectAndSearchStore_1;
import { observable, computed, action, runInAction } from 'mobx';
import { EventStoreInject } from '../../utils/EventStore';
import { ItemConfig } from '../ItemConfig';
import { autobind } from 'core-decorators';
import { OptionsStore } from './OptionsStore';
import Utils from '../../utils';
import { last, toString, pullAllBy, some, pullAll, map, filter, concat, get } from 'lodash';
const _ = {
    last, toString, pullAllBy, pullAll, some, map, filter, concat, get
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
            const nextValue = Utils.zipEmptyData(Utils.castArray(value));
            if (!Utils.isEqual(nextValue, this.value)) {
                this.value = nextValue;
            }
        }
        else {
            if (!Utils.isString(value))
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
        this.itemConfig = (itemConfig instanceof ItemConfig) ? itemConfig : (Utils.isObject(itemConfig) ? new ItemConfig(itemConfig) : this.itemConfig);
        this.optionsStore = new OptionsStore(this.itemConfig);
        this.searchEventEmitter = Utils.createSimpleTimeBufferInput((keywordList) => {
            this.remoteMethod(_.last(keywordList));
        }, this, 300);
    }
    /**
     *
     * @param { string | string[] } key
     */
    searchMethods(key) {
        const keyArr = Utils.castArray(key);
        console.log('keyword list', keyArr, this.selectedLables);
        if (Utils.isNotEmptyArray(keyArr) && (keyArr !== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
            if (this.itemConfig.allowInput) {
                // debugger
                this.optionsStore.setShadowOption(Utils.castString(key), 'search');
            }
            this.searchEventEmitter(keyArr);
        }
    }
    get placeholder() {
        switch (this.type) {
            case 'select': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请选择' + (this.itemConfig.label || ''));
            case 'search': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请输入关键字搜索...');
            default: return '';
        }
    }
    get isSearch() {
        return this.type === "search";
    }
    get hasNameCode() {
        return Utils.isNotEmptyString(this.itemConfig.nameCode);
    }
    get useEmpty() {
        const { useHint, useEmpty } = this.itemConfig;
        return Utils.isNil(useHint) && useEmpty !== false ? (options) => options && options.length > 0 : () => false;
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
    async remoteMethod(keyWord) {
        // this.itemConfig.label=="受伤部位" && console.log('start remoteMethod', this.itemConfig.label, response)
        const { itemConfig } = this;
        // // this.itemConfig.label=="受伤部位" && console.log(this.itemConfig.remoteMethod)
        const { remoteSearch, multiple, setOptions, label } = itemConfig;
        console.log('尝试搜索', label, keyWord, typeof keyWord);
        const keyWordArr = Utils.zipEmptyData(Utils.castArray(keyWord));
        const lastValue = Utils.cloneDeep(this.value);
        runInAction(async () => {
            if (Utils.isFunction(setOptions) && Utils.isFunction(remoteSearch)) {
                const nextOptions = await remoteSearch(keyWordArr);
                // 去除之前选择过的重复项
                if (!Utils.isNil(multiple))
                    Utils.arrayPush(nextOptions, _.pullAllBy(this.selectedOptions, nextOptions, 'value'));
                setOptions(nextOptions);
                this.patchSelectedOption(nextOptions);
                // debugger
                // 如果输入的完整字符匹配到选项，自动选中
                // this.itemConfig.label=="受伤部位" && console.log('setOptions', this, setOptions, nextOptions)
                const selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr);
                if (selectedOptions.length > 0) {
                    const selectValue = multiple
                        ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                        : _.get(selectedOptions, '[0].value');
                    console.log('搜索完毕', label, selectedOptions, selectValue, this.value);
                    if (!Utils.likeArray(selectValue, this.value))
                        this.onChange(selectValue);
                    // this.itemConfig.label=="手术名称" && console.log('搜索完毕', label, keyWordArr, itemConfig, nextOptions, this.selectedOptions, this.itemConfig.loading)
                }
            }
        });
    }
    onChangeWithLabel(label) {
        const value = this.optionsStore.labelToValue(label);
        // console.log('onBlur', label, value, this.value)
        // if(Utils.isEqual(value, this.value)) {
        //   return
        // }
        return this.onChange(value);
    }
    defaultCreater(value) {
        return ({ label: value, value });
    }
    onChange(value) {
        if (!Utils.isEqual(value, this.value)) {
            const { options, nameCode, allowCreate } = this.itemConfig;
            const selectedObj = Utils.getOptionsByValue(options, value);
            // const { pull: pullList, push: pushList } = Utils.getListDifferent(this.value, value)
            // this.patchSelectedOption(pushList)
            // console.log('onChange', label, value, this.value)
            // this.value = value
            const isAllowCreateOption = allowCreate && selectedObj.length === 0 && Utils.isNotEmptyValue(value) && this.isValidShadowOption;
            if (isAllowCreateOption) {
                const additionOption = Utils.isFunctionFilter(allowCreate, this.defaultCreater)(value);
                if (Utils.getOptionsByValue(options, additionOption.value || additionOption).length == 0) {
                    // this.itemConfig.label=="受伤部位" && console.log('update options additions',allowCreate, selectedObj)
                    options.push(additionOption);
                    selectedObj.push(additionOption);
                    console.log('createOptions', additionOption);
                    this.itemConfig.setOptions(options);
                }
                // this.itemConfig.setOptions(options.concat([{label: value, value}]))
            }
            debugger;
            if (Utils.isNotEmptyString(nameCode)) {
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
        return Utils.zipEmptyData(Utils.isNotEmptyArrayFilter(this.valuesToLabels(this.value), [this.shadowOption.label]));
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
                    this.onChange(_.pullAll([...this.value], this.labelsToValues(label)));
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
        const [prefix, label, suffix] = Utils.isStringFilter(str, ',,').replace(/^(\[(.*?)\]|)(.*?)(\[(.*?)\]|)$/, '$2,$3,$5').split(',');
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
        return Utils.labelsToValues(this.isSearch ? this.selectedOptions : this.itemConfig.options, label);
    }
    valuesToLabels(value, joinKey) {
        return Utils.valuesToLabels(this.isSearch ? this.selectedOptions : this.itemConfig.options, value, joinKey);
    }
};
__decorate([
    observable,
    __metadata("design:type", Object)
], SelectAndSearchStore.prototype, "type", void 0);
__decorate([
    observable,
    __metadata("design:type", ItemConfig)
], SelectAndSearchStore.prototype, "itemConfig", void 0);
__decorate([
    observable,
    __metadata("design:type", OptionsStore)
], SelectAndSearchStore.prototype, "optionsStore", void 0);
__decorate([
    observable.ref,
    __metadata("design:type", Function)
], SelectAndSearchStore.prototype, "searchEventEmitter", void 0);
__decorate([
    observable.ref,
    __metadata("design:type", Array)
], SelectAndSearchStore.prototype, "selectedOptions", void 0);
__decorate([
    observable.ref,
    __metadata("design:type", Object)
], SelectAndSearchStore.prototype, "value", void 0);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "shadowOption", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setShadowOption", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setShadowOptionByValue", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "displayOptions", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setValue", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ItemConfig]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "setConfig", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "searchMethods", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "placeholder", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "isSearch", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "hasNameCode", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "useEmpty", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "isCenter", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "popperClass", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SelectAndSearchStore.prototype, "remoteMethod", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "onChangeWithLabel", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "onChange", null);
__decorate([
    action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "patchSelectedOption", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLables", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLablesStr", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLablesConfig", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "hasSelectedTag", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "selectedLabelConveration", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchStore.prototype, "shadowLabelConveration", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "labelsToValues", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SelectAndSearchStore.prototype, "valuesToLabels", null);
SelectAndSearchStore = SelectAndSearchStore_1 = __decorate([
    EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig })
], SelectAndSearchStore);
export { SelectAndSearchStore };
//# sourceMappingURL=Store.js.map