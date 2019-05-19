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
import cloneDeep from "lodash/cloneDeep";
import findIndex from "lodash/findIndex";
import map from "lodash/map";
import pullAll from "lodash/pullAll";
import { action, computed, extendObservable, observable, runInAction } from 'mobx';
import { createTransformer } from 'mobx-utils';
import Utils from '../../utils';
var OptionsTransformerStore = /** @class */ (function () {
    function OptionsTransformerStore(itemConfig, transformer) {
        this.__keyMap = {};
        this.itemConfig = itemConfig;
        if (transformer) {
            this.transformer = createTransformer(transformer);
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
    OptionsTransformerStore.getOptionsKey = function (item, index, parentKey) {
        return "" + (Utils.isString(parentKey) ? parentKey + "." : '') + Utils.isStringFilter(item.id, item.key, item.value, (Utils.isObject(item) ? index : item) + '');
    };
    Object.defineProperty(OptionsTransformerStore.prototype, "__optionArr", {
        get: function () {
            return OptionsStore.getOptionArr(this.itemConfig.options);
        },
        enumerable: true,
        configurable: true
    });
    OptionsTransformerStore.getOptionArr = function (sourceOptions, parentKey) {
        var options = Utils.zipEmptyData(Utils.isArrayFilter(sourceOptions) || []);
        var length = Math.min(options.length, 100);
        var next = Array(length);
        var index = -1;
        while (++index < length) {
            var item = options[index];
            if (!Utils.isNil(item)) {
                var option = (Utils.isObject(item)
                    ? (item.__key == null
                        ? __assign({}, item, { __key: OptionsStore.getOptionsKey(item, index, parentKey) }) : item)
                    : {
                        __key: OptionsStore.getOptionsKey(item, index, parentKey),
                        value: item
                    });
                if (option && option.children) {
                    option.children = OptionsStore.getOptionArr(option.children, option.__key);
                }
                next[index] = option;
            }
        }
        return next;
    };
    OptionsTransformerStore.prototype.toConvertedOption = function (item, index) {
        if (Utils.isNil(this.__keyMap[item.__key])) {
            this.__keyMap[item.__key] = true;
            var option = __assign({}, item, { key: item.key || item.__key + "." + this.__keyMap[item.__key], label: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''), title: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''), value: Utils.isStringFilter(item.value, (Utils.isObject(item) ? index : item) + '') });
            return option;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(OptionsTransformerStore.prototype, "convertedOption", {
        get: function () {
            this.__keyMap = {};
            return this.todoConvertOption(this.__optionArr);
        },
        enumerable: true,
        configurable: true
    });
    OptionsTransformerStore.prototype.todoConvertOption = function (option, parentOption) {
        var _this = this;
        // console.time(`2displayOptionsNative${this.itemConfig.label}`)
        var result = [];
        Utils.forEach(option, function (o, index) {
            var itemConfig = _this.itemConfig;
            var baseOption = _this.toConvertedOption(o, index);
            if (baseOption) {
                var option_1 = extendObservable({}, __assign({}, baseOption, { get disabled() {
                        return itemConfig.loading;
                    },
                    get path() {
                        return (this.parentOption ? this.parentOption.path + ".children" : '') + "[" + result.length + "]";
                    },
                    parentOption: parentOption }));
                if (option_1 && option_1.children) {
                    option_1.children = _this.todoConvertOption(option_1.children, option_1);
                }
                result.push(option_1);
            }
        });
        return result;
    };
    Object.defineProperty(OptionsTransformerStore.prototype, "filterOptions", {
        get: function () {
            // trace()
            var filterOptions = this.itemConfig.filterOptions;
            return Utils.isNotEmptyArray(filterOptions)
                ? Utils.arrayFilterDive(this.convertedOption, function (item) { return !filterOptions.includes(item.label); }) : this.convertedOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsTransformerStore.prototype, "getOptionsLabel", {
        get: function () {
            return Utils.isFunctionFilter(this.itemConfig.getOptionsLabel, function (option) { return option.label; });
        },
        enumerable: true,
        configurable: true
    });
    OptionsTransformerStore.prototype.getTagByOption = function (option) {
        var getTagByOption = this.itemConfig.getTagByOption;
        return Utils.isFunction(getTagByOption) && getTagByOption(option || this.selectedOptions[0]);
    };
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], OptionsTransformerStore.prototype, "itemConfig", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Function)
    ], OptionsTransformerStore.prototype, "transformer", void 0);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsTransformerStore.prototype, "__optionArr", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsTransformerStore.prototype, "convertedOption", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsTransformerStore.prototype, "filterOptions", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsTransformerStore.prototype, "getOptionsLabel", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsTransformerStore.prototype, "getTagByOption", null);
    return OptionsTransformerStore;
}());
export { OptionsTransformerStore };
var OptionsStore = /** @class */ (function (_super) {
    __extends(OptionsStore, _super);
    function OptionsStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shadowOption = { key: Utils.uuid(), errorMsg: null, label: '', value: '', highlight: true };
        return _this;
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
     */
    OptionsStore.prototype.setShadowOptionByValue = function (value, source) {
        return __awaiter(this, void 0, void 0, function () {
            var options, label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.itemConfig.getOptionsSafe()];
                    case 1:
                        options = _a.sent();
                        label = Utils.isStringFilter(Utils.valueToLabel(options, value), this.itemConfig.searchName);
                        this.shadowUpdateDispatcher(label, value, source + 'byvaue');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 录入值的自动转化
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
        return Utils.isStringFilter(Utils.labelToValue(this.displayOptions, new RegExp("^(\\[(.*)\\]|)" + Utils.escapeRegExp(label) + "(\\[(.*)\\]|)$")), label);
    };
    OptionsStore.prototype.shadowUpdateDispatcher = function (label, value, source) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("setShadowOption by " + source + " mode: " + this.shadowOptionMode + ", value: " + value + ", label: " + label, {
                            options: cloneDeep(this.displayOptions), config: this.itemConfig, options1: cloneDeep(this.itemConfig.options)
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
                        runInAction(function () { return _this.updateShadowOption(value, label); });
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
        if (Utils.isString(this.shadowOption.errorMsg)) {
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
            var shadowOptionSafe = Utils.getOptionsByValue(this.filterOptions, value, true);
            if (shadowOptionSafe) {
                this.shadowOption.label = shadowOptionSafe.label;
            }
            else {
                var allowCreate = this.itemConfig.allowCreate;
                if (Utils.isFunction(allowCreate)) {
                    var label_1 = allowCreate(value).label;
                    this.shadowOption.label = Utils.isStringFilter(label_1, value, '');
                }
                else {
                    this.shadowOption.label = Utils.isStringFilter(label, value, '');
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
        console.log(Utils.cloneDeep(this.shadowOption));
        return this.shadowOption = __assign({}, this.shadowOption);
    };
    Object.defineProperty(OptionsStore.prototype, "isValidShadowOption", {
        get: function () {
            return !this.itemConfig.allowInput || !Utils.isString(this.shadowOption.errorMsg);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "selectedItemIndex", {
        get: function () {
            var value = Utils.isNotEmptyValueFilter(this.shadowOption.value, this.value);
            return findIndex(this.filterOptions, function (_a) {
                var v = _a.value, label = _a.label;
                // debugger
                return Utils.isEqual(v, value) || (Utils.isEqual(label, value));
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
                    return Utils.arrayMapDive(defaultOptions, function (option, index) { return _this.selectedItemIndex === index ? __assign({}, option, { highlight: true }) : option; });
                }
                else if (Utils.isNotEmptyString(this.shadowOption.value) && !Utils.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
                    // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
                    return Utils.concat(this.shadowOption, defaultOptions);
                }
            }
            return defaultOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "nativeDisplayOptionList", {
        get: function () {
            return map(this.displayOptions, function (option) { return Utils.toJS(option); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "transformOption", {
        get: function () {
            return this.transformer ? this.transformer(this) : this.nativeDisplayOptionList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "nativeTransformOption", {
        get: function () {
            return map(this.transformOption, function (option) { return Utils.toJS(option); });
        },
        enumerable: true,
        configurable: true
    });
    OptionsStore.prototype.valuesToLabels = function (value) {
        return Utils.valuesToLabels(this.displayOptions, value);
    };
    OptionsStore.prototype.labelsToValues = function (label) {
        return Utils.labelsToValues(this.displayOptions, label);
    };
    Object.defineProperty(OptionsStore.prototype, "selectedLables", {
        get: function () {
            var value = this.itemConfig.currentComponentValue;
            return Utils.zipEmptyData(Utils.isNotEmptyArrayFilter(this.valuesToLabels(value)) || []);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "selectedOptions", {
        get: function () {
            var value = this.itemConfig.currentComponentValue;
            return Utils.zipEmptyData(Utils.isNotEmptyArrayFilter(Utils.getOptionsByValue(this.displayOptions, value)) || []);
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
            return Utils.arrayMapDive(this.selectedLables, function (label, index) {
                return {
                    label: label,
                    value: Utils.labelToValue(_this.displayOptions, label),
                    remove: function (onChange) {
                        onChange(pullAll(__spread(Utils.castArray(value)), _this.labelsToValues(label)));
                    }
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsStore.prototype, "hasSelectedTag", {
        get: function () {
            // console.log('selectedLablesConfig', this.selectedLablesConfig)
            return this.selectedLables.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], OptionsStore.prototype, "shadowOption", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "shadowOptionMode", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], OptionsStore.prototype, "setShadowOptionByValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], OptionsStore.prototype, "setShadowOption", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "labelToValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], OptionsStore.prototype, "shadowUpdateDispatcher", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "updateShadowOption", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "isValidShadowOption", null);
    __decorate([
        computed,
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedItemIndex", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "displayOptions", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "nativeDisplayOptionList", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "transformOption", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "nativeTransformOption", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "valuesToLabels", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OptionsStore.prototype, "labelsToValues", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLables", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedOptions", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLablesStr", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "selectedLablesConfig", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], OptionsStore.prototype, "hasSelectedTag", null);
    return OptionsStore;
}(OptionsTransformerStore));
export { OptionsStore };
//# sourceMappingURL=OptionsStore.js.map