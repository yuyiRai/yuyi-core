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
Object.defineProperty(exports, "__esModule", { value: true });
var ItemConfig_1;
/* eslint-disable */
const core_decorators_1 = require("core-decorators");
const lodash_1 = require("lodash");
const mobx_1 = require("mobx");
const EventStore_1 = require("../../utils/EventStore");
const AsyncProperty_1 = require("../../utils/AsyncProperty");
const Utils_1 = require("../../utils/Utils");
const FormItemPipe_1 = require("../../components/FormPage/FormItemPipe");
const DatePickerItem_js_1 = require("../../components/FormPage/input-Item/DatePickerItem.js");
let ItemConfig = ItemConfig_1 = class ItemConfig {
    constructor(initModel, form, componentProps) {
        this.destorySet = new Set();
        this.i = {};
        this.iKeys = [];
        this.componentProps = {};
        this.initConfig = mobx_1.observable.map({});
        this.$version = 0;
        // @observable loading = false;
        this.displayConfig = new FormItemPipe_1.DisplayConfig();
        this.optionsInited = false;
        this.validateHandler = (value) => {
            return new Promise((resolve, reject) => {
                const resultList = [];
                if ((Utils_1.Utils.isArrayFilter(this.rule) || []).length === 0) {
                    return resolve(true);
                }
                if (this.rule) {
                    const length = this.rule.length;
                    for (const rule of this.rule) {
                        const validator = Utils_1.Utils.isFunctionFilter(rule.validator) || ((a, b, c) => c(true));
                        validator(this.rule, value, (e) => {
                            resultList.push(rule);
                            if (lodash_1.isError(e)) {
                                reject(e.message || rule.message);
                            }
                            else if (resultList.length === length) {
                                resolve(true);
                            }
                        });
                    }
                }
            });
        };
        /**
         * @type {function}
         */
        this.onValidateHandler = () => { };
        // this.reaction(()=>this.remoteOptions, options=>{
        //   console.log('remoteOptions change', this.i.label, options, this)
        // })
        // this.reaction(() => this.loading, options=>{
        //   console.log('loading change', this.i.label, options)
        // })
        this.reaction(() => this.i, (i) => {
            // console.log('register', i)
            for (const name of ['loading', 'options']) {
                this.registerKey(i, name);
            }
            mobx_1.observe(i, (e) => {
                this.$version++;
                // console.log(e)
                if (e.name === '$$core_options') {
                    // console.log(`${e.name}: ${e.oldValue} => ${e.newValue}`, {config: i, event: e})
                    this.$emit('options-change', e.newValue);
                }
                // console.log(`${e.name}: ${e.oldValue} => ${e.newValue}`, {config: i, event: e})
            });
            this.$emit('options-change', this.options);
            // this.reaction(() => i.loading, value => {
            //   // this.loading = value
            //   console.log('i loading change', this.i.label, value)
            // }, { fireImmediately: true })
            this.registerObservables(i);
        }, { fireImmediately: true });
        if (initModel) {
            this.init(initModel, form, componentProps);
        }
    }
    get displayProps() {
        return this.displayConfig.init(this, this.componentProps);
    }
    get isViewOnly() {
        // console.log(this.props)
        return this.viewOnly || (this.componentProps && (this.componentProps.viewOnly || this.componentProps.formStatus === 'view'));
    }
    get otherKey() {
        return lodash_1.difference(this.iKeys, lodash_1.keys(this), ['refConfig', 'code', 'label', 'required', 'hidden', 'rule', 'remoteMethod', 'loading', 'options', 'isViewOnly']);
    }
    reaction(source, callback, options) {
        this.destorySet.add(mobx_1.reaction(source, callback, options));
    }
    registerObservables(baseConfig) {
        for (const key of this.otherKey) {
            // const keyName = _.camelCase("set-"+key)
            if (!mobx_1.isComputedProp(this, key)) {
                const thisArg = this;
                mobx_1.extendObservable(this, {
                    get [key]() {
                        return Utils_1.Utils.isNumber(thisArg.$version) && thisArg.getComputedValue(key, baseConfig);
                    },
                }, {
                // [keyName]: action.bound
                }, { deep: false });
            }
        }
    }
    registerKey(i, key) {
        const defaultV = i[key];
        const coreKey = `$$core_${key}`;
        mobx_1.observable.ref(i, coreKey, {
            value: defaultV,
            enumerable: false,
            configurable: true
        });
        mobx_1.computed(i, key, {
            get() {
                return (this[coreKey]);
            },
            set(value) {
                this[coreKey] = value;
            }
        });
        // set(this.i, key, defaultV)
        // extendObservable(, {
        //   [key]: defaultV
        // }, {}, { deep: false })
    }
    setForm(form) {
        // if(form instanceof FormStore){
        //   this.formStore = form
        // } else if(form){
        //   const getter = FormStore.registerForm(form)
        //   if(!this.formStore || this.getter !== this.formStore)
        //     this.formStore = getter
        //   else 
        //     this.formStore.setForm(form)
        // }
        this.form = form;
    }
    setConfig(next) {
        if (Utils_1.Utils.isEqual(this.i, next))
            this.registerObservables(this.i);
        else {
            this.iKeys = Object.keys(next);
            this.registerObservables(Object.assign({}, next));
            this.i = next;
            this.optionsInited = false;
            if (Utils_1.Utils.isFunction(next.refConfig)) {
                Reflect.apply(next.refConfig, this, [this]);
            }
        }
    }
    init(initModel, form, componentProps = {}) {
        this.setConfig(initModel || {});
        this.setForm(form);
        this.componentProps = componentProps;
    }
    getComputedValue(key, target = this.i, defaultValue) {
        const keyValue = target[key]; //(action(Utils.getPropertyFieldByCreate))(this.i, [key, defaultValue])
        // if(keyValue !== this.i[key]) {
        //   this.updateVersion()
        // }
        if (!(/(^refConfig$)|^(on|get(.*?))|((.*?)Method)$|(.*?)filter(.*?)/.test(key)) && (keyValue instanceof Function)) {
            const computedValue = keyValue(this.form || {}, this);
            return Utils_1.Utils.isNil(computedValue) ? defaultValue : computedValue;
        }
        return keyValue;
    }
    /**
     * 是否控制必录
     */
    get required() {
        return this.$version > -1 && this.getComputedValue('required');
    }
    /**
     * 是否
     */
    get hidden() {
        return Utils_1.Utils.isNumber(this.$version) && this.getComputedValue('hidden');
    }
    get label() {
        return this.getComputedValue('label');
    }
    get type() {
        return this.i.type;
    }
    get code() {
        return this.i.code;
    }
    get nameCode() {
        return this.i.nameCode;
    }
    get searchName() {
        return this.getSearchName();
    }
    getSearchName() {
        const { nameCode } = this;
        return !lodash_1.isNil(nameCode) ? (this.form || {})[nameCode] : (this.form || {})[this.code];
    }
    get currentValue() {
        return (this.form || {})[this.code];
    }
    // @observable searchKeyWord;
    // @action.bound setNextSearch(keyWord) {
    //   if (!Utils.likeArray(this.searchKeyWord, keyWord)) {
    //     this.searchKeyWord = keyWord
    //   }
    // }
    get remoteMethod() {
        if (Utils_1.Utils.isFunction(this.i.remoteMethod)) {
            return (keyWord, form) => __awaiter(this, void 0, void 0, function* () {
                const r = yield this.i.remoteMethod(keyWord, this.form, this);
                return r;
            });
        }
        return function () { };
    }
    get remoteOptions() {
        return this.remoteMethod ? this.remoteSearchBySearchName(this.searchName) : [];
    }
    remoteSearchBySearchName(keyWordStr) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Utils_1.Utils.isString(keyWordStr)) {
                return yield this.remoteSearch(keyWordStr.split(','));
            }
            return yield this.remoteSearch(keyWordStr);
        });
    }
    remoteSearch(keyWord) {
        return __awaiter(this, void 0, void 0, function* () {
            const { remoteMethod, multiple } = this;
            let nextOptions = [];
            if (Utils_1.Utils.isFunction(remoteMethod)) {
                this.setLoading(true);
                if (multiple) {
                    if (Utils_1.Utils.isString(keyWord)) {
                        keyWord = keyWord.split(',');
                    }
                    const keyWordArr = Utils_1.Utils.zipEmptyData(Utils_1.Utils.castArray(keyWord));
                    if (keyWordArr.length > 0) {
                        yield Promise.all(lodash_1.map(keyWordArr, (keyWord) => __awaiter(this, void 0, void 0, function* () {
                            // console.log('keyWord', keyWord)
                            try {
                                const data = yield remoteMethod(keyWord, this.form);
                                Utils_1.Utils.arrayPush(nextOptions, data);
                                return data;
                            }
                            catch (e) {
                                Utils_1.Utils.$message.error(e.message || e);
                            }
                            return false;
                        }))); //.concat([Utils.waitingPromise(100, true)]))
                        // console.log('resList', keyWordArr, this.i.label, resList)
                        this.optionsInited = Utils_1.Utils.isNotEmptyArray(nextOptions);
                    }
                }
                else {
                    nextOptions = yield remoteMethod(lodash_1.toString(keyWord));
                    // console.log(this.i.label, 'start search', keyWord, nextOptions)
                    this.optionsInited = Utils_1.Utils.isNotEmptyArray(nextOptions);
                    // console.log('resList', keyWord, this.i.label, r)
                }
                this.setLoading(false);
            }
            this.optionsInited = true;
            return nextOptions;
        });
    }
    // searchMethods = (key) => {
    //   const keyArr = _.castArray(key);
    //   if (!Utils.isNil(key) && (keyArr!== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
    //     if (this.itemConfig.allowInput) {
    //       this.setShadowOption(key)
    //     }
    //     this.searchEventEmitter(key)
    //   }
    // }
    get rule() {
        const { i, componentProps: componentProps } = this;
        return this.isViewOnly ? [] : this.getRuleList(i, componentProps);
    }
    setRule(v) {
        if (this.i.rule !== v)
            this.i.rule = v;
    }
    get loading() {
        return this.i.loading;
    }
    setLoading(v) {
        // console.error('setLoading', v)
        this.i.loading = v;
        // this.updateVersion()
    }
    /**
     * @type { Array } 配置项Array
     */
    get options() {
        // trace()
        // this.label==='伤者类型' && console.log('伤者类型 get options', Utils.isArrayFilter(this.$version, this.getComputedValue('options'), []))
        return Utils_1.Utils.isArrayFilter(this.$version, this.i.options, this.getComputedValue('options')) || [];
    }
    setOptions(v) {
        if (!Utils_1.Utils.likeArray(this.i.options, v)) {
            // console.log('设置Option', this.i.label, v)
            this.i.options = v;
            this.updateVersion();
            // console.log('setOptions', v)
            this.$emit('options-change', this.i.options);
        }
    }
    updateVersion() {
        this.$version = this.$version + 1;
    }
    export() {
        const model = {};
        for (const key in this.i) {
            model[key] = this.getComputedValue(key);
        }
        return model;
    }
    /**
     *
     * @param { (code: string, isValid: boolean, errorMsg: string, config: this) => void} callback
     */
    onValidate(callback) {
        if (Utils_1.Utils.isFunction(callback))
            this.onValidateHandler = callback;
    }
    destory() {
        for (const destory of this.destorySet) {
            destory();
        }
        this.destorySet.clear();
    }
    get requiredRule() {
        const { required } = this;
        if (required) {
            if (Utils_1.Utils.isObject(required) && Utils_1.Utils.isFunction(required.validator)) {
                const { validator } = this.required;
                return Object.assign({}, this.required, { validator: this.shadowRuleRegister(validator) });
            }
            return {
                required: true,
                validator: this.shadowRuleRegister(Utils_1.Utils.isFunctionFilter(this.required, (rule, value, callback) => {
                    // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
                    if (Utils_1.Utils.isEmptyData(lodash_1.trim(value)) || (this.type === 'number' && value == 0)) {
                        return callback(new Error(this.requiredMessage || `[${this.label}]不能为${this.type === 'number' ? '0' : '空'}！`));
                    }
                    return callback();
                })),
                trigger: this.i.type === 'check' ? 'none' : (this.i.type == 'select' ? 'change' : 'blur') //i.type == 'select' ? 'blur' : 'change'
            };
        }
    }
    shadowRuleRegister(validator) {
        return (rule, value, callback) => {
            return validator(rule, value, (error) => {
                if (lodash_1.isError(error) || Utils_1.Utils.isNotEmptyString(error)) {
                    if (!this.componentProps.$store || !this.componentProps.$store.state.taskDispatcher.shadowRequired) {
                        return callback(error);
                    }
                    else {
                        // console.log('will catch shadowform error')
                        this.componentProps.$store.dispatch('catchShadowFormError', Utils_1.Utils.isStringFilter(this.i.requiredMessage, error.message, error)).then(() => {
                            // console.log('catch shadowform error')
                        });
                    }
                }
                return callback();
            });
        };
    }
    getRuleList(i, componentProps) {
        const iRules = [];
        // if (this.required) {
        if (Utils_1.Utils.isNumber(this.$version) && this.requiredRule) {
            iRules.push(this.requiredRule);
        }
        let ruleGetter = Utils_1.Utils.isFunction(i.rule) ? i.rule(this.form, this) : i.rule;
        if (Utils_1.Utils.isNotEmptyString(ruleGetter)) {
            const [ruleName, message] = ruleGetter.split('|');
            // console.trace(this, this.defaultRule, ruleName, message)
            const defaultRule = Utils_1.Utils.castComputed(this.defaultRule[ruleName], this.form, this);
            const defaultRuleList = Utils_1.Utils.castObjectArray(defaultRule, false);
            const isTrigger = ['change', 'blur', 'none'].includes(message);
            if (Utils_1.Utils.isNotEmptyString(message)) {
                lodash_1.forEach(defaultRuleList, i => lodash_1.set(i, isTrigger ? 'trigger' : 'message', message));
            }
            iRules.push(...defaultRuleList);
        }
        else if (Utils_1.Utils.isNotEmptyArray(ruleGetter)) {
            iRules.push(...ruleGetter);
        }
        else if (lodash_1.isRegExp(ruleGetter)) {
            iRules.push({
                validator(rule, value, callback) {
                    return ruleGetter.test(value) ? callback() : callback(new Error());
                },
                message: i.regExpMessage || `请正确输入${i.label}！`,
                trigger: 'blur'
            });
        }
        else if (Utils_1.Utils.isNotEmptyObject(ruleGetter)) {
            iRules.push(ruleGetter);
        }
        if (Utils_1.Utils.isNotEmptyArray(componentProps.rules)) {
            iRules.push(...componentProps.rules);
        }
        // _.forEach(iRules, config => {
        //   const { validator, required } = config
        //   if(_.isFunction(validator) && required)
        //     config.validator = this.shadowRuleRegister(validator)
        // })
        // iRules.forEach(config=>{
        //   const { validator, message } = config
        //   config.nativeValidator = validator;
        //   if(_.isFunction(validator))
        //     config.validator = (r, values, callback) => {
        //       validator(r, values, (e) => {
        //         if(!this.hidden && (!this.componentProps.$store || !this.componentProps.$store.state.taskDispatcher.shadowRequired) && _.isError(e)) {
        //           // Utils.$message.error(e.message || message)
        //           // console.log(this.code, e, config)
        //           this.onValidateHandler(this.code, false, e.message || message, this, config)
        //         } else {
        //           this.onValidateHandler(this.code, true, null, this, config)
        //         }
        //         Reflect.apply(callback, this, [e])
        //       })
        //     }
        // })
        if (['select', 'search'].includes(this.i.type)) {
            iRules.push({
                validator: this.optionsMatcher,
                trigger: 'change'
            });
        }
        // i.code === 'planDischargeDate' && console.log('get rule', this, $version, iRules)
        return Utils_1.Utils.isNotEmptyArrayFilter(iRules, undefined);
    }
    optionsMatcher(r, values, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptionsSafe();
            for (const value of values.split(',')) {
                if (Utils_1.Utils.isNotEmptyValue(value) && (Utils_1.Utils.isArrayFilter(Utils_1.Utils.getOptionsByValue(options, value)) || []).length === 0) {
                    // console.error(this.label, '选择项匹配失败，请重新选择！', options, this.form, values, this)
                    return callback(new Error(`[${this.label}]数据异常，请重新输入选择！`));
                }
            }
            // console.log(this.label, '选择项匹配成功！', options, this.form, values, this)
            return callback();
        });
    }
    getOptionsSafe() {
        if (this.type === 'search' && (this.options.length === 0 || !this.optionsInited)) {
            return this.remoteOptions || new Promise(r => {
                console.log('safe start', this.label, this.remoteOptions, this.options);
                const b = mobx_1.reaction(() => this.remoteOptions, options => {
                    r(options);
                    console.log('safe end', this.label, options);
                    // this.setOptions(options)
                    b();
                });
            });
        }
        return this.options;
    }
    get defaultRule() {
        return this.$version > -1 && Object.assign(ItemConfig_1.getDefaultRules(this, this.componentProps.$store.state.taskDispatcher), DatePickerItem_js_1.getDefaultRules(this));
    }
    static getDefaultRules(itemConfig, configStore) {
        return {
            phone: [{
                    validator: (rule, value, callback) => {
                        // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
                        // console.log('check', value)
                        // console.log(rule, value, l,a, this.itemPipe.itemConfig.rule)
                        if (Utils_1.Utils.isEmptyValue(value)) {
                            return callback();
                        }
                        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
                        if (!reg.test(value + "")) {
                            // console.log()
                            return callback(new Error('请输入正确的手机号！'));
                        }
                        return callback();
                    },
                    // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    trigger: 'blur',
                    message: '请录入正确的手机号！'
                }],
            'chejiahao': [{
                    validator: (rule, value, callback) => {
                        if (Utils_1.Utils.isEmptyValue(value)) {
                            return callback();
                        }
                        if (Utils_1.Utils.isString(value) && value.length === 17) {
                            return callback(new Error());
                        }
                        return callback();
                    },
                    // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    trigger: 'blur',
                    message: '车架号只允许17位'
                }],
            plusOnly: (form, config) => [{
                    validator($, value, callback) {
                        // console.log(v,b)
                        if (Utils_1.Utils.isNotEmptyValue(value) && (Utils_1.Utils.isNumberFilter(parseFloat(value)) || 0) <= 0) {
                            return callback(new Error());
                        }
                        return callback();
                    },
                    tirgger: 'change',
                    message: `${config.label}必须大于0！`
                }],
            licanseNo: (form, config) => [{
                    validator: (rule, value, callback) => {
                        // console.log('licenseNo', value)
                        if (Utils_1.Utils.isNotEmptyString(value)) {
                            if (lodash_1.trim(value) === '*' || value.indexOf('新车') > -1 || (itemConfig.code !== 'licanseNo' && value === '车外')) {
                                return callback();
                            }
                            else {
                                const selected = Utils_1.Utils.getOptionsByValue(configStore.licenseTypeList, form.licenseType);
                                // console.log(form.licenseType, selected)
                                const res = (selected && !/警|军队|其它/ig.test(selected.label))
                                    ? /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/
                                    : /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/;
                                if (res.test(value)) {
                                    return callback();
                                }
                                else
                                    return callback(new Error());
                            }
                        }
                        return callback();
                    },
                    trigger: 'blur',
                    message: '请录入正确的车牌号！'
                }],
            idCard: [{
                    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    trigger: 'blur',
                    message: '请录入正确的身份证号！'
                }],
            commonCode: [{
                    pattern: /(^([a-zA-z0-9].*)$)/,
                    trigger: 'blur',
                    message: `请录入正确的[${itemConfig.label}]！`
                }]
        };
    }
};
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], ItemConfig.prototype, "i", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Array)
], ItemConfig.prototype, "iKeys", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], ItemConfig.prototype, "form", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], ItemConfig.prototype, "componentProps", void 0);
__decorate([
    mobx_1.observable.shallow,
    __metadata("design:type", Object)
], ItemConfig.prototype, "initConfig", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], ItemConfig.prototype, "$version", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], ItemConfig.prototype, "displayConfig", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "displayProps", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "isViewOnly", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "otherKey", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function, Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "reaction", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "registerObservables", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "registerKey", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "setForm", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "setConfig", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "init", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "getComputedValue", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "required", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "hidden", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "label", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "type", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "code", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "nameCode", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "searchName", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "getSearchName", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "currentValue", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "remoteMethod", null);
__decorate([
    AsyncProperty_1.asyncComputed({
        type: Array,
        defaultValue: [],
        time: 100,
        watcher: 'searchName',
        resetFrom: 'form'
    }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "remoteOptions", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemConfig.prototype, "remoteSearchBySearchName", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ItemConfig.prototype, "remoteSearch", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "rule", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "setRule", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "loading", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "setLoading", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "options", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "setOptions", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "updateVersion", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "requiredRule", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "shadowRuleRegister", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Array)
], ItemConfig.prototype, "getRuleList", null);
__decorate([
    Utils_1.Utils.timebuffer(0),
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ItemConfig.prototype, "optionsMatcher", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ItemConfig.prototype, "getOptionsSafe", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ItemConfig.prototype, "defaultRule", null);
ItemConfig = ItemConfig_1 = __decorate([
    EventStore_1.EventStoreInject(['options-change']),
    __metadata("design:paramtypes", [Object, Object, Object])
], ItemConfig);
exports.ItemConfig = ItemConfig;
//# sourceMappingURL=ItemConfig.js.map