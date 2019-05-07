"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var mobx_1 = require("mobx");
var core_decorators_1 = require("core-decorators");
var utils_1 = __importDefault(require("../../utils"));
var lodash_1 = require("lodash");
var mobx_utils_1 = require("mobx-utils");
var OptionsStore = /** @class */ (function () {
    function OptionsStore(itemConfig, transformer) {
        this.__keyMap = {};
        this.__optionMap = new WeakMap();
        this.shadowOption = { key: utils_1.default.uuid(), errorMsg: null, label: '', value: '', highlight: true };
        this.itemConfig = itemConfig;
        if (transformer) {
            this.transformer = mobx_utils_1.createTransformer(transformer);
        }
        if (this.itemConfig.allowInput) {
            // console.log(this);
            // this.$on('options-change', (options: Option[]) => {
            //   console.log(options, this.lastOptions, this.shadowOption)
            //   this.lastOptions = cloneDeep(options)
            //   // if(this.itemConfig.label==='归属车辆')
            //   //   debugger
            //   this.setShadowOption(this.shadowOption.label, 'options-update');
            // });
            // reaction(() => this.itemConfig.options, options => {
            //   // console.log(options, this.shadowOption.value)
            //   // if(this.itemConfig.label==='归属车辆')
            //   //   debugger
            //   this.setShadowOptionByValue(this.shadowOption.value, 'options-update')
            // }, { fireImmediately: true })
        }
    }
    Object.defineProperty(OptionsStore.prototype, "shadowOptionMode", {
        get: function () {
            return this.itemConfig.code === this.itemConfig.nameCode ? 'text' : 'code';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    OptionsStore.prototype.setShadowOptionByValue = function (value, source) {
        return __awaiter(this, void 0, void 0, function () {
            var options, label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.itemConfig.getOptionsSafe()];
                    case 1:
                        options = _a.sent();
                        label = utils_1.default.isStringFilter(utils_1.default.valueToLabel(options, value), this.itemConfig.searchName);
                        this.shadowUpdateDispatcher(label, value, source + 'byvaue');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    OptionsStore.prototype.setShadowOption = function (label, source) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.itemConfig.getOptionsSafe()];
                    case 1:
                        _a.sent();
                        value = this.labelToValue(label);
                        this.shadowUpdateDispatcher(label, value, source);
                        return [2 /*return*/];
                }
            });
        });
    };
    OptionsStore.prototype.labelToValue = function (label) {
        return utils_1.default.isStringFilter(utils_1.default.labelToValue(this.displayOptions, new RegExp("^(\\[(.*)\\]|)" + utils_1.default.escapeRegExp(label) + "(\\[(.*)\\]|)$")), label);
    };
    OptionsStore.prototype.shadowUpdateDispatcher = function (label, value, source) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("setShadowOption by " + source + " mode: " + this.shadowOptionMode + ", value: " + value + ", label: " + label, {
                            options: lodash_1.cloneDeep(this.displayOptions), config: this.itemConfig, options1: lodash_1.cloneDeep(this.itemConfig.options)
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.itemConfig.validateHandler(value)];
                    case 2:
                        _a.sent();
                        // if (Utils.isNotEmptyString(value)) {
                        //   // console.log(result, value)
                        // } else {
                        //   throw new Error();
                        // }
                        // console.error('shadowOption result', result, value)
                        mobx_1.runInAction(function () { return _this.updateShadowOption(value, label); });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('shadowOption', error_1);
                        if (this.shadowOption.label !== value) {
                            this.shadowOption.value = value;
                            this.shadowOption.label = label;
                            this.shadowOption.errorMsg = error_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OptionsStore.prototype.updateShadowOption = function (value, label) {
        if (label === void 0) { label = undefined; }
        if (utils_1.default.isString(this.shadowOption.errorMsg)) {
            this.shadowOption.errorMsg = null;
        }
        // if (this.itemConfig.label === '交强险承保单位')
        //   debugger;
        if (value === this.value && this.shadowOption.value != this.value) {
            // console.log(this.selectedLablesStr)
            this.shadowOption.label = label || this.selectedLablesStr;
            this.shadowOption.value = this.value;
        }
        else if (value !== this.value) {
            var shadowOptionSafe = utils_1.default.getOptionsByValue(this.filterOptions, value, true);
            if (shadowOptionSafe) {
                this.shadowOption.label = shadowOptionSafe.label;
            }
            else {
                var allowCreate = this.itemConfig.allowCreate;
                if (utils_1.default.isFunction(allowCreate)) {
                    var label_1 = allowCreate(value).label;
                    this.shadowOption.label = utils_1.default.isStringFilter(label_1, value, '');
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
        return this.shadowOption = __assign({}, this.shadowOption);
    };
    Object.defineProperty(OptionsStore.prototype, "isValidShadowOption", {
        get: function () {
            return !this.itemConfig.allowInput || !utils_1.default.isString(this.shadowOption.errorMsg);
        },
        enumerable: true,
        configurable: true
    });
    OptionsStore.getOptionsKey = function (item, index) {
        return utils_1.default.isStringFilter(item.id, item.key, item.value, (utils_1.default.isObject(item) ? index : item) + '');
    };
    Object.defineProperty(OptionsStore.prototype, "__optionArr", {
        get: function () {
            var options = utils_1.default.isArrayFilter(this.itemConfig.options) || [];
            // this.arrayMap(this.__optionArr, this.toConvertedOption)
            var length = Math.min(options.length, 100);
            var next = Array(length);
            var index = -1;
            while (++index < length) {
                var item = options[index];
                if (!utils_1.default.isNil(item)) {
                    next[index] = (utils_1.default.isObject(item) ? (item.__key == null ? __assign({}, item, { __key: OptionsStore.getOptionsKey(item, index) }) : item) : {
                        __key: OptionsStore.getOptionsKey(item, index),
                        value: item
                    });
                }
            }
            return next;
        },
        enumerable: true,
        configurable: true
    });
    OptionsStore.prototype.toConvertedOption = function (item, index) {
        if (!this.__optionMap.get(item)) {
            // if (!Utils.isNumber(this.__keyMap[item.__key])) {
            //   this.__keyMap[item.__key] = 0;
            // }
            // this.__keyMap[item.__key]++;
            // this.__optionMap.set(item, {
            //   ...item,
            //   key: `${item.__key}.${this.__keyMap[item.__key]}`,
            //   label: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''),
            //   value: Utils.isStringFilter(item.value, (Utils.isObject(item) ? index : item) + '')
            // });
            if (utils_1.default.isNil(this.__keyMap[item.__key])) {
                this.__keyMap[item.__key] = true;
                var option = __assign({}, item, { key: item.__key + "." + this.__keyMap[item.__key], label: utils_1.default.isStringFilter(item.label, item.value, (utils_1.default.isObject(item) ? index : item) + ''), value: utils_1.default.isStringFilter(item.value, (utils_1.default.isObject(item) ? index : item) + '') });
                this.__optionMap.set(item, option);
                return option;
            }
            else {
                return null;
            }
        }
        return this.__optionMap.get(item);
    };
    Object.defineProperty(OptionsStore.prototype, "convertedOption", {
        get: function () {
            var _this = this;
            this.__keyMap = {};
            // console.time(`2displayOptionsNative${this.itemConfig.label}`)
            var result = [];
            utils_1.default.forEach(this.__optionArr, function (o, index) {
                var option = _this.toConvertedOption(o, index);
                if (option) {
                    result.push(option);
                }
            });
            // console.timeEnd(`2displayOptionsNative${this.itemConfig.label}`)
            // console.time(`displayOptionsNative${this.itemConfig.label}`)
            // const result = [], array = this.__optionArr
            // while (result.length < array.length) {
            //   result[result.length] = (this.toConvertedOption(array[result.length], result.length, this.__keyMap, this.__optionMap))
            // }
            // console.timeEnd(`displayOptionsNative${this.itemConfig.label}`)
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "filterOptions", {
        get: function () {
            // trace()
            var filterOptions = this.itemConfig.filterOptions;
            return utils_1.default.isNotEmptyArray(filterOptions)
                ? utils_1.default.arrayFilterDive(this.convertedOption, function (item) { return !filterOptions.includes(item.label); }) : this.convertedOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "selectedItemIndex", {
        get: function () {
            var value = utils_1.default.isNotEmptyValueFilter(this.shadowOption.value, this.value);
            return lodash_1.findIndex(this.filterOptions, function (_a) {
                var v = _a.value, label = _a.label;
                // debugger
                return utils_1.default.isEqual(v, value) || (utils_1.default.isEqual(label, value));
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "displayOptions", {
        get: function () {
            var _this = this;
            var allowInput = this.itemConfig.allowInput;
            var defaultOptions = this.filterOptions;
            if (allowInput) {
                // debugger
                // console.log('getShadowOption', defaultOptions, this.shadowOption)
                if (this.selectedItemIndex > -1) {
                    return utils_1.default.arrayMapDive(defaultOptions, function (option, index) { return _this.selectedItemIndex === index ? __assign({}, option, { highlight: true }) : option; });
                }
                else if (utils_1.default.isNotEmptyString(this.shadowOption.value) && !utils_1.default.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
                    // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
                    return utils_1.default.concat(this.shadowOption, defaultOptions);
                }
            }
            return defaultOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "transformOption", {
        get: function () {
            return this.transformer ? this.transformer(this) : [];
        },
        enumerable: true,
        configurable: true
    });
    OptionsStore.prototype.valuesToLabels = function (value) {
        return utils_1.default.valuesToLabels(this.displayOptions, value);
    };
    OptionsStore.prototype.labelsToValues = function (label) {
        return utils_1.default.labelsToValues(this.displayOptions, label);
    };
    Object.defineProperty(OptionsStore.prototype, "selectedLables", {
        get: function () {
            var value = this.itemConfig.currentComponentValue;
            return utils_1.default.zipEmptyData(utils_1.default.isNotEmptyArrayFilter(this.valuesToLabels(value)) || [this.shadowOption.label]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "selectedLablesStr", {
        get: function () {
            return this.selectedLables.join(',');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "selectedLablesConfig", {
        get: function () {
            var _this = this;
            var value = this.itemConfig.currentComponentValue;
            return utils_1.default.arrayMapDive(this.selectedLables, function (label) {
                return {
                    label: label,
                    remove: function () {
                        return lodash_1.pullAll(__spread(utils_1.default.castArray(value)), _this.labelsToValues(label));
                    }
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "hasSelectedTag", {
        get: function () {
            console.log('selectedLablesConfig', this.selectedLablesConfig);
            return this.selectedLablesConfig.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], OptionsStore.prototype, "itemConfig", void 0);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Function)
    ], OptionsStore.prototype, "transformer", void 0);
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
        mobx_1.action.bound,
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
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "displayOptions", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "transformOption", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "valuesToLabels", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "labelsToValues", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLables", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLablesStr", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLablesConfig", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "hasSelectedTag", null);
    return OptionsStore;
}());
exports.OptionsStore = OptionsStore;
