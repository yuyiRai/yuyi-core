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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// import 'Reflect-metadata';
const mobx_1 = require("mobx");
const ItemConfig_1 = require("./input-Item/ItemConfig");
const CommonDto_js_1 = __importDefault(require("@/utils/Utils/CommonDto.js"));
const CommonFilter_1 = __importDefault(require("./input-Item/CommonFilter"));
const core_decorators_1 = require("core-decorators");
class DisplayConfig {
    init(itemConfig, props) {
        this.itemConfig = itemConfig;
        this.props = props;
        return this;
    }
    get isInlineMessage() {
        return this.itemConfig.inline || this.itemConfig.name === this.itemConfig.code;
    }
    get isShowMessage() {
        return !this.itemConfig.isViewOnly && ![this.itemConfig.showMessage, this.props.showMessage].some(i => i === false);
    }
    get textAlign() {
        return Utils.isStringFilter(this.itemConfig.textAlign, this.props.textAlign);
    }
    get isDisabled() {
        return this.props.disabled || this.itemConfig.disabled;
    }
    get showSize() {
        return this.props.size || this.itemConfig.size;
    }
    get label() {
        const { useLabel, label } = this.itemConfig;
        if (useLabel == false || label == undefined)
            return undefined;
        return label + (this.itemConfig.isViewOnly ? ":" : "");
    }
    get coltal() {
        return 24 / (this.props.columnCount || 3);
    }
    get colSpan() {
        return Math.round(((this.itemConfig.col || 1) + (this.itemConfig.offectRight || 0) / 8) * this.coltal);
    }
    get formItemStyle() {
        // trace()
        const { colSpan, itemConfig, showSize: viewSize, textAlign } = this;
        return {
            width: `${(colSpan - (itemConfig.offectRight)) / colSpan * 100}%`,
            height: `${itemConfig.height}`,
            marginBottom: viewSize == "mini" ? 0 : undefined,
            textAlign
        };
    }
    get prefix() {
        return this.itemConfig.prefix;
    }
    get suffix() {
        return this.itemConfig.suffix;
    }
    get useColumn() {
        return this.props.useColumn;
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], DisplayConfig.prototype, "itemConfig", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], DisplayConfig.prototype, "props", void 0);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DisplayConfig.prototype, "init", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "isInlineMessage", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "isShowMessage", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "textAlign", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "isDisabled", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "showSize", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "label", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "coltal", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "colSpan", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "formItemStyle", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "prefix", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "suffix", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DisplayConfig.prototype, "useColumn", null);
exports.DisplayConfig = DisplayConfig;
exports.ValueChangeEventOptions = {
    /**
     * @type {boolean}
     */
    isInit: null,
    /**
     * @type { boolean }
     */
    isComputed: null
};
class ValueChangeEvent {
    /**
     *
     * @param {*} source
     * @param {*} value
     * @param {*} config
     * @param { typeof ValueChangeEventOptions } options
     */
    constructor(source, value, config = {}, options) {
        this.code = config.code;
        this.value = Utils.cloneDeep(value);
        this.config = config,
            this.isInit = options.isInit;
        this.changeSource = options.isComputed ? 'computed' : undefined;
        this.emitSource = source;
    }
}
exports.ValueChangeEvent = ValueChangeEvent;
const util = {
    isValueChange(a, b) {
        return !(_.isEqual(a, b) || (_.isNil(a) && _.isNil(b)));
    },
    isValidRes(res) {
        return (res instanceof Object) && (res.config instanceof Object);
    },
    setChangeSource(changeSource) {
        return function (value) {
            return Object.assign(value, { changeSource: value.changeSource || changeSource });
        };
    }
};
// import { EventStoreInject } from '../../utils/EventEmitter'
// @EventStoreInject(['value-change'])
class FormItemPipe {
    constructor() {
        this.noFormInject = false;
        this.value = null;
        this.loading = true;
        /**
         * @type { ItemConfig }
         */
        this.itemConfig = {};
        mobx_1.reaction(() => this.itemConfig.computed, (computedValue) => {
            this.onDisabledChange();
            return computedValue !== false && this.onComputedChange(computedValue);
        }, { name: 'onComputedValue' });
        mobx_1.reaction(() => this.itemConfig.disabled, this.onDisabledChange, { name: 'onDisabledValue' });
        mobx_1.reaction(() => this.itemConfig.hidden, this.onHiddenChange, { name: 'onHiddenValue' });
    }
    init($itemChange, $configChange, $formInit, $destory) {
        this.$itemChange = $itemChange;
        this.$configChange = $configChange;
        this.$formInit = $formInit;
        this.noFormInject = !Utils.isEventEmitter($destory);
        this.$destory = this.noFormInject ? Utils.getEventEmitter() : $destory;
        // console.log(this)
    }
    destory() {
        this.itemConfig.destory();
        this.$subOptions.unsubscribe();
        this.$subMain.unsubscribe();
        if (this.noFormInject) {
            // console.log('destory emmitter')
            this.$itemChange.dispose();
            this.$configChange.dispose();
            this.$formInit.dispose();
            this.$destory.emit(true);
            this.$destory.dispose();
        }
    }
    get valueInForm() {
        return this.getFormItemValue();
    }
    get defaultValue() {
        return this.getDefaultValue(this.itemConfig);
    }
    get filter() {
        const { filter, type } = this.itemConfig;
        return Utils.isFunctionFilter(filter, CommonFilter_1.default(Utils.isNotEmptyStringFilter(filter, type)).filter);
    }
    get filterToValue() {
        const { filterToValue, type } = this.itemConfig;
        return Utils.isFunctionFilter(filterToValue, CommonFilter_1.default(Utils.isNotEmptyStringFilter(filterToValue, type)).filterToValue);
    }
    get form() {
        return Utils.isObjectFilter(this.itemConfig && this.itemConfig.form, {});
    }
    onDisabledChange() {
        const { label, disabled, cleanOnDisabled } = this.itemConfig;
        // console.log(label, disabled, cleanOnDisabled)
        if (disabled && cleanOnDisabled) {
            return this.onChange(null);
        }
    }
    onHiddenChange() {
        const { label, hidden, cleanOnHidden } = this.itemConfig;
        // console.log(label, hidden, cleanOnHidden)
        if (hidden && cleanOnHidden !== false) {
            return this.onChange(null);
        }
    }
    onChange(value, isInit) {
        const res = this.getOnChangeResponse(value, this.itemConfig, { isInit });
        // debugger
        // console.log('onChange', res, this.itemConfig.label, this.form)
        this.$itemChange.emit(res);
    }
    onComputedChange(value) {
        const res = this.getOnChangeResponse(value, this.itemConfig, { isComputed: true });
        // console.log('onComputedChange', res, this.itemConfig.label, this.form)
        this.$itemChange.emit(res);
    }
    onChangeWith(value, changeCode) {
        const { itemConfig } = this;
        // console.log('changeWith', changeCode, value)
        this.setValueToFormDto(value, changeCode);
        return Utils.isFunction(itemConfig.onChangeWith) && itemConfig.onChangeWith(value);
    }
    /**
     * 需要更新的config code-array
     * @return { Array<string> }
     */
    get referenceCodes() {
        const { code, referenceCodes } = this.itemConfig;
        const validateList = (typeof referenceCodes !== 'string') ? [code] : Utils.zipEmptyData([code, ...referenceCodes.split(',')]);
        return validateList;
    }
    setDto(dto) {
        this.dto = dto;
    }
    setItemConfig(itemConfig = this.itemConfig) {
        if (this.itemConfig !== itemConfig) {
            if (itemConfig instanceof ItemConfig_1.ItemConfig)
                this.itemConfig = itemConfig;
            else {
                this.itemConfig.setConfig(itemConfig);
            }
        }
    }
    setForm(form, source) {
        this.itemConfig.setForm(form);
    }
    /**
     * 校验回调
     * @param {*} callback
     */
    onValidate(callback) {
        this.validate = callback;
    }
    /**
     * 获取Form数据载入时的初始value变更
     * @param { * } form
     */
    getFormInitValueResponse(form) {
        // this.setForm(form)
        const { computed } = this.itemConfig;
        if (!Utils.isNil(computed) && computed !== false && computed !== this.value) {
            return this.getOnChangeResponse(computed, this.itemConfig, { isComputed: true });
        }
        return this.getOnChangeResponse(this.filter(this.defaultValue), this.itemConfig.i, { isInit: true });
    }
    /**
     * ItemConfig更新事件
     * @param { ItemConfig } next
     * @param { boolean } isInit
     */
    getItemConfigChangeResponse(next, isInit) {
        const { code, options } = next;
        return { code, options, emitSource: this, isInit: isInit === true };
    }
    dispatchConfigUpdate(response) {
        const { isInit, emitSource, changeSource } = response;
        // debugger
        return _.forEach(this.referenceCodes, code => this.$configChange.emit({ code, isInit, emitSource: code === this.itemConfig.code ? 'self' : emitSource, form: this.form, changeType: 'valueChange', changeSource }));
    }
    createObservable(callback, callback2) {
        this.$subOptions = rxjs_1.merge(this.$configChange.pipe(
        // 筛选属于自己的更新
        operators_1.filter((_a) => {
            var { code } = _a, other = __rest(_a, ["code"]);
            return this.itemConfig.code === code;
        }), operators_1.tap(this.loadingStart), operators_1.debounceTime(20), operators_1.takeUntil(this.$destory)), rxjs_1.of({ code: this.itemConfig.code, isInit: true, changeType: 'init', changeSource: 'self' })).pipe(operators_1.distinctUntilChanged((pre, next) => {
            return _.isEqual(pre.i, next.i) && next.changeType !== 'valueChange';
        }), operators_1.tap(({ i, emitSource }) => this.setItemConfig(i, emitSource)), 
        // tap(({code, isInit, changeSource, changeType, ...other})=>{
        //   console.log(`config update, ${this.itemConfig.label}/${code}, isInit=${isInit} from ${changeType}->${changeSource}`, other, this.itemConfig)
        // }),
        // filter(({changeType, emitSource}) => changeType!=='valueChange' || (changeType==='valueChange' && emitSource===this)),
        operators_1.map(this.validate), operators_1.takeUntil(this.$destory), operators_1.tap(this.loadingEnd)).subscribe(callback2);
        this.$subMain = rxjs_1.merge(this.$formInit.pipe(
        // filter(form => !_.isEqual(form, this.itemConfig.form)),
        operators_1.tap(form => this.setForm(form)), operators_1.map(this.getFormInitValueResponse), operators_1.map(util.setChangeSource('form')), operators_1.takeUntil(this.$destory)), // 初始值
        this.$itemChange.pipe(operators_1.map(util.setChangeSource('input')), operators_1.takeUntil(this.$destory)) // 值更新事件
        ).pipe(operators_1.filter(util.isValidRes), 
        // map((res) => {
        //   // debugger
        //   const {value, code} = res
        //   if(this.itemConfig.code === code) {
        //     const { computed } = this.itemConfig
        //     if(!Utils.isNil(computed) && computed!==false && computed!==this.value) {
        //       return { ...res, value: computed, changeSource: 'computed'}
        //     } else if (util.isValueChange(value, this.value))
        //       return res
        //   }
        //   return false
        // }),
        operators_1.filter(({ code, value }) => this.itemConfig.code === code && util.isValueChange(value, this.value)), operators_1.takeUntil(this.$destory)).subscribe(res => {
            const { value, code } = res;
            // const { config, isInit, changeSource } = res
            // const { label } = config;
            // const hint = `${this.value} => ${value}`
            // console.log(`${label}/${code} change ${hint} isInit=${isInit}  by ${changeSource}`, this.referenceCodes, this.form)//, this.form, response)
            this.value = value;
            this.value2FormValue(value);
            callback(res);
            this.dispatchConfigUpdate(res);
        });
    }
    loadingStart() {
        this.loading = true;
    }
    loadingEnd() {
        this.loading = false;
        this.itemConfig.updateVersion();
    }
    /**
     * 取得值变更响应事件
     * @param {*} value
     * @param {*} config
     * @param { typeof ValueChangeEventOptions } options
     */
    getOnChangeResponse(value, config = this.itemConfig, { isInit = false, isComputed = false }) {
        return new ValueChangeEvent(this, value, config, { isInit, isComputed });
    }
    value2FormValue(value) {
        if (Utils.isEmptyValue(value)) {
            return this.setValueInForm(null);
        }
        const toValue = this.filterToValue(value);
        if (toValue instanceof Array) {
            this.setValueInForm(toValue.map(i => (i == '' ? null : i)));
        }
        else {
            this.setValueInForm((toValue === null || toValue === '') ? null : toValue);
        }
    }
    setValueInForm(v) {
        const { type, code } = this.itemConfig;
        if (type == 'dateToDate') {
            const [codeA, codeB] = code.split('|') || [null, null];
            const [valueA, valueB] = v || [null, null];
            this.setValueToFormDto(valueA, codeA, true);
            this.setValueToFormDto(valueB, codeB, true);
            // this.setValueToFormDto(v, code, true)
        }
        else {
            this.setValueToFormDto(v, code, true);
        }
        this.itemConfig.onChange && this.itemConfig.onChange(v, this.lastFormValue, this.form, this.itemConfig);
        this.lastFormValue = v;
    }
    setValueToFormDto(value, key = this.itemConfig.code, safe = false) {
        const { dto, form } = this;
        if (dto instanceof CommonDto_js_1.default) {
            return dto.set(key, (!safe || Utils.isNotEmptyValue(value)) ? value : null);
        }
        else if (form) {
            return form[key] = (!safe || Utils.isNotEmptyValue(value)) ? value : null;
        }
    }
    setCustomValidate(type, message) {
        if (Utils.isNotEmptyString(type)) {
            this.errorMessageMap[type] = message;
        }
    }
    /**
     * 从form或dto对象中取值
     * @param { string } code 键值
     */
    getFormItemValue(code = this.itemConfig.code) {
        const formOrDto = this.dto ? this.dto : this.form;
        const { type } = this.itemConfig;
        if (type == 'dateToDate') {
            const [a, b] = this.itemConfig.code.split('|') || [undefined, undefined];
            return [Utils.getDtoOrFormValue(a, formOrDto) || '', Utils.getDtoOrFormValue(b, formOrDto) || ''];
        }
        // code==='submitTime' && console.log(code, _.cloneDeep(formOrDto.export())[code])
        return Utils.getDtoOrFormValue(code, formOrDto);
    }
    /**
     * 获取默认值（表单有合法的值取表单，没有则取配置的默认值）
     * @param { ItemConfig } config
     */
    getDefaultValue({ label, value, type }) {
        // console.log({...this.form}, this.valueInForm)
        // debugger
        // 初始值 
        const initValue = Utils.isEmptyValue(value) ? (type === "checkOne" ? "0" : undefined) : value;
        // 如果表单中的值为非空，取表单，否则取默认值设定
        const notEmptyValue = Utils.isNotEmptyData(this.valueInForm) ? this.valueInForm : initValue;
        const defaultValue = (notEmptyValue === 0 ? "0" : notEmptyValue);
        // console.log(`${label} defaultValue: value/${value}  initValue/${initValue} valueInForm/${this.valueInForm} notEmptyValue/${notEmptyValue} defaultValue/${defaultValue} = ${this.valueInForm} ${Utils.isEmptyValue(value)}`, 
        // this.i)
        return defaultValue;
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], FormItemPipe.prototype, "value", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], FormItemPipe.prototype, "loading", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], FormItemPipe.prototype, "dto", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], FormItemPipe.prototype, "itemConfig", void 0);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "init", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "destory", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "valueInForm", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "defaultValue", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "filter", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "filterToValue", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "form", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onDisabledChange", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onHiddenChange", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onChange", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onComputedChange", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onChangeWith", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], FormItemPipe.prototype, "referenceCodes", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setDto", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setItemConfig", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setForm", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "onValidate", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "getFormInitValueResponse", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "getItemConfigChangeResponse", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "dispatchConfigUpdate", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "createObservable", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "loadingStart", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "loadingEnd", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "getOnChangeResponse", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "value2FormValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setValueInForm", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setValueToFormDto", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "setCustomValidate", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "getFormItemValue", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FormItemPipe.prototype, "getDefaultValue", null);
exports.FormItemPipe = FormItemPipe;
//# sourceMappingURL=FormItemPipe.js.map