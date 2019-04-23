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
/* eslint-disable */
import { merge, of } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap, distinctUntilChanged } from 'rxjs/operators';
// import 'Reflect-metadata';
import { observable, computed, action, reaction } from 'mobx';
import { ItemConfig } from './input-Item/ItemConfig';
import CommonDto from '@/utils/Utils/CommonDto.js';
import getFilter from './input-Item/CommonFilter';
import { autobind } from 'core-decorators';
var DisplayConfig = /** @class */ (function () {
    function DisplayConfig() {
    }
    DisplayConfig.prototype.init = function (itemConfig, props) {
        this.itemConfig = itemConfig;
        this.props = props;
        return this;
    };
    Object.defineProperty(DisplayConfig.prototype, "isInlineMessage", {
        get: function () {
            return this.itemConfig.inline || this.itemConfig.name === this.itemConfig.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "isShowMessage", {
        get: function () {
            return !this.itemConfig.isViewOnly && ![this.itemConfig.showMessage, this.props.showMessage].some(function (i) { return i === false; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "textAlign", {
        get: function () {
            return Utils.isStringFilter(this.itemConfig.textAlign, this.props.textAlign);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "isDisabled", {
        get: function () {
            return this.props.disabled || this.itemConfig.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "showSize", {
        get: function () {
            return this.props.size || this.itemConfig.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "label", {
        get: function () {
            var _a = this.itemConfig, useLabel = _a.useLabel, label = _a.label;
            if (useLabel == false || label == undefined)
                return undefined;
            return label + (this.itemConfig.isViewOnly ? ":" : "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "coltal", {
        get: function () {
            return 24 / (this.props.columnCount || 3);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "colSpan", {
        get: function () {
            return Math.round(((this.itemConfig.col || 1) + (this.itemConfig.offectRight || 0) / 8) * this.coltal);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "formItemStyle", {
        get: function () {
            // trace()
            var _a = this, colSpan = _a.colSpan, itemConfig = _a.itemConfig, viewSize = _a.showSize, textAlign = _a.textAlign;
            return {
                width: (colSpan - (itemConfig.offectRight)) / colSpan * 100 + "%",
                height: "" + itemConfig.height,
                marginBottom: viewSize == "mini" ? 0 : undefined,
                textAlign: textAlign
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "prefix", {
        get: function () {
            return this.itemConfig.prefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "suffix", {
        get: function () {
            return this.itemConfig.suffix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "useColumn", {
        get: function () {
            return this.props.useColumn;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], DisplayConfig.prototype, "itemConfig", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], DisplayConfig.prototype, "props", void 0);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], DisplayConfig.prototype, "init", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isInlineMessage", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isShowMessage", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "textAlign", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isDisabled", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "showSize", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "label", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "coltal", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "colSpan", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "formItemStyle", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "prefix", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "suffix", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "useColumn", null);
    return DisplayConfig;
}());
export { DisplayConfig };
export var ValueChangeEventOptions = {
    /**
     * @type {boolean}
     */
    isInit: null,
    /**
     * @type { boolean }
     */
    isComputed: null
};
var ValueChangeEvent = /** @class */ (function () {
    /**
     *
     * @param {*} source
     * @param {*} value
     * @param {*} config
     * @param { typeof ValueChangeEventOptions } options
     */
    function ValueChangeEvent(source, value, config, options) {
        if (config === void 0) { config = {}; }
        this.code = config.code;
        this.value = Utils.cloneDeep(value);
        this.config = config,
            this.isInit = options.isInit;
        this.changeSource = options.isComputed ? 'computed' : undefined;
        this.emitSource = source;
    }
    return ValueChangeEvent;
}());
export { ValueChangeEvent };
var util = {
    isValueChange: function (a, b) {
        return !(_.isEqual(a, b) || (_.isNil(a) && _.isNil(b)));
    },
    isValidRes: function (res) {
        return (res instanceof Object) && (res.config instanceof Object);
    },
    setChangeSource: function (changeSource) {
        return function (value) {
            return Object.assign(value, { changeSource: value.changeSource || changeSource });
        };
    }
};
// import { EventStoreInject } from '../../utils/EventEmitter'
// @EventStoreInject(['value-change'])
var FormItemPipe = /** @class */ (function () {
    function FormItemPipe() {
        var _this = this;
        this.noFormInject = false;
        this.value = null;
        this.loading = true;
        /**
         * @type { ItemConfig }
         */
        this.itemConfig = {};
        reaction(function () { return _this.itemConfig.computed; }, function (computedValue) {
            _this.onDisabledChange();
            return computedValue !== false && _this.onComputedChange(computedValue);
        }, { name: 'onComputedValue' });
        reaction(function () { return _this.itemConfig.disabled; }, this.onDisabledChange, { name: 'onDisabledValue' });
        reaction(function () { return _this.itemConfig.hidden; }, this.onHiddenChange, { name: 'onHiddenValue' });
    }
    FormItemPipe.prototype.init = function ($itemChange, $configChange, $formInit, $destory) {
        this.$itemChange = $itemChange;
        this.$configChange = $configChange;
        this.$formInit = $formInit;
        this.noFormInject = !Utils.isEventEmitter($destory);
        this.$destory = this.noFormInject ? Utils.getEventEmitter() : $destory;
        // console.log(this)
    };
    FormItemPipe.prototype.destory = function () {
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
    };
    Object.defineProperty(FormItemPipe.prototype, "valueInForm", {
        get: function () {
            return this.getFormItemValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemPipe.prototype, "defaultValue", {
        get: function () {
            return this.getDefaultValue(this.itemConfig);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemPipe.prototype, "filter", {
        get: function () {
            var _a = this.itemConfig, filter = _a.filter, type = _a.type;
            return Utils.isFunctionFilter(filter, getFilter(Utils.isNotEmptyStringFilter(filter, type)).filter);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemPipe.prototype, "filterToValue", {
        get: function () {
            var _a = this.itemConfig, filterToValue = _a.filterToValue, type = _a.type;
            return Utils.isFunctionFilter(filterToValue, getFilter(Utils.isNotEmptyStringFilter(filterToValue, type)).filterToValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemPipe.prototype, "form", {
        get: function () {
            return Utils.isObjectFilter(this.itemConfig && this.itemConfig.form, {});
        },
        enumerable: true,
        configurable: true
    });
    FormItemPipe.prototype.onDisabledChange = function () {
        var _a = this.itemConfig, label = _a.label, disabled = _a.disabled, cleanOnDisabled = _a.cleanOnDisabled;
        // console.log(label, disabled, cleanOnDisabled)
        if (disabled && cleanOnDisabled) {
            return this.onChange(null);
        }
    };
    FormItemPipe.prototype.onHiddenChange = function () {
        var _a = this.itemConfig, label = _a.label, hidden = _a.hidden, cleanOnHidden = _a.cleanOnHidden;
        // console.log(label, hidden, cleanOnHidden)
        if (hidden && cleanOnHidden !== false) {
            return this.onChange(null);
        }
    };
    FormItemPipe.prototype.onChange = function (value, isInit) {
        var res = this.getOnChangeResponse(value, this.itemConfig, { isInit: isInit });
        // debugger
        // console.log('onChange', res, this.itemConfig.label, this.form)
        this.$itemChange.emit(res);
    };
    FormItemPipe.prototype.onComputedChange = function (value) {
        var res = this.getOnChangeResponse(value, this.itemConfig, { isComputed: true });
        // console.log('onComputedChange', res, this.itemConfig.label, this.form)
        this.$itemChange.emit(res);
    };
    FormItemPipe.prototype.onChangeWith = function (value, changeCode) {
        var itemConfig = this.itemConfig;
        // console.log('changeWith', changeCode, value)
        this.setValueToFormDto(value, changeCode);
        return Utils.isFunction(itemConfig.onChangeWith) && itemConfig.onChangeWith(value);
    };
    Object.defineProperty(FormItemPipe.prototype, "referenceCodes", {
        /**
         * 需要更新的config code-array
         * @return { Array<string> }
         */
        get: function () {
            var _a = this.itemConfig, code = _a.code, referenceCodes = _a.referenceCodes;
            var validateList = (typeof referenceCodes !== 'string') ? [code] : Utils.zipEmptyData(__spread([code], referenceCodes.split(',')));
            return validateList;
        },
        enumerable: true,
        configurable: true
    });
    FormItemPipe.prototype.setDto = function (dto) {
        this.dto = dto;
    };
    FormItemPipe.prototype.setItemConfig = function (itemConfig) {
        if (itemConfig === void 0) { itemConfig = this.itemConfig; }
        if (this.itemConfig !== itemConfig) {
            if (itemConfig instanceof ItemConfig)
                this.itemConfig = itemConfig;
            else {
                this.itemConfig.setConfig(itemConfig);
            }
        }
    };
    FormItemPipe.prototype.setForm = function (form, source) {
        this.itemConfig.setForm(form);
    };
    /**
     * 校验回调
     * @param {*} callback
     */
    FormItemPipe.prototype.onValidate = function (callback) {
        this.validate = callback;
    };
    /**
     * 获取Form数据载入时的初始value变更
     * @param { * } form
     */
    FormItemPipe.prototype.getFormInitValueResponse = function (form) {
        // this.setForm(form)
        var computed = this.itemConfig.computed;
        if (!Utils.isNil(computed) && computed !== false && computed !== this.value) {
            return this.getOnChangeResponse(computed, this.itemConfig, { isComputed: true });
        }
        return this.getOnChangeResponse(this.filter(this.defaultValue), this.itemConfig.i, { isInit: true });
    };
    /**
     * ItemConfig更新事件
     * @param { ItemConfig } next
     * @param { boolean } isInit
     */
    FormItemPipe.prototype.getItemConfigChangeResponse = function (next, isInit) {
        var code = next.code, options = next.options;
        return { code: code, options: options, emitSource: this, isInit: isInit === true };
    };
    FormItemPipe.prototype.dispatchConfigUpdate = function (response) {
        var _this = this;
        var isInit = response.isInit, emitSource = response.emitSource, changeSource = response.changeSource;
        // debugger
        return _.forEach(this.referenceCodes, function (code) { return _this.$configChange.emit({ code: code, isInit: isInit, emitSource: code === _this.itemConfig.code ? 'self' : emitSource, form: _this.form, changeType: 'valueChange', changeSource: changeSource }); });
    };
    FormItemPipe.prototype.createObservable = function (callback, callback2) {
        var _this = this;
        this.$subOptions = merge(this.$configChange.pipe(
        // 筛选属于自己的更新
        filter(function (_a) {
            var code = _a.code, other = __rest(_a, ["code"]);
            return _this.itemConfig.code === code;
        }), tap(this.loadingStart), debounceTime(20), takeUntil(this.$destory)), of({ code: this.itemConfig.code, isInit: true, changeType: 'init', changeSource: 'self' })).pipe(distinctUntilChanged(function (pre, next) {
            return _.isEqual(pre.i, next.i) && next.changeType !== 'valueChange';
        }), tap(function (_a) {
            var i = _a.i, emitSource = _a.emitSource;
            return _this.setItemConfig(i, emitSource);
        }), 
        // tap(({code, isInit, changeSource, changeType, ...other})=>{
        //   console.log(`config update, ${this.itemConfig.label}/${code}, isInit=${isInit} from ${changeType}->${changeSource}`, other, this.itemConfig)
        // }),
        // filter(({changeType, emitSource}) => changeType!=='valueChange' || (changeType==='valueChange' && emitSource===this)),
        map(this.validate), takeUntil(this.$destory), tap(this.loadingEnd)).subscribe(callback2);
        this.$subMain = merge(this.$formInit.pipe(
        // filter(form => !_.isEqual(form, this.itemConfig.form)),
        tap(function (form) { return _this.setForm(form); }), map(this.getFormInitValueResponse), map(util.setChangeSource('form')), takeUntil(this.$destory)), // 初始值
        this.$itemChange.pipe(map(util.setChangeSource('input')), takeUntil(this.$destory)) // 值更新事件
        ).pipe(filter(util.isValidRes), 
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
        filter(function (_a) {
            var code = _a.code, value = _a.value;
            return _this.itemConfig.code === code && util.isValueChange(value, _this.value);
        }), takeUntil(this.$destory)).subscribe(function (res) {
            var value = res.value, code = res.code;
            // const { config, isInit, changeSource } = res
            // const { label } = config;
            // const hint = `${this.value} => ${value}`
            // console.log(`${label}/${code} change ${hint} isInit=${isInit}  by ${changeSource}`, this.referenceCodes, this.form)//, this.form, response)
            _this.value = value;
            _this.value2FormValue(value);
            callback(res);
            _this.dispatchConfigUpdate(res);
        });
    };
    FormItemPipe.prototype.loadingStart = function () {
        this.loading = true;
    };
    FormItemPipe.prototype.loadingEnd = function () {
        this.loading = false;
        this.itemConfig.updateVersion();
    };
    /**
     * 取得值变更响应事件
     * @param {*} value
     * @param {*} config
     * @param { typeof ValueChangeEventOptions } options
     */
    FormItemPipe.prototype.getOnChangeResponse = function (value, config, _a) {
        if (config === void 0) { config = this.itemConfig; }
        var _b = _a.isInit, isInit = _b === void 0 ? false : _b, _c = _a.isComputed, isComputed = _c === void 0 ? false : _c;
        return new ValueChangeEvent(this, value, config, { isInit: isInit, isComputed: isComputed });
    };
    FormItemPipe.prototype.value2FormValue = function (value) {
        if (Utils.isEmptyValue(value)) {
            return this.setValueInForm(null);
        }
        var toValue = this.filterToValue(value);
        if (toValue instanceof Array) {
            this.setValueInForm(toValue.map(function (i) { return (i == '' ? null : i); }));
        }
        else {
            this.setValueInForm((toValue === null || toValue === '') ? null : toValue);
        }
    };
    FormItemPipe.prototype.setValueInForm = function (v) {
        var _a = this.itemConfig, type = _a.type, code = _a.code;
        if (type == 'dateToDate') {
            var _b = __read(code.split('|') || [null, null], 2), codeA = _b[0], codeB = _b[1];
            var _c = __read(v || [null, null], 2), valueA = _c[0], valueB = _c[1];
            this.setValueToFormDto(valueA, codeA, true);
            this.setValueToFormDto(valueB, codeB, true);
            // this.setValueToFormDto(v, code, true)
        }
        else {
            this.setValueToFormDto(v, code, true);
        }
        this.itemConfig.onChange && this.itemConfig.onChange(v, this.lastFormValue, this.form, this.itemConfig);
        this.lastFormValue = v;
    };
    FormItemPipe.prototype.setValueToFormDto = function (value, key, safe) {
        if (key === void 0) { key = this.itemConfig.code; }
        if (safe === void 0) { safe = false; }
        var _a = this, dto = _a.dto, form = _a.form;
        if (dto instanceof CommonDto) {
            return dto.set(key, (!safe || Utils.isNotEmptyValue(value)) ? value : null);
        }
        else if (form) {
            return form[key] = (!safe || Utils.isNotEmptyValue(value)) ? value : null;
        }
    };
    FormItemPipe.prototype.setCustomValidate = function (type, message) {
        if (Utils.isNotEmptyString(type)) {
            this.errorMessageMap[type] = message;
        }
    };
    /**
     * 从form或dto对象中取值
     * @param { string } code 键值
     */
    FormItemPipe.prototype.getFormItemValue = function (code) {
        if (code === void 0) { code = this.itemConfig.code; }
        var formOrDto = this.dto ? this.dto : this.form;
        var type = this.itemConfig.type;
        if (type == 'dateToDate') {
            var _a = __read(this.itemConfig.code.split('|') || [undefined, undefined], 2), a = _a[0], b = _a[1];
            return [Utils.getDtoOrFormValue(a, formOrDto) || '', Utils.getDtoOrFormValue(b, formOrDto) || ''];
        }
        // code==='submitTime' && console.log(code, _.cloneDeep(formOrDto.export())[code])
        return Utils.getDtoOrFormValue(code, formOrDto);
    };
    /**
     * 获取默认值（表单有合法的值取表单，没有则取配置的默认值）
     * @param { ItemConfig } config
     */
    FormItemPipe.prototype.getDefaultValue = function (_a) {
        var label = _a.label, value = _a.value, type = _a.type;
        // console.log({...this.form}, this.valueInForm)
        // debugger
        // 初始值 
        var initValue = Utils.isEmptyValue(value) ? (type === "checkOne" ? "0" : undefined) : value;
        // 如果表单中的值为非空，取表单，否则取默认值设定
        var notEmptyValue = Utils.isNotEmptyData(this.valueInForm) ? this.valueInForm : initValue;
        var defaultValue = (notEmptyValue === 0 ? "0" : notEmptyValue);
        // console.log(`${label} defaultValue: value/${value}  initValue/${initValue} valueInForm/${this.valueInForm} notEmptyValue/${notEmptyValue} defaultValue/${defaultValue} = ${this.valueInForm} ${Utils.isEmptyValue(value)}`, 
        // this.i)
        return defaultValue;
    };
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormItemPipe.prototype, "value", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormItemPipe.prototype, "loading", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormItemPipe.prototype, "dto", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormItemPipe.prototype, "itemConfig", void 0);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "init", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "destory", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "valueInForm", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "defaultValue", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "filter", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "filterToValue", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "form", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onDisabledChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onHiddenChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onComputedChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onChangeWith", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], FormItemPipe.prototype, "referenceCodes", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setDto", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setItemConfig", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "onValidate", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "getFormInitValueResponse", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "getItemConfigChangeResponse", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "dispatchConfigUpdate", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "createObservable", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "loadingStart", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "loadingEnd", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "getOnChangeResponse", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "value2FormValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setValueInForm", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setValueToFormDto", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "setCustomValidate", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "getFormItemValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemPipe.prototype, "getDefaultValue", null);
    return FormItemPipe;
}());
export { FormItemPipe };
//# sourceMappingURL=FormItemPipe.js.map