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
/* eslint-disable */
import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { FormStore } from '../../components';
import { EventStoreInject } from "../EventStore";
import getTransform from './input/FormValueTransform';
import { ItemConfigBase } from './ItemConfigBase';
import { DisplayConfig } from './ItemDisplayConfig';
import { OptionsStore } from './OptionsStore';
import { SearchStore } from './SearchStore';
var ItemConfig = /** @class */ (function (_super) {
    __extends(ItemConfig, _super);
    function ItemConfig(initModel, form, componentProps, formStore) {
        if (form === void 0) { form = {}; }
        if (componentProps === void 0) { componentProps = {}; }
        var _this = _super.call(this, initModel, form, componentProps) || this;
        _this.$version = 0;
        // @observable loading = false;
        _this.displayConfig = new DisplayConfig();
        _this.childrenConfig = {};
        _this.setFormStore(formStore);
        _this.autorun(function () {
            if (_this.isComputedEnable && _this.computed !== _this.currentValue) {
                _this.formStore.setFormValue(_this.code, _this.computed);
            }
        });
        _this.reaction(function () { return _this.children; }, function (children) {
            if (children !== false) {
                for (var key in children) {
                    if (_this.childrenConfig[key] instanceof ItemConfig_1) {
                        _this.childrenConfig[key].setForm(_this.formSource);
                        _this.childrenConfig[key].setFormStore(_this.formStore);
                    }
                    else {
                        _this.childrenConfig[key] = new ItemConfig_1(_this.children[key], _this.formSource, _this.componentProps, _this.formStore);
                        _this.childrenConfig[key].setParentConfig(_this);
                    }
                }
            }
            else {
                _this.childrenConfig = {};
            }
        }, { fireImmediately: true });
        _this.autorun(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = this.i;
                        if (!i.autorunMethod) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, i.autorunMethod(this.currentComponentValue, this.formStore, this)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, { delay: 0 });
        return _this;
    }
    ItemConfig_1 = ItemConfig;
    ItemConfig.setCommonTransformerPipe = function (func) {
        this.commonTransformerConfig = func;
    };
    Object.defineProperty(ItemConfig, "commonTransformer", {
        get: function () {
            return createTransformer(this.commonTransformerConfig ||
                (function (_a) {
                    var type = _a.type, multiple = _a.multiple;
                    if (['select', 'search'].includes(type) && multiple) {
                        return 'group';
                    }
                    return ({
                        'check': 'group',
                        'checkOne': {
                            F2V: function (v) { return v === '1'; },
                            V2F: function (v) {
                                return v === true ? '1' : '0';
                            }
                        },
                        'group': {
                            F2V: function (v) { return Utils.isObjectFilter(v) || {}; },
                            V2F: function (v) { return Utils.isObjectFilter(v) || {}; }
                        }
                    })[type];
                }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "displayProps", {
        get: function () {
            return this.displayConfig.init(this, this.componentProps);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig.prototype.setSearchStore = function (searchStore) {
        this.searchStore = searchStore;
    };
    ItemConfig.prototype.useSearchStore = function (transformer, config) {
        if (config === void 0) { config = this; }
        var store = this.searchStore || new SearchStore(config);
        this.setSearchStore(store);
        this.useOptionsStore(transformer, config);
        return store;
    };
    Object.defineProperty(ItemConfig.prototype, "formValueTransform", {
        get: function () {
            return getTransform(this.code, this.transformer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "transformer", {
        get: function () {
            return this.i.transformer || ItemConfig_1.commonTransformer(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "form2Value", {
        get: function () {
            var filter = this.i.filter;
            return Utils.isFunctionFilter(filter, this.formValueTransform.F2V);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "value2Form", {
        get: function () {
            var filterToValue = this.i.filterToValue;
            return Utils.isFunctionFilter(filterToValue, this.formValueTransform.V2F);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "currentComponentValue", {
        get: function () {
            return this.form2Value(this.currentValue, this.formSource);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "computed", {
        get: function () {
            return Utils.isFunction(this.i.computed) && this.getComputedValue('computed');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "isComputedEnable", {
        get: function () {
            return this.computed !== false;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig.prototype.useOptionsStore = function (transformer, config) {
        if (config === void 0) { config = this; }
        var store = this.optionsStore || new OptionsStore(config, transformer);
        this.optionsStore = store;
        return store;
    };
    ItemConfig.prototype.log = function (message) {
        console.log(message);
        return this;
    };
    var ItemConfig_1;
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfig.prototype, "$version", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfig.prototype, "displayConfig", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "displayProps", null);
    __decorate([
        observable,
        __metadata("design:type", SearchStore)
    ], ItemConfig.prototype, "searchStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [SearchStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "setSearchStore", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, ItemConfig]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "useSearchStore", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "formValueTransform", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "transformer", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "form2Value", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "value2Form", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "currentComponentValue", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "computed", null);
    __decorate([
        computed,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "isComputedEnable", null);
    __decorate([
        observable,
        __metadata("design:type", OptionsStore)
    ], ItemConfig.prototype, "optionsStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "useOptionsStore", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfig.prototype, "childrenConfig", void 0);
    __decorate([
        observable,
        __metadata("design:type", Function)
    ], ItemConfig, "commonTransformerConfig", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], ItemConfig, "setCommonTransformerPipe", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], ItemConfig, "commonTransformer", null);
    ItemConfig = ItemConfig_1 = __decorate([
        EventStoreInject(['options-change']),
        __metadata("design:paramtypes", [Object, Object, Object, FormStore])
    ], ItemConfig);
    return ItemConfig;
}(ItemConfigBase));
export { ItemConfig };
//# sourceMappingURL=ItemConfig.js.map