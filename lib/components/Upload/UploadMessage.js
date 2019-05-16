var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
var UploadProgressStore = /** @class */ (function () {
    function UploadProgressStore() {
        this.persent = 0;
    }
    UploadProgressStore.prototype.setPersent = function (p) {
        this.persent = p;
    };
    Object.defineProperty(UploadProgressStore.prototype, "progressText", {
        get: function () {
            return "(" + this.persent + "%)";
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable,
        __metadata("design:type", Number)
    ], UploadProgressStore.prototype, "persent", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], UploadProgressStore.prototype, "setPersent", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], UploadProgressStore.prototype, "progressText", null);
    return UploadProgressStore;
}());
export { UploadProgressStore };
export var UploadMessage = observer(function (_a) {
    var store = _a.store, file = _a.file;
    return React.createElement("p", { style: __$hoisted_o0 },
        file && file.name,
        " ",
        store.progressText);
});
export default UploadMessage;
var __$hoisted_o0 = { textAlign: 'left' };
//# sourceMappingURL=UploadMessage.js.map