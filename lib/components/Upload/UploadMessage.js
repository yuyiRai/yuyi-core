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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
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
        mobx_1.observable,
        __metadata("design:type", Number)
    ], UploadProgressStore.prototype, "persent", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], UploadProgressStore.prototype, "setPersent", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], UploadProgressStore.prototype, "progressText", null);
    return UploadProgressStore;
}());
exports.UploadProgressStore = UploadProgressStore;
exports.UploadMessage = mobx_react_1.observer(function (_a) {
    var store = _a.store, file = _a.file;
    return react_1.default.createElement("p", { style: { textAlign: 'left' } },
        file && file.name,
        " ",
        store.progressText);
});
exports.default = exports.UploadMessage;
