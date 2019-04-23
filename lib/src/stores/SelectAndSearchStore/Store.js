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
import { observable, computed, action, runInAction } from 'mobx';
import { EventStoreInject } from '../../utils/EventStore';
import { ItemConfig } from '../ItemConfig';
import { autobind } from 'core-decorators';
import { OptionsStore } from './OptionsStore';
import Utils from '../../utils';
import { last, toString, pullAllBy, some, pullAll, map, filter, concat, get } from 'lodash';
var _ = {
    last: last, toString: toString, pullAllBy: pullAllBy, pullAll: pullAll, some: some, map: map, filter: filter, concat: concat, get: get
};
var SelectAndSearchStore = /** @class */ (function () {
    function SelectAndSearchStore() {
        this.type = 'select';
        /**
         * 至今为止选择过的optionList
         * @type { Array }
         */
        this.selectedOptions = [];
    }
    SelectAndSearchStore_1 = SelectAndSearchStore;
    Object.defineProperty(SelectAndSearchStore.prototype, "shadowOption", {
        // shadowOptionObserve = observe(this.shadowOption, 'value', next => console.log('shadowOption', next))
        get: function () {
            return this.optionsStore.shadowOption || {};
        },
        enumerable: true,
        configurable: true
    });
    SelectAndSearchStore.prototype.setShadowOption = function (label, source) {
        this.optionsStore.setShadowOption(label, source);
    };
    SelectAndSearchStore.prototype.setShadowOptionByValue = function (value, source) {
        this.optionsStore.setShadowOptionByValue(value, source);
    };
    Object.defineProperty(SelectAndSearchStore.prototype, "displayOptions", {
        get: function () {
            return this.optionsStore.displayOptions || [];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置当前值
     * @param {string | Array<string>} value
     * @param {string} source
     */
    SelectAndSearchStore.prototype.setValue = function (value, source) {
        if (this.itemConfig.multiple) {
            var nextValue = Utils.zipEmptyData(Utils.castArray(value));
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
    };
    /**
     * 设置配置
     * @param {'select' | 'search'} type
     * @param { ItemConfig } itemConfig
     */
    SelectAndSearchStore.prototype.setConfig = function (type, itemConfig) {
        var _this = this;
        this.type = ['select', 'search'].includes(type) ? type : 'select';
        this.itemConfig = (itemConfig instanceof ItemConfig) ? itemConfig : (Utils.isObject(itemConfig) ? new ItemConfig(itemConfig) : this.itemConfig);
        this.optionsStore = new OptionsStore(this.itemConfig);
        this.searchEventEmitter = Utils.createSimpleTimeBufferInput(function (keywordList) {
            _this.remoteMethod(_.last(keywordList));
        }, this, 300);
    };
    /**
     *
     * @param { string | string[] } key
     */
    SelectAndSearchStore.prototype.searchMethods = function (key) {
        var keyArr = Utils.castArray(key);
        console.log('keyword list', keyArr, this.selectedLables);
        if (Utils.isNotEmptyArray(keyArr) && (keyArr !== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
            if (this.itemConfig.allowInput) {
                // debugger
                this.optionsStore.setShadowOption(Utils.castString(key), 'search');
            }
            this.searchEventEmitter(keyArr);
        }
    };
    Object.defineProperty(SelectAndSearchStore.prototype, "placeholder", {
        get: function () {
            switch (this.type) {
                case 'select': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请选择' + (this.itemConfig.label || ''));
                case 'search': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请输入关键字搜索...');
                default: return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "isSearch", {
        get: function () {
            return this.type === "search";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "hasNameCode", {
        get: function () {
            return Utils.isNotEmptyString(this.itemConfig.nameCode);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "useEmpty", {
        get: function () {
            var _a = this.itemConfig, useHint = _a.useHint, useEmpty = _a.useEmpty;
            return Utils.isNil(useHint) && useEmpty !== false ? function (options) { return options && options.length > 0; } : function () { return false; };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "isCenter", {
        get: function () {
            return this.itemConfig.center === true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "popperClass", {
        get: function () {
            return (this.isCenter ? 'center' : '');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 远程搜索方法
     * @param {string | Array<string>} keyWord 搜索关键字，可以是数组
     */
    SelectAndSearchStore.prototype.remoteMethod = function (keyWord) {
        return __awaiter(this, void 0, void 0, function () {
            var itemConfig, remoteSearch, multiple, setOptions, label, keyWordArr, lastValue;
            var _this = this;
            return __generator(this, function (_a) {
                itemConfig = this.itemConfig;
                remoteSearch = itemConfig.remoteSearch, multiple = itemConfig.multiple, setOptions = itemConfig.setOptions, label = itemConfig.label;
                console.log('尝试搜索', label, keyWord, typeof keyWord);
                keyWordArr = Utils.zipEmptyData(Utils.castArray(keyWord));
                lastValue = Utils.cloneDeep(this.value);
                runInAction(function () { return __awaiter(_this, void 0, void 0, function () {
                    var nextOptions, selectedOptions, selectValue;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(Utils.isFunction(setOptions) && Utils.isFunction(remoteSearch))) return [3 /*break*/, 2];
                                return [4 /*yield*/, remoteSearch(keyWordArr)
                                    // 去除之前选择过的重复项
                                ];
                            case 1:
                                nextOptions = _a.sent();
                                // 去除之前选择过的重复项
                                if (!Utils.isNil(multiple))
                                    Utils.arrayPush(nextOptions, _.pullAllBy(this.selectedOptions, nextOptions, 'value'));
                                setOptions(nextOptions);
                                this.patchSelectedOption(nextOptions);
                                selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr);
                                if (selectedOptions.length > 0) {
                                    selectValue = multiple
                                        ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
                                        : _.get(selectedOptions, '[0].value');
                                    console.log('搜索完毕', label, selectedOptions, selectValue, this.value);
                                    if (!Utils.likeArray(selectValue, this.value))
                                        this.onChange(selectValue);
                                    // this.itemConfig.label=="手术名称" && console.log('搜索完毕', label, keyWordArr, itemConfig, nextOptions, this.selectedOptions, this.itemConfig.loading)
                                }
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    SelectAndSearchStore.prototype.onChangeWithLabel = function (label) {
        var value = this.optionsStore.labelToValue(label);
        // console.log('onBlur', label, value, this.value)
        // if(Utils.isEqual(value, this.value)) {
        //   return
        // }
        return this.onChange(value);
    };
    SelectAndSearchStore.prototype.defaultCreater = function (value) {
        return ({ label: value, value: value });
    };
    SelectAndSearchStore.prototype.onChange = function (value) {
        if (!Utils.isEqual(value, this.value)) {
            var _a = this.itemConfig, options = _a.options, nameCode = _a.nameCode, allowCreate = _a.allowCreate;
            var selectedObj = Utils.getOptionsByValue(options, value);
            // const { pull: pullList, push: pushList } = Utils.getListDifferent(this.value, value)
            // this.patchSelectedOption(pushList)
            // console.log('onChange', label, value, this.value)
            // this.value = value
            var isAllowCreateOption = allowCreate && selectedObj.length === 0 && Utils.isNotEmptyValue(value) && this.isValidShadowOption;
            if (isAllowCreateOption) {
                var additionOption = Utils.isFunctionFilter(allowCreate, this.defaultCreater)(value);
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
    };
    SelectAndSearchStore.prototype.patchSelectedOption = function (pushOptionsList) {
        var _this = this;
        // const { options } = this.itemConfig;
        this.selectedOptions = _.concat(this.selectedOptions, _.filter(pushOptionsList, function (item) { return !_.some(_this.selectedOptions, function (option) { return option.value === item.value; }); }));
    };
    Object.defineProperty(SelectAndSearchStore.prototype, "selectedLables", {
        get: function () {
            return Utils.zipEmptyData(Utils.isNotEmptyArrayFilter(this.valuesToLabels(this.value), [this.shadowOption.label]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "selectedLablesStr", {
        get: function () {
            return this.selectedLables.join(',');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "selectedLablesConfig", {
        get: function () {
            var _this = this;
            return _.map(this.selectedLables, function (label) {
                return {
                    label: label,
                    remove: function () {
                        console.log('close', _this.value, _this.labelsToValues(label));
                        _this.onChange(_.pullAll(__spread(Utils.castArray(_this.value)), _this.labelsToValues(label)));
                    }
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "hasSelectedTag", {
        get: function () {
            return this.selectedLablesConfig.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 格式化Label
     * @param { string } str
     * @return { {prefix: string, label: string, suffix: string} } {prefix, label, suffix}
     */
    SelectAndSearchStore.getConvertLabel = function (str) {
        var _a = __read(Utils.isStringFilter(str, ',,').replace(/^(\[(.*?)\]|)(.*?)(\[(.*?)\]|)$/, '$2,$3,$5').split(','), 3), prefix = _a[0], label = _a[1], suffix = _a[2];
        return { prefix: prefix, label: label, suffix: suffix };
    };
    Object.defineProperty(SelectAndSearchStore.prototype, "selectedLabelConveration", {
        /**
         * @type {{ prefix: string, label: string, suffix: string }}
         */
        get: function () {
            return SelectAndSearchStore_1.getConvertLabel(this.selectedLablesStr);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchStore.prototype, "shadowLabelConveration", {
        /**
         * @type {{ prefix: string, label: string, suffix: string }}
         */
        get: function () {
            return SelectAndSearchStore_1.getConvertLabel(this.shadowOption.label);
        },
        enumerable: true,
        configurable: true
    });
    SelectAndSearchStore.prototype.labelsToValues = function (label) {
        return Utils.labelsToValues(this.isSearch ? this.selectedOptions : this.itemConfig.options, label);
    };
    SelectAndSearchStore.prototype.valuesToLabels = function (value, joinKey) {
        return Utils.valuesToLabels(this.isSearch ? this.selectedOptions : this.itemConfig.options, value, joinKey);
    };
    var SelectAndSearchStore_1;
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
    return SelectAndSearchStore;
}());
export { SelectAndSearchStore };
//# sourceMappingURL=Store.js.map