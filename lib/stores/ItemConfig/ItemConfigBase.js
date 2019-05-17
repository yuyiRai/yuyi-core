var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
import { autobind } from 'core-decorators';
import difference from "lodash/difference";
import forEach from "lodash/forEach";
import get from "lodash/get";
import isError from "lodash/isError";
import isRegExp from "lodash/isRegExp";
import map from "lodash/map";
import set from "lodash/set";
import toString from "lodash/toString";
import trim from "lodash/trim";
import { action, computed, extendObservable, isComputedProp, observable, ObservableMap, toJS } from 'mobx';
import { EventEmitter } from '../../utils/EventEmitter';
// import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
import { getDefaultRules } from './input';
import { ItemConfigBaseConfig } from './ItemConfigBaseConfig';
var ItemConfigBase = /** @class */ (function (_super) {
    __extends(ItemConfigBase, _super);
    function ItemConfigBase(initModel, form, componentProps) {
        if (form === void 0) { form = {}; }
        if (componentProps === void 0) { componentProps = {}; }
        var _this = _super.call(this) || this;
        _this.initConfig = observable.map({});
        _this.$version = 0;
        _this.onPropertyChange = new EventEmitter();
        _this.optionsInited = false;
        _this.validateHandler = function (value, strict) {
            if (strict === void 0) { strict = false; }
            return new Promise(function (resolve, reject) {
                var e_1, _a;
                var resultList = [];
                var ruleList = _this.rules.filter(function (rule) { return (rule.strict && strict) || (!rule.strict && !strict); });
                // console.log('validateHandler start', ruleList)
                if ((Utils.isArrayFilter(ruleList) || []).length === 0) {
                    return resolve(true);
                }
                // console.log('validateHandler', ruleList)
                var length = ruleList.length;
                var _loop_1 = function (rule) {
                    if ((rule.strict && strict) || (!rule.strict && !strict)) {
                        var validator = Utils.isFunctionFilter(rule.validator) || (function (a, b, c) { return c(true); });
                        validator(ruleList, value, function (e) {
                            resultList.push(rule);
                            if (isError(e)) {
                                reject(e.message || rule.message);
                            }
                            else if (resultList.length === length) {
                                resolve(true);
                            }
                        });
                    }
                };
                try {
                    for (var ruleList_1 = __values(ruleList), ruleList_1_1 = ruleList_1.next(); !ruleList_1_1.done; ruleList_1_1 = ruleList_1.next()) {
                        var rule = ruleList_1_1.value;
                        _loop_1(rule);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ruleList_1_1 && !ruleList_1_1.done && (_a = ruleList_1.return)) _a.call(ruleList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        };
        /**
         * @type {function}
         */
        _this.onValidateHandler = function () { };
        // this.reaction(() => this.i.options, options => {
        //   console.log('initConfig change', Utils.isArrayFilter(options, this.getComputedValue('options')) || [])
        // })
        // this.observe(this.initConfig, (e: IMapDidChange) => {
        //   console.log('initConfig change', e, this);
        // })
        if (initModel) {
            _this.init(initModel, form, componentProps);
        }
        // this.observe(this.formSource, (e: IPropertyChangeEvent) => {
        //   console.log('initConfig change2', this[e.name], this.baseConfig[e.name], e, this)
        // }
        _this.observe(_this.baseConfigModel.model, function (e) {
            _this.onPropertyChange.emit(e);
            // console.log('initConfig change2', this[e.name], this.baseConfig[e.name], e, this)
            var oldValue = e.oldValue, newValue = e.newValue, name = e.name;
            if (name === 'options' && !Utils.isEqual(oldValue, newValue)) {
                //       this.label === '查勘地点' && console.log(
                //         `${name}: options[${(oldValue || []).length}] => options[${(newValue || []).length}]`, { config: i, event: e }, this.options)
                //       if (newValue) {
                //         this.optionsInited = Utils.isNotEmptyArray(newValue)
                //       }
                _this.$emit('options-change', e.newValue);
            }
            // console.log(`${e.name}: ${e.oldValue} => ${e.newValue}`, {config: i, event: e})
        });
        _this.onPropertyChange.subscribe();
        return _this;
    }
    Object.defineProperty(ItemConfigBase.prototype, "otherKey", {
        // @observable loading = false;
        get: function () {
            return difference(this.baseConfigKeys, this.propertyNameList, ['refConfig', 'code', 'rule', 'remoteMethod', 'loading', 'children', 'options', 'viewOnly', 'isViewOnly', 'transformer', 'computed']);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.registerObservables = function (baseConfig) {
        var e_2, _a;
        var _loop_2 = function (key) {
            var _a;
            // const keyName = _.camelCase("set-"+key)
            if (!isComputedProp(this_1, key)) {
                var thisArg_1 = this_1;
                extendObservable(this_1, (_a = {},
                    Object.defineProperty(_a, key, {
                        get: function () {
                            return thisArg_1.getComputedValue(key, baseConfig);
                        },
                        enumerable: true,
                        configurable: true
                    }),
                    _a), {
                // [keyName]: action.bound
                }, { deep: false });
            }
        };
        var this_1 = this;
        try {
            for (var _b = __values(this.otherKey), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                _loop_2(key);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ItemConfigBase.prototype.setConfig = function (baseConfig, strict) {
        var isChange = this.setBaseConfig(baseConfig, strict);
        isChange && this.registerObservables(baseConfig);
    };
    ItemConfigBase.prototype.init = function (initModel, form, componentProps) {
        if (componentProps === void 0) { componentProps = {}; }
        this.setConfig(initModel);
        this.setForm(form);
        this.componentProps = componentProps;
    };
    Object.defineProperty(ItemConfigBase.prototype, "searchName", {
        get: function () {
            return this.getSearchName();
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.getSearchName = function () {
        var v = get(Utils.cloneDeep(this.formSource), this.nameCode);
        return Utils.isStringFilter(v) || this.currentValue;
    };
    Object.defineProperty(ItemConfigBase.prototype, "currentValue", {
        get: function () {
            var v = this.parentConfig ? get(this.parentConfig.currentComponentValue, this.keyInnerCode) : get(this.formSource || {}, this.code);
            return toJS(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBase.prototype, "remoteMethod", {
        // @observable searchKeyWord;
        // @action.bound setNextSearch(keyWord) {
        //   if (!Utils.likeArray(this.searchKeyWord, keyWord)) {
        //     this.searchKeyWord = keyWord
        //   }
        // }
        get: function () {
            var _this = this;
            if (Utils.isFunction(this.i.remoteMethod)) {
                return function (keyWord, form) { return __awaiter(_this, void 0, void 0, function () {
                    var r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.i.remoteMethod(keyWord, this.form, this)
                                // console.log('remoteSearch get', keyWord, r, this.i.remoteMethod)
                            ];
                            case 1:
                                r = _a.sent();
                                // console.log('remoteSearch get', keyWord, r, this.i.remoteMethod)
                                return [2 /*return*/, r];
                        }
                    });
                }); };
            }
            else if (this.type === 'search') {
                return function (keyWord, form) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.options];
                    });
                }); };
            }
            else {
                return function (keyWord, form) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.options];
                    });
                }); };
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBase.prototype, "remoteOptions", {
        get: function () {
            return this.remoteMethod ? this.remoteSearchBySearchName(this.searchName) : this.options;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.remoteSearchBySearchName = function (keyWordStr) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Utils.isString(keyWordStr)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.remoteSearch(keyWordStr.split(','))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.remoteSearch(keyWordStr)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItemConfigBase.prototype.remoteSearch = function (keyWord) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, remoteMethod, multiple, nextOptions, keyWordArr, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, remoteMethod = _a.remoteMethod, multiple = _a.multiple;
                        nextOptions = [];
                        if (!Utils.isFunction(remoteMethod)) return [3 /*break*/, 7];
                        if (!multiple) return [3 /*break*/, 5];
                        keyWordArr = Utils.zipEmptyData(Utils.castArray(keyWord));
                        if (!(keyWordArr.length > 0)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(map(keyWordArr, function (keyWord) { return __awaiter(_this, void 0, void 0, function () {
                                var data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, remoteMethod(keyWord, this.form)];
                                        case 1:
                                            data = _a.sent();
                                            nextOptions.push.apply(nextOptions, __spread(data));
                                            return [2 /*return*/, data];
                                    }
                                });
                            }); }))]; //.concat([Utils.waitingPromise(100, true)]))
                    case 2:
                        _b.sent(); //.concat([Utils.waitingPromise(100, true)]))
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _b.sent();
                        throw e_3;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, remoteMethod(toString(keyWord))
                        // console.log(this.i.label, 'start search', keyWord, nextOptions)
                        // console.log('resList', keyWord, this.i.label, r)
                    ];
                    case 6:
                        nextOptions = _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, nextOptions];
                }
            });
        });
    };
    Object.defineProperty(ItemConfigBase.prototype, "rule", {
        // searchMethods = (key) => {
        //   const keyArr = _.castArray(key);
        //   if (!Utils.isNil(key) && (keyArr!== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
        //     if (this.itemConfig.allowInput) {
        //       this.setShadowOption(key)
        //     }
        //     this.searchEventEmitter(key)
        //   }
        // }
        get: function () {
            var _a = this, i = _a.i, componentProps = _a.componentProps;
            return this.isViewOnly ? [] : (this.getRuleList(i, componentProps) || []);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.setRule = function (v) {
        if (this.i.rule !== v)
            this.i.rule = v;
    };
    Object.defineProperty(ItemConfigBase.prototype, "allowCreate", {
        get: function () {
            return this.getComputedValue('allowCreate') || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBase.prototype, "allowInput", {
        get: function () {
            return this.getComputedValue('allowInput') || (this.type == 'search' && !this.multiple && this.allowCreate);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.updateVersion = function () {
        this.$version = this.$version + 1;
    };
    /**
     *
     * @param { (code: string, isValid: boolean, errorMsg: string, config: this) => void} callback
     */
    ItemConfigBase.prototype.onValidate = function (callback) {
        if (Utils.isFunction(callback))
            this.onValidateHandler = callback;
    };
    Object.defineProperty(ItemConfigBase.prototype, "requiredRule", {
        get: function () {
            var _this = this;
            var required = this.required;
            if (required) {
                if (Utils.isObject(required) && Utils.isFunction(required.validator)) {
                    var validator = this.required.validator;
                    return Object.assign({}, this.required, { validator: this.shadowRuleRegister(validator) });
                }
                return {
                    required: true,
                    validator: this.shadowRuleRegister(Utils.isFunctionFilter(this.required, function (rule, value, callback) {
                        // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
                        if (Utils.isEmptyData(trim(value)) || (_this.type === 'number' && value == 0)) {
                            return callback(new Error(_this.requiredMessage || "[" + _this.label + "]\u4E0D\u80FD\u4E3A" + (_this.type === 'number' ? '0' : '空') + "\uFF01"));
                        }
                        return callback();
                    })),
                    trigger: this.i.type === 'check' ? 'none' : (this.i.type == 'select' ? 'change' : 'blur') //i.type == 'select' ? 'blur' : 'change'
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.shadowRuleRegister = function (validator) {
        var _this = this;
        return function (rule, value, callback) {
            return validator(rule, value, function (error) {
                if (isError(error) || Utils.isNotEmptyString(error)) {
                    if (!_this.componentProps.$store || !_this.componentProps.$store.state.taskDispatcher.shadowRequired) {
                        return callback(error);
                    }
                    else {
                        // console.log('will catch shadowform error')
                        _this.componentProps.$store.dispatch('catchShadowFormError', Utils.isStringFilter(_this.i.requiredMessage, error.message, error)).then(function () {
                            // console.log('catch shadowform error')
                        });
                    }
                }
                return callback();
            });
        };
    };
    ItemConfigBase.prototype.getRuleList = function (i, componentProps) {
        var iRules = [];
        // if (this.required) {
        if (this.requiredRule) {
            iRules.push(this.requiredRule);
        }
        var ruleGetter = Utils.isFunction(i.rule) ? i.rule(this.form, this) : i.rule;
        if (Utils.isNotEmptyString(ruleGetter)) {
            var _a = __read(ruleGetter.split('|'), 2), ruleName = _a[0], message_1 = _a[1];
            // console.trace(this, this.defaultRule, ruleName, message)
            var defaultRule = Utils.castComputed(this.defaultRule[ruleName], this.form, this);
            var defaultRuleList = Utils.castObjectArray(defaultRule, false);
            var isTrigger_1 = ['change', 'blur', 'none'].includes(message_1);
            if (Utils.isNotEmptyString(message_1)) {
                forEach(defaultRuleList, function (i) {
                    return set(i, isTrigger_1 ? 'trigger' : 'message', message_1);
                });
            }
            iRules.push.apply(iRules, __spread(defaultRuleList));
        }
        else if (Utils.isNotEmptyArray(ruleGetter)) {
            iRules.push.apply(iRules, __spread(ruleGetter));
        }
        else if (isRegExp(ruleGetter)) {
            iRules.push({
                validator: function (rule, value, callback) {
                    return ruleGetter.test(value) ? callback() : callback(new Error());
                },
                message: i.regExpMessage || "\u8BF7\u6B63\u786E\u8F93\u5165" + i.label + "\uFF01",
                trigger: 'blur'
            });
        }
        else if (Utils.isNotEmptyObject(ruleGetter)) {
            iRules.push(ruleGetter);
        }
        if (Utils.isNotEmptyArray(componentProps.rules)) {
            iRules.push.apply(iRules, __spread(componentProps.rules));
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
        if (this.i.type == 'select' || (this.i.type === 'search' && this.strictSearch)) {
            iRules.push({
                validator: this.optionsMatcher,
                trigger: 'change',
                get strict() {
                    return true;
                }
            });
        }
        // i.code === 'planDischargeDate' && console.log('get rule', this, $version, iRules)
        return Utils.isNotEmptyArrayFilter(iRules, undefined);
    };
    ItemConfigBase.prototype.optionsMatcher = function (r, values, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4, _a, options, _b, _c, value;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.allowCreate) return [3 /*break*/, 2];
                        return [4 /*yield*/, Reflect.apply(this.getOptionsSafe, this, [])];
                    case 1:
                        options = _d.sent();
                        try {
                            for (_b = __values(Utils.isStringFilter(values, '').split(',')), _c = _b.next(); !_c.done; _c = _b.next()) {
                                value = _c.value;
                                if (Utils.isNotEmptyValue(value) && (Utils.isArrayFilter(Utils.getOptionsByValue(options, value)) || []).length === 0) {
                                    console.error(this.label, '选择项匹配失败，请重新选择！', options, this.form, values, this);
                                    return [2 /*return*/, callback(new Error("[" + this.label + "]\u6570\u636E\u5F02\u5E38\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u9009\u62E9\uFF01"))];
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        _d.label = 2;
                    case 2: 
                    // console.log(this.label, '选择项匹配成功！', options, this.form, values, this)
                    return [2 /*return*/, callback()];
                }
            });
        });
    };
    ItemConfigBase.prototype.getOptionsSafe = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.type === 'search' && (this.options.length === 0 || !this.optionsInited))) return [3 /*break*/, 3];
                        if (!!Utils.isArrayFilter(this.remoteOptions)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.remoteOptions
                            // console.log('safe end', this.label, this.searchName, options)
                        ];
                    case 1:
                        options = _a.sent();
                        // console.log('safe end', this.label, this.searchName, options)
                        return [2 /*return*/, options];
                    case 2: 
                    // console.log('get remote', this.label, this.searchName, this.remoteOptions)
                    return [2 /*return*/, this.remoteOptions];
                    case 3: return [2 /*return*/, this.options];
                }
            });
        });
    };
    Object.defineProperty(ItemConfigBase.prototype, "defaultRule", {
        get: function () {
            return Object.assign(ItemConfigBase.getDefaultRules(this, this.componentProps), getDefaultRules(this));
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.getDefaultRules = function (itemConfig, configStore) {
        return {
            phone: {
                validator: function (rule, value, callback) {
                    // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
                    // console.log('check', value)
                    // console.log(rule, value, l,a, this.itemPipe.itemConfig.rule)
                    if (Utils.isEmptyValue(value)) {
                        return callback();
                    }
                    var reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
                    if (!reg.test(value + "")) {
                        // console.log()
                        return callback(new Error('请输入正确的手机号！'));
                    }
                    return callback();
                },
                // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                trigger: 'blur',
                message: '请录入正确的手机号！'
            },
            'chejiahao': [{
                    validator: function (rule, value, callback) {
                        if (Utils.isEmptyValue(value)) {
                            return callback();
                        }
                        if (Utils.isString(value) && value.length === 17) {
                            return callback(new Error());
                        }
                        return callback();
                    },
                    // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    trigger: 'blur',
                    message: '车架号只允许17位'
                }],
            plusOnly: function (form, config) { return [{
                    validator: function ($, value, callback) {
                        // console.log(v,b)
                        if (Utils.isNotEmptyValue(value) && (Utils.isNumberFilter(parseFloat(value)) || 0) <= 0) {
                            return callback(new Error());
                        }
                        return callback();
                    },
                    tirgger: 'change',
                    message: config.label + "\u5FC5\u987B\u5927\u4E8E0\uFF01"
                }]; },
            licanseNo: function (form, config) { return [{
                    validator: function (rule, value, callback) {
                        // console.log('licenseNo', value)
                        if (Utils.isNotEmptyString(value)) {
                            if (trim(value) === '*' || value.indexOf('新车') > -1 || (itemConfig.code !== 'licanseNo' && value === '车外')) {
                                return callback();
                            }
                            else {
                                var selected = Utils.getOptionsByValue(get(configStore, '$store.state.taskDispatcher.licenseTypeList'), form.licenseType);
                                // console.log(form.licenseType, selected)
                                var res = (selected && !/警|军队|其它/ig.test(selected.label))
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
                }]; },
            idCard: [{
                    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    trigger: 'blur',
                    message: '请录入正确的身份证号！'
                }],
            commonCode: [{
                    pattern: /(^([a-zA-z0-9].*)$)/,
                    trigger: 'blur',
                    message: "\u8BF7\u5F55\u5165\u6B63\u786E\u7684[" + itemConfig.label + "]\uFF01"
                }]
        };
    };
    __decorate([
        observable,
        __metadata("design:type", ObservableMap)
    ], ItemConfigBase.prototype, "initConfig", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfigBase.prototype, "$version", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "otherKey", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "registerObservables", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "setConfig", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "init", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "searchName", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "getSearchName", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "currentValue", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "remoteMethod", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ItemConfigBase.prototype, "remoteSearchBySearchName", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], ItemConfigBase.prototype, "remoteSearch", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "rule", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "setRule", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "allowCreate", null);
    __decorate([
        computed,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "allowInput", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "updateVersion", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "requiredRule", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "shadowRuleRegister", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Array)
    ], ItemConfigBase.prototype, "getRuleList", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], ItemConfigBase.prototype, "optionsMatcher", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ItemConfigBase.prototype, "getOptionsSafe", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBase.prototype, "defaultRule", null);
    return ItemConfigBase;
}(ItemConfigBaseConfig));
export { ItemConfigBase };
//# sourceMappingURL=ItemConfigBase.js.map