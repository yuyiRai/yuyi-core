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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var AppStore = /** @class */ (function () {
    function AppStore() {
        var _this = this;
        this.list = utils_1.Utils.observable.array([]);
        this.model = {};
        this.watch = function (model) {
            if (model === void 0) { model = _this.model; }
            return model[123];
        };
        utils_1.Utils.observe(this.model, console.log);
    }
    Object.defineProperty(AppStore.prototype, "displayList", {
        get: function () {
            return this.list.map(function (i) { return ({ i: i }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "first", {
        get: function () {
            console.log('get first');
            return this.displayList[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "second", {
        get: function () {
            console.log('get second');
            return this.displayList[1];
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.push = function (i) {
        this.list.push(i);
    };
    __decorate([
        utils_1.Utils.observable.shallow,
        __metadata("design:type", Object)
    ], AppStore.prototype, "list", void 0);
    __decorate([
        utils_1.Utils.observable,
        __metadata("design:type", Object)
    ], AppStore.prototype, "model", void 0);
    __decorate([
        utils_1.Utils.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], AppStore.prototype, "displayList", null);
    __decorate([
        utils_1.Utils.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], AppStore.prototype, "first", null);
    __decorate([
        utils_1.Utils.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], AppStore.prototype, "second", null);
    __decorate([
        utils_1.Utils.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AppStore.prototype, "push", null);
    return AppStore;
}());
exports.AppStore = AppStore;
window.AppStore = AppStore;
window.appstore = new AppStore();
