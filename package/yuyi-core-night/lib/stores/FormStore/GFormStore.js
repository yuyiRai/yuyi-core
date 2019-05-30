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
import { CommonStore } from "../ItemConfig/interface/CommonStore";
import { FormStore } from './FormStore';
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
            formStore.setForm(form);
            // console.log('register form', form)
            this.formMap.set(form, formStore);
        }
        return formStore;
    };
    GFormStore.formMap = new WeakMap();
    return GFormStore;
}(CommonStore));
export { GFormStore };
//# sourceMappingURL=GFormStore.js.map