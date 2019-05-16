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
import { autobind } from 'core-decorators';
import forEach from "lodash/forEach";
import isError from "lodash/isError";
import isRegExp from "lodash/isRegExp";
import set from "lodash/set";
import trim from "lodash/trim";
import { computed, observable } from "mobx";
// import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
import { getDefaultRules } from './input/Date';
import { CommonStore } from "./interface/CommonStore";
var RuleStore = /** @class */ (function (_super) {
    __extends(RuleStore, _super);
    function RuleStore(itemConfig) {
        var _this = _super.call(this) || this;
        _this.itemConfig = itemConfig;
        return _this;
    }
    Object.defineProperty(RuleStore.prototype, "requiredRule", {
        get: function () {
            var itemConfig = this.itemConfig;
            var required = itemConfig.required;
            if (required) {
                if (Utils.isObject(required) && Utils.isFunction(required.validator)) {
                    var validator_1 = itemConfig.required.validator;
                    return Object.assign({}, itemConfig.required, { validator: this.shadowRuleRegister(validator_1) });
                }
                var validator = Utils.isFunctionFilter(itemConfig.required, function (_, value, callback) {
                    // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
                    if (Utils.isEmptyData(trim(value + '')) || (itemConfig.type === 'number' && value == 0)) {
                        callback(new Error(itemConfig.requiredMessage || "[" + itemConfig.label + "]\u4E0D\u80FD\u4E3A" + (itemConfig.type === 'number' ? '0' : '空') + "\uFF01"));
                        return;
                    }
                    callback();
                });
                return {
                    required: true,
                    validator: this.shadowRuleRegister(validator),
                    trigger: itemConfig.type === 'check' ? 'none' : (itemConfig.type == 'select' ? 'change' : 'blur') //i.type == 'select' ? 'blur' : 'change'
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    RuleStore.prototype.shadowRuleRegister = function (validator) {
        // const { componentProps } = this.itemConfig
        return function (rule, value, callback) {
            return validator(rule, value, function (error) {
                if (isError(error) || Utils.isNotEmptyString(error)) {
                    // if (!componentProps.$store || !componentProps.$store.state.taskDispatcher.shadowRequired) {
                    return callback(error);
                    // } else {
                    //   // console.log('will catch shadowform error')
                    //   componentProps.$store.dispatch('catchShadowFormError', Utils.isStringFilter(this.itemConfig.requiredMessage, error.message, error)).then(() => {
                    //     // console.log('catch shadowform error')
                    //   })
                    // }
                }
                return callback();
            });
        };
    };
    RuleStore.prototype.getRuleList = function (i) {
        var iRules = [];
        // if (this.required) {
        if (this.requiredRule) {
            iRules.push(this.requiredRule);
        }
        var ruleGetter = Utils.isFunction(i.rule) ? i.rule(this.itemConfig.formSource, this) : i.rule;
        if (Utils.isNotEmptyString(ruleGetter)) {
            var _a = __read(ruleGetter.split('|'), 2), ruleName = _a[0], message_1 = _a[1];
            // console.trace(this, this.defaultRule, ruleName, message)
            var defaultRule = Utils.castComputed(this.defaultRule[ruleName], this.itemConfig.formSource, this);
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
        if (this.itemConfig.type == 'select' || this.itemConfig.type === 'search') {
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
    RuleStore.prototype.optionsMatcher = function (r, values, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, options, _b, _c, value;
            return __generator(this, function (_d) {
                if (!this.itemConfig.allowCreate) {
                    options = this.itemConfig.options || [];
                    try {
                        for (_b = __values(Utils.isStringFilter(values, '').split(',')), _c = _b.next(); !_c.done; _c = _b.next()) {
                            value = _c.value;
                            if (Utils.isNotEmptyValue(value) && (Utils.isArrayFilter(Utils.getOptionsByValue(options, value)) || []).length === 0) {
                                console.error(this.itemConfig.label, '选择项匹配失败，请重新选择！', options, this.itemConfig.formSource, values, this);
                                return [2 /*return*/, callback(new Error("[" + this.itemConfig.label + "]\u6570\u636E\u5F02\u5E38\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u9009\u62E9\uFF01"))];
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                // console.log(this.label, '选择项匹配成功！', options, this.form, values, this)
                return [2 /*return*/, callback()];
            });
        });
    };
    Object.defineProperty(RuleStore.prototype, "defaultRule", {
        get: function () {
            return Object.assign(RuleStore.getDefaultRules(this.itemConfig), getDefaultRules(this.itemConfig));
        },
        enumerable: true,
        configurable: true
    });
    RuleStore.getDefaultRules = function (itemConfig) {
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
                    validator: function (rule, value, callback) {
                        // console.log(v,b)
                        if (Utils.isNotEmptyValue(value) && (Utils.isNumberFilter(parseFloat(value + '')) || 0) <= 0) {
                            return callback(new Error());
                        }
                        return callback();
                    },
                    tirgger: 'change',
                    message: config.label + "\u5FC5\u987B\u5927\u4E8E0\uFF01"
                }]; },
            // licanseNo: (form: { licenseType: any; }, config: any) => [{
            //   validator: (rule: any, value: string, callback: { (): void; (): void; (arg0: Error): void; (): void; }) => {
            //     // console.log('licenseNo', value)
            //     if (Utils.isNotEmptyString(value)) {
            //       if (trim(value) === '*' || value.indexOf('新车') > -1 || (itemConfig.code !== 'licanseNo' && value === '车外')) {
            //         return callback()
            //       } else {
            //         const selected: Option = Utils.getOptionsByValue(get(configStore, '$store.state.taskDispatcher.licenseTypeList'), form.licenseType)
            //         // console.log(form.licenseType, selected)
            //         const res = (selected && !/警|军队|其它/ig.test(selected.label as string))
            //           ? /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/
            //           : /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/;
            //         if (res.test(value)) {
            //           return callback()
            //         } else
            //           return callback(new Error());
            //       }
            //     }
            //     return callback()
            //   },
            //   trigger: 'blur',
            //   message: '请录入正确的车牌号！'
            // }],
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
        __metadata("design:type", Object)
    ], RuleStore.prototype, "itemConfig", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], RuleStore.prototype, "requiredRule", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], RuleStore.prototype, "shadowRuleRegister", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Array)
    ], RuleStore.prototype, "getRuleList", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], RuleStore.prototype, "optionsMatcher", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], RuleStore.prototype, "defaultRule", null);
    return RuleStore;
}(CommonStore));
export { RuleStore };
//# sourceMappingURL=RuleConfigStore.js.map