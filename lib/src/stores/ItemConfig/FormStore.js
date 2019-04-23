var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { difference, keys, forEach, toArray, isNil } from 'lodash';
import { action, computed, extendObservable, observable, ObservableMap } from 'mobx';
import { Utils } from '../../utils/Utils';
var FormStore = /** @class */ (function () {
    function FormStore() {
        this.formMap = observable.map({});
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
            return extendObservable({}, this.formMap.toPOJO());
        },
        enumerable: true,
        configurable: true
    });
    FormStore.prototype.setForm = function (form) {
        var _this = this;
        // this.formMap.replace(form)
        var push = difference(keys(form), toArray(this.formMap.keys()));
        forEach(toArray(this.formMap), function (_a) {
            var key = _a[0], value = _a[1];
            if (isNil(form[key]))
                _this.formMap.delete(key);
            else if (!Utils.isEqual(form[key], value)) {
                _this.formMap.set(key, form[key]);
            }
        });
        forEach(push, function (key) {
            _this.formMap.set(key, form[key]);
        });
        // this.form = form;
    };
    FormStore.prototype.replaceForm = function (formMap) {
        this.formMap = formMap;
    };
    FormStore.formMap = new WeakMap();
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStore.prototype, "form", null);
    __decorate([
        observable.shallow,
        __metadata("design:type", Object)
    ], FormStore.prototype, "formMap", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "setForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [ObservableMap]),
        __metadata("design:returntype", void 0)
    ], FormStore.prototype, "replaceForm", null);
    return FormStore;
}());
export { FormStore };
//# sourceMappingURL=FormStore.js.map