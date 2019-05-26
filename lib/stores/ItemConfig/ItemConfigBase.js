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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* eslint-disable */
import { autobind } from 'core-decorators';
import difference from "lodash/difference";
import get from "lodash/get";
import isError from "lodash/isError";
import { action, computed, extendObservable, isComputedProp, observable, ObservableMap, toJS } from 'mobx';
import { EventEmitter } from '../../utils/EventEmitter';
// import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
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
        var e_1, _a;
        var _loop_1 = function (key) {
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
                _loop_1(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ItemConfigBase.prototype.setConfig = function (baseConfig, strict) {
        var isChange = this.setBaseConfig(__assign({}, baseConfig), strict);
        isChange && this.registerObservables(baseConfig);
    };
    ItemConfigBase.prototype.init = function (initModel, form, componentProps) {
        if (componentProps === void 0) { componentProps = {}; }
        this.setConfig(initModel);
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
            var v = this.parentConfig
                ? get(this.parentConfig.currentComponentValue, this.keyInnerCode)
                : this.currentValueFromStore;
            return toJS(v);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBase.prototype.validateHandler = function (value, strict) {
        var _this = this;
        if (strict === void 0) { strict = false; }
        return new Promise(function (resolve, reject) {
            var e_2, _a;
            var resultList = [];
            var ruleList = _this.rules.filter(function (rule) { return (rule.strict && strict) || (!rule.strict && !strict); });
            // console.log('validateHandler start', ruleList)
            if ((Utils.isArrayFilter(ruleList) || []).length === 0) {
                return resolve(true);
            }
            // console.log('validateHandler', ruleList)
            var length = ruleList.length;
            var _loop_2 = function (rule) {
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
                    _loop_2(rule);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (ruleList_1_1 && !ruleList_1_1.done && (_a = ruleList_1.return)) _a.call(ruleList_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    };
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
    ItemConfigBase.prototype.optionsMatcher = function (r, values, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3, _a, options, _b, _c, value;
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
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_3) throw e_3.error; }
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
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "validateHandler", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ItemConfigBase.prototype, "updateVersion", null);
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
    return ItemConfigBase;
}(ItemConfigBaseConfig));
export { ItemConfigBase };
//# sourceMappingURL=ItemConfigBase.js.map