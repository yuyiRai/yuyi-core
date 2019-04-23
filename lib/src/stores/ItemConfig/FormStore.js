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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var mobx_1 = require("mobx");
var Utils_1 = require("../../utils/Utils");
var FormStore = /** @class */ (function () {
    function FormStore() {
        this.formMap = mobx_1.observable.map({});
    }
    FormStore.registerForm = function (form) {
        var formStore = this.formMap.get(form);
        if (!formStore) {
            formStore = new FormStore();
            formStore.setForm(form);
            // console.log('register form', form)
            this.formMap.set(form, formStore);
        }
        return formStore;
    };
    Object.defineProperty(FormStore.prototype, "form", {
        get: function () {
            return mobx_1.extendObservable({}, this.formMap.toPOJO());
        },
        enumerable: true,
        configurable: true
    });
    FormStore.prototype.setForm = function (form) {
        var _this = this;
        // this.formMap.replace(form)
        var push = lodash_1.difference(lodash_1.keys(form), lodash_1.toArray(this.formMap.keys()));
        lodash_1.forEach(lodash_1.toArray(this.formMap), function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            if (lodash_1.isNil(form[key]))
                _this.formMap.delete(key);
            else if (!Utils_1.Utils.isEqual(form[key], value)) {
                _this.formMap.set(key, form[key]);
            }
        });
        lodash_1.forEach(push, function (key) {
            _this.formMap.set(key, form[key]);
        });
        // this.form = form;
    };
    FormStore.prototype.replaceForm = function (formMap) {
        this.formMap = formMap;
    };
    FormStore.formMap = new WeakMap();
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "form", null);
    __decorate([
        mobx_1.observable.shallow,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formMap", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setForm", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [mobx_1.ObservableMap]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "replaceForm", null);
    return FormStore;
}());
exports.FormStore = FormStore;
//# sourceMappingURL=FormStore.js.map