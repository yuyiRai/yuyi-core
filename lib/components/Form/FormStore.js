"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var mobx_1 = require("mobx");
var utils_1 = require("../../utils");
var lodash_decorators_1 = require("lodash-decorators");
var core_decorators_1 = require("core-decorators");
var immer_1 = __importDefault(require("immer"));
var stores_1 = require("../../stores");
var FormItem_1 = require("./FormItem");
var EventEmitter_1 = require("../../utils/EventEmitter");
var GFormStore = /** @class */ (function () {
    function GFormStore() {
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
}());
exports.GFormStore = GFormStore;
var FormStore = /** @class */ (function (_super) {
    __extends(FormStore, _super);
    function FormStore() {
        var _this = _super.call(this) || this;
        _this.formSource = {};
        _this.formSourceTrack = [];
        _this.formMap = mobx_1.observable.map({}, { deep: false });
        _this.errorTack = [];
        _this.instance = {};
        _this.errorGroup = mobx_1.observable.map({}, { deep: false });
        _this.config = mobx_1.observable.array([]);
        _this.formItemMap = mobx_1.observable.map({});
        _this.reactionAntdFormEmitter = new EventEmitter_1.EventEmitter();
        _this.antdFormMap = mobx_1.observable.map({});
        _this.formItemStores = {};
        mobx_1.observe(_this.errorGroup, function (listener) {
            _this.errorTack.push(listener);
            console.log('this.errorGroup', _this.errorTack);
        });
        mobx_1.observe(_this.formMap, function (listener) {
            // const config = this.formItemConfigMap[listener.name]
            console.log('this.formMap', listener, _this.formSource, _this.formItemConfigMap);
            // for (const key in this.formItemConfigMap) {
            //   const config = this.formItemConfigMap[key]
            //   console.log('update config', config, key, (listener.name))
            //   if (config instanceof ItemConfig) {
            //     config.form[listener.name] = (listener as any).newValue
            //     // break;
            //   }
            // }
        });
        mobx_1.reaction(function () { return _this.formMap; }, function () {
            console.log('this.formMap');
        });
        return _this;
    }
    Object.defineProperty(FormStore.prototype, "lastFormSource", {
        get: function () {
            return this.formSourceTrack[this.formSourceTrack.length - 1] || this.formSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStore.prototype, "form", {
        get: function () {
            return mobx_1.extendObservable({}, this.formMap.toPOJO());
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
        var nextError = utils_1.isNotEmptyArray(errors) ? errors : null;
        if (!utils_1.Utils.isEqual(this.errorGroup.get(itemKey), nextError, true)) {
            mobx_1.runInAction(function () { return nextError ? _this.errorGroup.set(itemKey, nextError) : _this.errorGroup.delete(itemKey); });
        }
    };
    FormStore.prototype.clearValidate = function () {
        this.errorGroup.clear();
    };
    Object.defineProperty(FormStore.prototype, "configList", {
        get: function () {
            return this.config.toJSON();
        },
        enumerable: true,
        configurable: true
    });
    // @Memoize
    FormStore.prototype.patchFieldsChange = function (patch, path, callback) {
        var _this = this;
        var e_1, _a;
        if (path === void 0) { path = []; }
        var result = {};
        var _loop_1 = function (key, data) {
            var _a;
            var nextpath = path.concat([key]);
            var pathStr = nextpath.join('.');
            if (data.name === pathStr) {
                // this.formMap.set(pathStr, data.value)
                // this.formSource[key] = data.value
                if (data.validating !== true) {
                    // console.log('hasError', data.validating, data.errors, isNotEmptyArray(data.errors))
                    var isValidResult = data.validating === false;
                    registerKey(this_1.formSource, pathStr);
                    if (utils_1.Utils.isFunction(callback)) {
                        Object.assign(result, callback(pathStr, data, isValidResult));
                    }
                    else {
                        if (isValidResult) {
                            // this.errorGroup.set(key, isNotEmptyArray(data.errors) ? data.errors : null)
                            this_1.updateError(key, data.errors);
                        }
                        var isChanged = !utils_1.Utils.isEqual(this_1.formSource[key], data.value, true);
                        if (isChanged) {
                            // console.log('patchFieldsChange', key, this.formSource[key], data.value, this)
                            this_1.formSource[key] = data.value;
                            this_1.formMap.set(key, data.value);
                            console.log('set', 'formMap', this_1.formSource, this_1.formItemStores);
                            // for(const key of (this.formItemStores as any)) {
                            //   console.log(key)
                            //   const a: FormItemStore = key
                            //   // a &&a.itemConfig && a.itemConfig.setForm(this.formSource)
                            // }
                        }
                        Object.assign(result, (_a = {}, _a[key] = isChanged, _a));
                    }
                }
            }
            else {
                var next = this_1.patchFieldsChange(data, nextpath, callback || (function (pathStr, _a, isValidResult) {
                    var _b, _c;
                    var value = _a.value, errors = _a.errors;
                    var preObj = _this.formMap.get(key) || {};
                    var innerPath = pathStr.replace(key + '.', '');
                    var obj = immer_1.default(preObj, function (i) {
                        if (!utils_1.Utils.isEqual(lodash_1.get(i, innerPath), value, true)) {
                            lodash_1.set(i, innerPath, value);
                        }
                    });
                    if (isValidResult) {
                        // this.errorGroup.set(pathStr, isNotEmptyArray(errors) ? errors : null)
                        _this.updateError(pathStr, errors);
                    }
                    if (obj !== preObj) {
                        lodash_1.set(_this.formSource, key, obj);
                        _this.formMap.set(key, obj);
                        // console.log('patchFieldsChange inner', pathStr, obj, value, this)
                        return _b = {}, _b[pathStr] = true, _b; // 确认修改
                    }
                    return _c = {}, _c[pathStr] = false, _c; // 值不变
                }));
                Object.assign(result, next);
            }
        };
        var this_1 = this;
        try {
            // debugger
            for (var _b = __values(Object.entries(patch)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], data = _d[1];
                _loop_1(key, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    FormStore.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.antdForm];
                    case 1:
                        r = (_a.sent()) && this.antdForm.validateFields(this.configList.map(function (i) { return i.code; }), { force: true });
                        console.log(r);
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(FormStore.prototype, "allFormMap", {
        get: function () {
            return FormStore.formMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStore.prototype, "formItemConfigMap", {
        get: function () {
            return this.formItemMap.get(this.formSource) || {};
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
        this.formItemStores[code] = this.formItemStores[code] || new FormItem_1.FormItemStore(this, code);
        this.registerForm(this.formSource, code, this.formItemStores[code].itemConfig);
        return this.formItemStores[code];
    };
    FormStore.prototype.registerForm = function (form, code, itemConfig) {
        // console.log('registerForm', form)
        var keyMap = this.formItemMap.get(form) || {};
        if (keyMap[code] !== itemConfig) {
            keyMap.$formStore = this;
            keyMap[code] = itemConfig;
            this.formItemMap.set(form, keyMap);
        }
    };
    FormStore.prototype.getConfig = function (code) {
        return this.configList.find(function (item) { return item.code === code; });
    };
    FormStore.prototype.setForm = function (form, instance) {
        console.log('setForm', form, this.configList.length);
        mapToDiff(this.formMap, form);
        this.registerKey(form);
        this.formSource = form;
        this.instance = instance;
        this.clearValidate();
        this.registerFormSourceListerner();
    };
    FormStore.prototype.setConfig = function (configList) {
        console.log('setConfig', configList);
        this.config = mobx_1.observable.array(configList, { deep: false });
        this.registerKey(this.formSource);
        this.registerFormSourceListerner();
    };
    FormStore.prototype.registerFormSourceListerner = function () {
        var _this = this;
        if (this.formSourceListerner) {
            this.formSourceListerner();
        }
        this.formSourceListerner = mobx_1.observe(this.formSource, function (listener) {
            // console.log('this.formSource', listener)
            _this.formSourceTrack.push(_this.formSource);
        });
    };
    FormStore.prototype.replaceForm = function (formMap) {
        this.formMap = formMap;
    };
    FormStore.prototype.registerKey = function (target, deep) {
        var e_2, _a;
        if (deep === void 0) { deep = false; }
        try {
            // debugger
            for (var _b = __values(this.configList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var config = _c.value;
                console.log('registerKey', config.code);
                registerKey(target, config.code, deep);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return;
    };
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formSource", void 0);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Array)
    ], FormStore.prototype, "formSourceTrack", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "lastFormSource", null);
    __decorate([
        mobx_1.observable.shallow,
        __metadata("design:type", mobx_1.ObservableMap)
    ], FormStore.prototype, "formMap", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "form", null);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Array)
    ], FormStore.prototype, "errorTack", void 0);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "instance", void 0);
    __decorate([
        mobx_1.observable.shallow,
        __metadata("design:type", mobx_1.ObservableMap)
    ], FormStore.prototype, "errorGroup", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "errors", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getErrors", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "hasErrors", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "updateError", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "clearValidate", null);
    __decorate([
        mobx_1.observable.shallow,
        __metadata("design:type", Object)
    ], FormStore.prototype, "config", void 0);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "configList", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array, Object]),
        __metadata("design:returntype", Object)
    ], FormStore.prototype, "patchFieldsChange", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FormStore.prototype, "validate", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "allFormMap", null);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", mobx_1.ObservableMap)
    ], FormStore.prototype, "formItemMap", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "formItemConfigMap", null);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "reactionAntdFormEmitter", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "reactionAntdForm", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "receiveAntdForm", null);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Object)
    ], FormStore.prototype, "antdForm", void 0);
    __decorate([
        mobx_1.observable.shallow,
        __metadata("design:type", mobx_1.ObservableMap)
    ], FormStore.prototype, "antdFormMap", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setAntdForm", null);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formItemStores", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", FormItem_1.FormItemStore)
    ], FormStore.prototype, "registerItemStore", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, stores_1.ItemConfig]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "registerForm", null);
    __decorate([
        lodash_decorators_1.Memoize,
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "getConfig", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setForm", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setConfig", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [mobx_1.ObservableMap]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "replaceForm", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "registerKey", null);
    return FormStore;
}(GFormStore));
exports.FormStore = FormStore;
function mapToDiff(map, form) {
    var push = lodash_1.difference(lodash_1.keys(form), lodash_1.toArray(map.keys()));
    lodash_1.forEach(lodash_1.toArray(map), function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (lodash_1.isNil(form[key]))
            map.delete(key);
        else if (!utils_1.Utils.isEqual(form[key], value)) {
            map.set(key, form[key]);
        }
    });
    lodash_1.forEach(push, function (key) {
        map.set(key, form[key]);
    });
    return map;
}
exports.mapToDiff = mapToDiff;
function registerKey(target, key, deep) {
    if (deep === void 0) { deep = false; }
    var keyDeep = key.split('.');
    // const coreKey = `$$core_${keyDeep[0]}`;
    var defaultV = lodash_1.get(target, keyDeep[0], null);
    var d = (deep ? mobx_1.observable : mobx_1.observable.ref);
    d(target, keyDeep[0], { value: defaultV, enumerable: false, configurable: true });
    // computed.struct(target, keyDeep[0], {
    //   get() { return get(this, coreKey) },
    //   set(value) { set(this, coreKey, value) }
    // })
    // console.log('registerKey', target, key);
}
exports.registerKey = registerKey;
