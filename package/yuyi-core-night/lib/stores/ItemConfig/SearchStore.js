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
import { autobind } from "core-decorators";
import produce from "immer";
import get from "lodash/get";
import toString from "lodash/toString";
// import { Debounce } from 'lodash-decorators';
import { action, computed, observable, reaction } from "mobx";
import { Option, OptionBase, Utils } from "../../utils";
import { CommonStore } from "./interface/CommonStore";
var SearchStore = /** @class */ (function (_super) {
    __extends(SearchStore, _super);
    function SearchStore(itemConfig) {
        var _this = _super.call(this) || this;
        _this.mode = 'search';
        _this.searchKeyHistory = observable.array([]);
        _this.inited = false;
        _this.loadDataBuffer = Utils.createSimpleTimeBufferInput(function (dataPathBuffer) { return __awaiter(_this, void 0, void 0, function () {
            var dataPathBuffer_1, dataPathBuffer_1_1, keyPath, optionsList, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // console.log(keyPathBuffer);
                        console.log('loadData', dataPathBuffer);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        dataPathBuffer_1 = __values(dataPathBuffer), dataPathBuffer_1_1 = dataPathBuffer_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!dataPathBuffer_1_1.done) return [3 /*break*/, 5];
                        keyPath = dataPathBuffer_1_1.value;
                        return [4 /*yield*/, this.lazyLoadDataPromise(keyPath)];
                    case 3:
                        optionsList = _b.sent();
                        // debugger
                        this.itemConfig.setOptions(Utils.cloneDeep(optionsList));
                        _b.label = 4;
                    case 4:
                        dataPathBuffer_1_1 = dataPathBuffer_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (dataPathBuffer_1_1 && !dataPathBuffer_1_1.done && (_a = dataPathBuffer_1.return)) _a.call(dataPathBuffer_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.itemConfig.setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, _this, 100, true);
        _this.searchResult = [];
        _this.itemConfig = itemConfig;
        _this.reaction(function () { return _this.inited; }, function (isInited) {
            if (isInited === false) {
                if (_this.initedListener) {
                    _this.initedListener();
                }
                _this.initedListener = _this.initAction();
            }
            else if (isInited && _this.initedListener) {
                _this.initedListener();
                _this.initedListener = null;
            }
        }, { fireImmediately: true });
        console.log('useSearchStore', _this.itemConfig.type === 'cascader', _this, _this.itemConfig.code);
        return _this;
    }
    Object.defineProperty(SearchStore.prototype, "keyWord", {
        get: function () {
            var history = this.searchKeyHistory;
            var lastIndex = history.length - 1;
            var key = history.length === 0 ? undefined : Utils.toString(history[lastIndex]);
            return key === '*' ? '' : key;
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.initAction = function () {
        var _this = this;
        if (['selectTree', 'cascader'].includes(this.itemConfig.type)) {
            // this.itemConfig.formStore.onItemChange
            // this.initOption()
            return reaction(function () { return _this.itemConfig.currentComponentValue; }, function (value) {
                _this.initOption();
                if (!Utils.isEmptyData(value)) {
                    // debugger
                    // if (searchName!=='*')
                    _this.inited = true;
                    // this.resetKeyword()
                    console.log('get value change', _this.itemConfig.code, value, _this.itemConfig);
                }
            }, { fireImmediately: true });
        }
        else if (this.itemConfig.type === 'search') {
            this.autorun(function () {
                if (_this.searchKeyHistory.length > 10) {
                    _this.searchKeyHistory.shift();
                }
                _this.toSearch(_this.keyWord);
                // this.itemConfig.filterOptions = [this.keyWord]
            });
            this.intercept(this.searchKeyHistory, function (change) {
                if (change.added.length > 0 && change.added[0] !== change.object[change.object.length - 1]) {
                    // console.log(change)
                    change.added = Utils.zipEmptyData(change.added);
                }
                else {
                    change.added = [];
                }
                return change;
            });
            // reaction
            this.resetKeyword();
            return reaction(function () { return _this.searchName; }, function (searchName) {
                if (Utils.isNotEmptyString(searchName)) {
                    // if (searchName!=='*')
                    // debugger
                    _this.onSearch(searchName, 'data init');
                    // this.resetKeyword()
                    console.log('get searchName change', _this.itemConfig.code, searchName, _this.itemConfig);
                    _this.inited = true;
                }
            }, { fireImmediately: true });
        }
        // console.log('SearchStore 尝试搜索')
    };
    Object.defineProperty(SearchStore.prototype, "searchName", {
        get: function () {
            return this.itemConfig.searchName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchStore.prototype, "getPathValueWithLeafValue", {
        get: function () {
            return this.itemConfig.getPathValueWithLeafValue || (function (leafValue) { return Utils.convertValueOption(Utils.castArray(leafValue, false)); });
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.initOption = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.initTopOptions();
                if (this.itemConfig.type === 'cascader') {
                    return [2 /*return*/, this.initOptionWithPathValue()];
                }
                else {
                    return [2 /*return*/, this.initOptionWithLeafValue()];
                }
                return [2 /*return*/];
            });
        });
    };
    // @Debounce(1000)
    SearchStore.prototype.initOptionWithLeafValue = function (value) {
        if (value === void 0) { value = this.itemConfig.currentComponentValue; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.itemConfig.setLoading(true, 'runInAction');
                        _a = this.initOptionWithOptionList;
                        _c = (_b = Utils).castArray;
                        return [4 /*yield*/, this.getPathValueWithLeafValue(value)];
                    case 1: return [2 /*return*/, _a.apply(this, [_c.apply(_b, [_d.sent(), false])])];
                }
            });
        });
    };
    SearchStore.prototype.initOptionWithPathValue = function (value) {
        if (value === void 0) { value = this.itemConfig.currentComponentValue; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.initOptionWithOptionList(Utils.convertValueOption(value))];
            });
        });
    };
    SearchStore.prototype.initTopOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var optionsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.loadData && this.itemConfig.options.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.lazyLoadDataPromise([])];
                    case 1:
                        optionsList = _a.sent();
                        this.itemConfig.setOptions(optionsList);
                        return [2 /*return*/, optionsList];
                    case 2: return [2 /*return*/, this.itemConfig.options];
                }
            });
        });
    };
    // @Debounce(1000)
    SearchStore.prototype.initOptionWithOptionList = function (optionList) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedOptions, list, index, nextOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, optionList];
                    case 1:
                        selectedOptions = _a.sent();
                        if (!this.loadData) return [3 /*break*/, 6];
                        this.itemConfig.setLoading(true, 'runInAction');
                        if (!Utils.isNotEmptyArray(selectedOptions)) return [3 /*break*/, 5];
                        list = [];
                        index = 0;
                        _a.label = 2;
                    case 2:
                        if (!(index < selectedOptions.length - 1)) return [3 /*break*/, 5];
                        // if (index < selectedOptions.length - 1) {
                        // }
                        list.push(selectedOptions[index]);
                        return [4 /*yield*/, this.lazyLoadDataPromise(list, true)];
                    case 3:
                        nextOptions = _a.sent();
                        this.itemConfig.setOptions(nextOptions);
                        _a.label = 4;
                    case 4:
                        index++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.itemConfig.setLoading(false, 'runInAction');
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(SearchStore.prototype, "loadData", {
        get: function () {
            return this.itemConfig.loadData ? this.loadDataHandler : undefined;
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.loadDataHandler = function (dataPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.itemConfig.loading) {
                    this.itemConfig.setLoading(true);
                }
                this.loadDataBuffer(dataPath);
                return [2 /*return*/];
            });
        });
    };
    SearchStore.prototype.lazyLoadDataPromise = function (dataPath, strict) {
        return __awaiter(this, void 0, void 0, function () {
            var lastItem, loadedData, path, needLoadData, optionsList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastItem = dataPath[dataPath.length - 1];
                        path = this.searchOptions(dataPath, this.itemConfig.options).path;
                        needLoadData = this.itemConfig.loadData && (strict || !Utils.isNotEmptyArray(get(this.itemConfig.options, path + ".children")));
                        if (!needLoadData) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.itemConfig.loadData(lastItem ? __assign({}, lastItem) : null, dataPath, this.itemConfig.formSource, this.itemConfig)];
                    case 1:
                        loadedData = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (path !== '') {
                            optionsList = produce(this.itemConfig.options, function (optionsList) {
                                var result = get(optionsList, path);
                                if (result) {
                                    if (Utils.isNotEmptyArray(loadedData)) {
                                        // if (this.itemConfig.label==='机构'){
                                        //   debugger
                                        // }
                                        result.children = Utils.cloneDeep(loadedData).map(function (i) { return Utils.isNil(i.isLeaf) ? Object.assign(i, {
                                            isLeaf: (Utils.isArrayFilter(dataPath) || []).length > _this.itemConfig.loadDataDeep - 2
                                        }) : i; });
                                    }
                                    if (Utils.isArray(result.children)) {
                                        result.isLeaf = false;
                                    }
                                    else {
                                        result.isLeaf = true;
                                    }
                                    result.disabled = false;
                                }
                                else {
                                    // this.itemConfig.setOptions(produce(this.itemConfig.options, optionsList => set(optionsList, `${path}.disabled`, true)))
                                }
                            });
                            // console.log('loadData leaf',  this.itemConfig.label, optionsList);
                            return [2 /*return*/, optionsList];
                        }
                        else {
                            // if (this.itemConfig.label==='机构'){
                            //   debugger
                            // }
                            this.itemConfig.setOptions(loadedData);
                        }
                        return [2 /*return*/, loadedData];
                }
            });
        });
    };
    SearchStore.prototype.searchOptions = function (keyPath, optionsList) {
        if (optionsList === void 0) { optionsList = this.itemConfig.options; }
        var path = '';
        var result = Utils.reduce(keyPath, function (currentList, option, index, list) {
            if (Utils.isArray(currentList)) {
                var last = index === list.length - 1;
                var i = currentList.findIndex(function (o) { return o.value === option.value; });
                var current = currentList[i];
                if (current) {
                    path += "[" + i + "]" + (last ? '' : '.children');
                    return last ? current : (current.children || []);
                }
            }
            return [];
        }, optionsList);
        return { result: result, path: path.replace(/\.children$/, '') };
    };
    Object.defineProperty(SearchStore.prototype, "searchHintText", {
        get: function () {
            return this.keyWord ? "\u5173\u952E\u5B57 " + this.keyWord + " \u7684\u641C\u7D22\u7ED3\u679C" : '';
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.onSearch = function (keyWord, trigger) {
        if (trigger === void 0) { trigger = 'onSearch'; }
        console.log('want todo search', keyWord, trigger);
        this.searchKeyHistory.push(keyWord);
    };
    SearchStore.prototype.toSearch = function (keyWord) {
        var _this = this;
        console.log('尝试搜索', this.itemConfig.code, keyWord);
        this.itemConfig.setLoading(true, 'toSearch');
        this.remoteSearch(keyWord).then(function (options) {
            _this.itemConfig.setOptions(options);
            // this.itemConfig.formStore.setFormValueWithName(this.itemConfig.code)
            // console.log('搜索完毕', this.itemConfig.code, keyWord, options, this.itemConfig.optionsStore.selectedLablesStr)
        }).finally(function () {
            _this.itemConfig.setLoading(false, 'toSearch');
        });
    };
    SearchStore.prototype.resetKeyword = function () {
        this.onSearch('*', 'resetKeyword');
    };
    Object.defineProperty(SearchStore.prototype, "remoteMethod", {
        get: function () {
            var _this = this;
            var _a = this.itemConfig, i = _a.i, formSource = _a.formSource;
            if (Utils.isFunction(i.remoteMethod)) {
                return function (keyWord) { return __awaiter(_this, void 0, void 0, function () {
                    var r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, i.remoteMethod(keyWord, formSource, this.itemConfig)];
                            case 1:
                                r = _a.sent();
                                console.log('remoteSearch get', keyWord, r, this.keyWord);
                                return [2 /*return*/, r];
                        }
                    });
                }); };
            }
            else {
                var _b = this.itemConfig, type = _b.type, options_1 = _b.options;
                if (type === 'search') {
                    return function (keyWord) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, Utils.waitingPromise(0, options_1)];
                        });
                    }); };
                }
                return function (keyWord) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, options_1];
                    });
                }); };
            }
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.remoteSearch = function (keyWord) {
        if (this.itemConfig.multiple) {
            return this.multipleRemoteSearch(Utils.isString(keyWord) ? keyWord.split(',') : []);
        }
        console.log('remoteSearch get', this.itemConfig.code, keyWord, this.itemConfig);
        return this.remoteMethod(toString(keyWord) || this.itemConfig.currentValue);
    };
    SearchStore.prototype.multipleRemoteSearch = function (keyWord) {
        return __awaiter(this, void 0, void 0, function () {
            var remoteMethod, nextOptions, keyWordArr, keyWordArr_1, keyWordArr_1_1, keyWord_1, _a, _b, _c, e_2_1;
            var e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        remoteMethod = this.remoteMethod;
                        nextOptions = [];
                        if (!Utils.isFunction(remoteMethod)) return [3 /*break*/, 9];
                        keyWordArr = Utils.zipEmptyData(__spread(Utils.isStringFilter(this.searchName, '').split(','), keyWord));
                        if (keyWordArr.length === 0) {
                            keyWordArr.push('');
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        keyWordArr_1 = __values(keyWordArr), keyWordArr_1_1 = keyWordArr_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!keyWordArr_1_1.done) return [3 /*break*/, 5];
                        keyWord_1 = keyWordArr_1_1.value;
                        _b = (_a = nextOptions.push).apply;
                        _c = [nextOptions];
                        return [4 /*yield*/, remoteMethod(keyWord_1)];
                    case 3:
                        _b.apply(_a, _c.concat([__spread.apply(void 0, [_e.sent()])]));
                        _e.label = 4;
                    case 4:
                        keyWordArr_1_1 = keyWordArr_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (keyWordArr_1_1 && !keyWordArr_1_1.done && (_d = keyWordArr_1.return)) _d.call(keyWordArr_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        console.log('todo search', keyWordArr, this.itemConfig, nextOptions);
                        _e.label = 9;
                    case 9: return [2 /*return*/, nextOptions];
                }
            });
        });
    };
    __decorate([
        observable,
        __metadata("design:type", String)
    ], SearchStore.prototype, "mode", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], SearchStore.prototype, "itemConfig", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], SearchStore.prototype, "searchKeyHistory", void 0);
    __decorate([
        computed,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "keyWord", null);
    __decorate([
        observable,
        __metadata("design:type", Boolean)
    ], SearchStore.prototype, "inited", void 0);
    __decorate([
        observable,
        __metadata("design:type", Function)
    ], SearchStore.prototype, "initedListener", void 0);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "initAction", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "searchName", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "getPathValueWithLeafValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "initOption", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "initOptionWithLeafValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "initOptionWithPathValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "initTopOptions", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "initOptionWithOptionList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "loadData", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "loadDataHandler", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Object)
    ], SearchStore.prototype, "searchOptions", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "searchHintText", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], SearchStore.prototype, "searchResult", void 0);
    __decorate([
        Utils.timebuffer(200),
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "onSearch", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "toSearch", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "resetKeyword", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "remoteMethod", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "remoteSearch", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "multipleRemoteSearch", null);
    return SearchStore;
}(CommonStore));
export { SearchStore };
//# sourceMappingURL=SearchStore.js.map