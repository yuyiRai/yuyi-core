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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_decorators_1 = require("core-decorators");
var lodash_1 = require("lodash");
var mobx_1 = require("mobx");
var SearchStore = /** @class */ (function () {
    function SearchStore(itemConfig) {
        this.searchResult = [];
        this.itemConfig = itemConfig;
    }
    Object.defineProperty(SearchStore.prototype, "searchName", {
        get: function () {
            return this.getSearchName();
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.getSearchName = function () {
        var _a = this.itemConfig, nameCode = _a.nameCode, _b = _a.formSource, form = _b === void 0 ? {} : _b, code = _a.code;
        return Utils.isStringFilter(!Utils.isNil(nameCode) ? form[nameCode] : form[code]);
    };
    Object.defineProperty(SearchStore.prototype, "searchHintText", {
        get: function () {
            return this.keyWord ? "\u5173\u952E\u5B57 " + this.keyWord + " \u7684\u641C\u7D22\u7ED3\u679C" : '';
        },
        enumerable: true,
        configurable: true
    });
    SearchStore.prototype.onSearch = function (keyWord) {
        var _this = this;
        this.keyWord = keyWord;
        this.itemConfig.setLoading(true);
        this.remoteSearch(keyWord).then(function (options) {
            _this.itemConfig.setOptions(options);
            _this.itemConfig.setLoading(false);
        });
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
                            case 0: return [4 /*yield*/, i.remoteMethod(keyWord, formSource, this.itemConfig)
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
            else {
                var _b = this.itemConfig, type = _b.type, options_1 = _b.options;
                if (type === 'search') {
                    return function (keyWord) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, Utils.waitingPromise(1000, Utils.getOptionsByLabel(options_1, new RegExp(keyWord)))];
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
            return this.multipleRemoteSearch(keyWord.split(','));
        }
        return this.remoteMethod(lodash_1.toString(keyWord));
    };
    SearchStore.prototype.multipleRemoteSearch = function (keyWord) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, remoteMethod, nextOptions, keyWordArr, resList, resList_1, resList_1_1, data, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        remoteMethod = this.remoteMethod;
                        nextOptions = [];
                        if (!Utils.isFunction(remoteMethod)) return [3 /*break*/, 12];
                        keyWordArr = Utils.zipEmptyData(Utils.castArray(keyWord));
                        if (!(keyWordArr.length > 0)) return [3 /*break*/, 12];
                        resList = lodash_1.map(keyWordArr, function (keyWord) { return remoteMethod(keyWord); });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        resList_1 = __asyncValues(resList);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, resList_1.next()];
                    case 3:
                        if (!(resList_1_1 = _b.sent(), !resList_1_1.done)) return [3 /*break*/, 5];
                        data = resList_1_1.value;
                        Utils.arrayPush(nextOptions, data);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(resList_1_1 && !resList_1_1.done && (_a = resList_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(resList_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, nextOptions];
                }
            });
        });
    };
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], SearchStore.prototype, "itemConfig", void 0);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", String)
    ], SearchStore.prototype, "keyWord", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "searchName", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "getSearchName", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "searchHintText", null);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], SearchStore.prototype, "searchResult", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "onSearch", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SearchStore.prototype, "remoteMethod", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], SearchStore.prototype, "remoteSearch", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], SearchStore.prototype, "multipleRemoteSearch", null);
    return SearchStore;
}());
exports.SearchStore = SearchStore;
