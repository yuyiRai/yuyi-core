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
import { autobind } from 'core-decorators';
import produce from 'immer';
import get from "lodash/get";
import set from "lodash/set";
import values from "lodash/values";
import { default as getKeys } from "lodash/keys";
import { action, computed, extendObservable, observable, ObservableMap, observe, reaction, runInAction } from 'mobx';
import { IFormValueTransform, ItemConfig } from "../../../stores";
import getTransform, { TransformerType } from "../../../stores/ItemConfig/input/FormValueTransform";
import { CommonStore } from "../../../stores/ItemConfig/interface/CommonStore";
import { isNotEmptyArray, Utils } from "../../../utils";
import { EventEmitter } from "../../../utils/EventEmitter";
import { EventStoreInject } from "../../../stores/EventStore";
import { FormItemStore } from './FormItem';
export var ConfigKeys = ["$formStore"];
var GFormStore = /** @class */ (function (_super) {
    __extends(GFormStore, _super);
    function GFormStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GFormStore.disposedForm = function (form) {
        this.formMap.delete(form);
    };
    GFormStore.registerForm = function (form, instance, replace) {
        var formStore = this.formMap.get(form);
        if (!formStore) {
            formStore = replace || new FormStore();
            formStore.setForm(form, instance);
            // console.log('register form', form)
            this.formMap.set(form, formStore);
        }
        return formStore;
    };
    GFormStore.formMap = new WeakMap();
    return GFormStore;
}(CommonStore));
export { GFormStore };
var ItemConfigGroup = /** @class */ (function () {
    function ItemConfigGroup() {
        this.config = observable.array([]);
    }
    Object.defineProperty(ItemConfigGroup.prototype, "configList", {
        get: function () {
            return this.config.toJSON();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroup.prototype, "itemConfigConstructorMap", {
        get: function () {
            return this.config.reduce(function (obj, config) {
                var _a;
                return config.code ? Object.assign(obj, (_a = {},
                    _a[config.code] = config,
                    _a)) : obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroup.prototype, "itemCodeList", {
        get: function () {
            return getKeys(this.itemConfigConstructorMap);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroup.prototype, "itemCodeNameMap", {
        get: function () {
            return this.config.reduce(function (obj, config) {
                var _a;
                return config.nameCode ? Object.assign(obj, (_a = {},
                    _a[config.code] = config.nameCode,
                    _a)) : obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroup.prototype, "itemCodeNameList", {
        get: function () {
            return values(this.itemCodeNameMap);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigGroup.prototype.getConfig = function (code) {
        return this.configList.find(function (item) { return item.code === code; });
    };
    ItemConfigGroup.prototype.setConfigList = function (configList) {
        // console.log('setConfig', configList[8].options, this)
        this.config = observable.array(configList, { deep: false });
    };
    __decorate([
        observable.shallow,
        __metadata("design:type", Object)
    ], ItemConfigGroup.prototype, "config", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroup.prototype, "configList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroup.prototype, "itemConfigConstructorMap", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroup.prototype, "itemCodeList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroup.prototype, "itemCodeNameMap", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroup.prototype, "itemCodeNameList", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroup.prototype, "getConfig", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroup.prototype, "setConfigList", null);
    return ItemConfigGroup;
}());
export { ItemConfigGroup };
var FormStoreCore = /** @class */ (function (_super) {
    __extends(FormStoreCore, _super);
    function FormStoreCore(configList) {
        var _this = _super.call(this) || this;
        _this.configStore = new ItemConfigGroup();
        _this.configStore.setConfigList(configList || []);
        return _this;
    }
    __decorate([
        observable,
        __metadata("design:type", ItemConfigGroup)
    ], FormStoreCore.prototype, "configStore", void 0);
    return FormStoreCore;
}(GFormStore));
export { FormStoreCore };
var FormStore = /** @class */ (function (_super) {
    __extends(FormStore, _super);
    function FormStore(configList) {
        var _this = _super.call(this, configList) || this;
        _this.formSource = {};
        _this.formSourceTrack = [];
        _this.formMap = observable.map({}, { deep: false });
        _this.errorTack = [];
        _this.instance = {};
        _this.errorGroup = observable.map({}, { deep: false });
        _this.searchNameWatcher = {};
        // @observable formItemMap: ObservableMap<any, ICommonFormConfig> = observable.map({})
        // @computed.struct get formItemConfigMap() {
        //   return this.formItemMap.get(this.formSource) || {}
        // }
        _this.reactionAntdFormEmitter = new EventEmitter();
        _this.antdFormMap = observable.map({});
        _this.formItemStores = {};
        observe(_this.errorGroup, function (listener) {
            _this.errorTack.push(listener);
            console.log('this.errorGroup', _this.errorTack);
        });
        observe(_this.formMap, function (listener) {
            // const config = this.formItemConfigMap[listener.name]
            // console.log('this.formMap', listener, this.formSource, this.formItemConfigMap)
            // for (const key in this.formItemConfigMap) {
            //   const config = this.formItemConfigMap[key]
            //   console.log('update config', config, key, (listener.name))
            //   if (config instanceof ItemConfig) {
            //     config.form[listener.name] = (listener as any).newValue
            //     // break;
            //   }
            // }
        });
        reaction(function () { return _this.formMap; }, function () {
            console.log('this.formMap');
        });
        return _this;
    }
    FormStore_1 = FormStore;
    Object.defineProperty(FormStore.prototype, "lastFormSource", {
        get: function () {
            return this.formSourceTrack[this.formSourceTrack.length - 1] || this.formSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStore.prototype, "form", {
        get: function () {
            return extendObservable({}, this.formMap.toPOJO());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStore.prototype, "errors", {
        get: function () { return this.errorGroup.toPOJO(); },
        enumerable: true,
        configurable: true
    });
    FormStore.prototype.getErrors = function (itemKey) { return this.errorGroup.get(itemKey); };
    FormStore.prototype.hasErrors = function (itemKey) { return this.errorGroup.has(itemKey); };
    FormStore.prototype.updateError = function (itemKey, errors) {
        var _this = this;
        var nextError = isNotEmptyArray(errors) ? errors : null;
        if (!Utils.isEqual(this.errorGroup.get(itemKey), nextError, true)) {
            runInAction(function () { return nextError ? _this.errorGroup.set(itemKey, nextError) : _this.errorGroup.delete(itemKey); });
        }
    };
    FormStore.prototype.clearValidate = function () {
        this.errorGroup.clear();
    };
    FormStore.prototype.onItemChange = function (callback) {
        this.$on('onItemChange', callback, this);
    };
    FormStore.prototype.onItemChangeEmit = function (code, value) {
        this.$emit('onItemChange', code, value);
    };
    // @Memoize
    FormStore.prototype.patchFieldsChange = function (patch, path, callback) {
        var _this = this;
        var e_1, _a, _b;
        if (path === void 0) { path = []; }
        // console.log('patchFieldsChange', patch, this)
        var result = {};
        try {
            // debugger
            for (var _c = __values(Object.entries(patch)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], data = _e[1];
                if (Utils.isNotEmptyObject(data)) {
                    var nextpath = path.concat([key]);
                    var pathStr = nextpath.join('.');
                    if (Utils.isString(data.name) && data.name === pathStr) {
                        // validating 为ture表示正在校验，为false表示结束校验，空则代表不影响值变更
                        if (data.validating !== true) {
                            console.log('hasError', data.name, data, isNotEmptyArray(data.errors));
                            if (data.validating === false && (data.errors instanceof Array || data.errors === undefined)) {
                                this.updateError(data.name, data.errors);
                            }
                            this.registerKey(this.formSource, pathStr);
                        }
                        if (Utils.isFunction(callback)) {
                            Object.assign(result, callback(pathStr, data.value));
                        }
                        else {
                            var isChanged = this.setFormValueWithComponentSource(key, data.value);
                            Object.assign(result, (_b = {}, _b[key] = isChanged, _b));
                        }
                    }
                    else if (Utils.isNil(data.name)) {
                        var next = this.patchFieldsChange(data, nextpath, callback || (function (pathStr, value) {
                            var _a;
                            var isChanged = _this.setFormValueWithComponentSource(pathStr, value);
                            return _a = {}, _a[pathStr] = isChanged, _a; // 值不变
                        }));
                        Object.assign(result, next);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    Object.defineProperty(FormStore.prototype, "formValueTransform", {
        get: function () {
            var _this = this;
            return Utils.reduce(this.configStore.config, function (nextMap, i) {
                var key = i.code;
                var store = _this.formItemStores[key];
                return nextMap.set(key, (store && store.itemConfig.formValueTransform) || getTransform(key, i.type));
            }, new Map());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 将组件用value转换为表单用的value
     * @param key 完整code
     * @param value 值
     */
    FormStore.prototype.getV2FValue = function (key, value) {
        var transforms = this.formValueTransform.get(key);
        if (transforms) {
            return transforms.V2F(value, this.formSource);
        }
        return value;
    };
    /**
     * 将表单用value转换为组件用的value
     * @param key 完整code
     * @param value form值
     */
    FormStore.prototype.getF2VValue = function (key, value) {
        var transforms = this.formValueTransform.get(key);
        if (transforms) {
            return Utils.cloneDeep(transforms.F2V(value, Utils.cloneDeep(this.formSource)));
        }
        return value;
    };
    /**
     * store的form里记录的都是原始值
     * component使用的值是在使用时进行过转译
     * 然后在onchange时再将返回回来的组件用值转译为form值
     * @param code
     * @param value 原始值
     */
    FormStore.prototype.setFormValue = function (code, value) {
        var codeDeep = code.split('.');
        var key = codeDeep.shift();
        this.setFormValueBy(value, key, codeDeep.join('.'));
    };
    FormStore.prototype.getItemConfig = function (code) {
        return this.formItemStores[code].itemConfig;
    };
    FormStore.prototype.setFormValueWithComponentSource = function (code, value) {
        var codeDeep = code.split('.');
        var key = codeDeep.shift();
        return this.setFormValueBy(value, key, codeDeep.join('.'), TransformerType.V2F);
    };
    /**
     * 直接设置form的值
     * @param value 原始值
     * @param key 基础键
     * @param innerPath 深入键
     * @param transformerType 翻译器类型（不传则表示不翻译）
     */
    FormStore.prototype.setFormValueBy = function (value, key, innerPath, transformerType) {
        var isChanged;
        var nextValue;
        var pathStr = key;
        var transformer = transformerType === TransformerType.V2F ? this.getV2FValue : null;
        // const transformerReserval = transformerType === TransformerType.V2F ? this.getF2VValue : null
        if (Utils.isNotEmptyString(innerPath)) {
            pathStr += '.' + innerPath;
            var preObj = Utils.cloneDeep(this.formMap.get(key)) || {};
            // console.log(preObj)
            var obj = produce(preObj, function (i) {
                if (!Utils.isEqual(get(i, innerPath), value, true)) {
                    var toValue = transformer ? transformer(pathStr, value) : value;
                    set(i, innerPath, toValue);
                }
            });
            nextValue = obj;
            isChanged = obj !== preObj;
        }
        else {
            nextValue = transformer ? transformer(key, value) : value;
            isChanged = !Utils.isEqual(this.formSource[key], nextValue, true);
        }
        if (isChanged) {
            this.formSource[key] = nextValue;
            this.formMap.set(key, nextValue);
            this.onItemChangeEmit(pathStr, nextValue);
            // debugger
            var itemConfig = this.getItemConfig(pathStr);
            console.log('set', 'formMap', pathStr, value, nextValue, this.formSource, this.formItemStores, itemConfig);
            // this.setFormValueWithName(pathStr)
            var onChange = itemConfig.onChange;
            if (Utils.isFunction(onChange)) {
                onChange(nextValue);
            }
        }
        return isChanged;
    };
    FormStore.prototype.getValueWithName = function (code, nameCode) {
        var itemConfig = this.getItemConfig(code);
        var optionsStore = itemConfig.optionsStore;
        // debugger
        if (optionsStore && Utils.isNotEmptyString(nameCode) && nameCode !== code) {
            // this.reaction(() => optionsStore.selectedLablesStr, searchName => {
            //   console.log('get nameCode',  'formMap', optionsStore, optionsStore.selectedLables)
            //   set(this.formSource, nameCode, optionsStore.selectedLablesStr)
            // }, { fireImmediately: true })
            // this.searchNameWatcher[nameCode] = true
            // console.log('get nameCode',  'formMap', optionsStore, optionsStore.selectedLables)
            return optionsStore.selectedLablesStr;
        }
        return undefined;
    };
    // @action.bound setFormValueWithName(code: string) {
    // const nameCode = this.itemCodeNameMap[code]
    // set(this.formSource, nameCode, this.getValueWithName(code, nameCode))
    // }
    FormStore.prototype.validate = function (codeList) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (this.antdForm && this.antdForm.validateFields(codeList || this.configStore.itemCodeList, { force: true }))];
                    case 1:
                        r = _a.sent();
                        console.log('validate', r);
                        return [2 /*return*/, r];
                }
            });
        });
    };
    Object.defineProperty(FormStore.prototype, "allFormMap", {
        get: function () {
            return FormStore_1.formMap;
        },
        enumerable: true,
        configurable: true
    });
    FormStore.prototype.reactionAntdForm = function (callback) {
        var sub = this.reactionAntdFormEmitter.subscribe(function (antdForm) {
            // console.log('reactionAntdForm', sub)
            callback(antdForm);
            sub.unsubscribe();
        });
    };
    FormStore.prototype.receiveAntdForm = function (antdForm) {
        this.reactionAntdFormEmitter.emit(antdForm);
    };
    FormStore.prototype.setAntdForm = function (antdForm, code) {
        if (antdForm !== this.antdForm) {
            this.antdForm = antdForm;
        }
        if (code) {
            this.antdFormMap.set(code, antdForm);
        }
    };
    FormStore.prototype.registerItemStore = function (code) {
        // console.log('registerForm', form)
        // debugger
        this.formItemStores[code] = this.formItemStores[code] != null ? this.formItemStores[code] : new FormItemStore(this, code);
        // this.registerForm(this.formSource, code, this.formItemStores[code].itemConfig)
        return this.formItemStores[code];
    };
    // @action.bound registerForm(form: any, code: string, itemConfig: ItemConfig) {
    //   // console.log('registerForm', form)
    //   const keyMap: ICommonFormConfig = this.formItemMap.get(form) || {}
    //   if(keyMap[code] !== itemConfig){
    //     keyMap.$formStore = this
    //     keyMap[code] = itemConfig
    //     this.formItemMap.set(form, keyMap)
    //   }
    // }
    FormStore.prototype.setConfig = function (configList) {
        this.configStore.setConfigList(configList);
        this.registerFormKey(this.formSource);
        this.registerFormSourceListerner();
    };
    FormStore.prototype.setForm = function (form, instance) {
        // console.log('setForm', form, this.configList.length)]
        form = Utils.cloneDeep(form);
        this.mapToDiff(this.formMap, form);
        this.registerFormKey(form);
        this.formSource = form;
        this.instance = instance;
        this.clearValidate();
        this.registerFormSourceListerner();
    };
    FormStore.prototype.registerFormSourceListerner = function () {
        var _this = this;
        if (this.formSourceListerner) {
            this.formSourceListerner();
            this.formSourceListerner = null;
        }
        this.formSourceListerner = observe(this.formSource, function (listener) {
            console.log('this.formSource', listener);
            _this.formSourceTrack.push(_this.formSource);
        });
    };
    FormStore.prototype.replaceForm = function (formMap) {
        this.formMap = formMap;
    };
    FormStore.prototype.registerFormKey = function (target, deep) {
        var _this = this;
        var e_2, _a;
        if (deep === void 0) { deep = false; }
        try {
            for (var _b = __values(this.configStore.itemCodeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var code = _c.value;
                // console.log('registerKey', code)
                this.registerKey(target, code, deep);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var _loop_1 = function (code) {
            var nameCode = this_1.configStore.itemCodeNameMap[code];
            // console.log('registerKey', code)
            this_1.registerGet(target, nameCode, function () {
                return _this.getValueWithName(code, nameCode);
            });
        };
        var this_1 = this;
        for (var code in this.configStore.itemCodeNameMap) {
            _loop_1(code);
        }
        // }
        // this.registerGet(target, 'info.testt', () => {
        //   return '1'
        // })
        return;
    };
    var FormStore_1, _a;
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formSource", void 0);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], FormStore.prototype, "formSourceTrack", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "lastFormSource", null);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStore.prototype, "formMap", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "form", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Array)
    ], FormStore.prototype, "errorTack", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "instance", void 0);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStore.prototype, "errorGroup", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "errors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getErrors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "hasErrors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "updateError", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "clearValidate", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "onItemChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "onItemChangeEmit", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array, Object]),
        __metadata("design:returntype", Object)
    ], FormStore.prototype, "patchFieldsChange", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "formValueTransform", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getV2FValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getF2VValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setFormValue", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Boolean)
    ], FormStore.prototype, "setFormValueWithComponentSource", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, String, Number]),
        __metadata("design:returntype", Boolean)
    ], FormStore.prototype, "setFormValueBy", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getValueWithName", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FormStore.prototype, "validate", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "allFormMap", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "reactionAntdFormEmitter", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "reactionAntdForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "receiveAntdForm", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "antdForm", void 0);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStore.prototype, "antdFormMap", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setAntdForm", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formItemStores", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", typeof (_a = typeof FormItemStore !== "undefined" && FormItemStore) === "function" ? _a : Object)
    ], FormStore.prototype, "registerItemStore", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setConfig", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [ObservableMap]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "replaceForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "registerFormKey", null);
    FormStore = FormStore_1 = __decorate([
        EventStoreInject(['onItemChange']),
        __metadata("design:paramtypes", [Array])
    ], FormStore);
    return FormStore;
}(FormStoreCore));
export { FormStore };
//# sourceMappingURL=FormStore.js.map