"use strict";
/* eslint-disable */
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
Object.defineProperty(exports, "__esModule", { value: true });
const core_decorators_1 = require("core-decorators");
const lodash_1 = require("lodash");
const mobx_1 = require("mobx");
const Utils_1 = require("./Utils");
class AsyncLoadProperty {
    constructor(type, getter, defaultValue = null, timeBuffer = 0) {
        this.loading = true;
        this.getterFunc = () => this.defaultValue;
        this.timeBuffer = 0;
        this.emitter = null;
        this.getValue = (param) => {
            if (param === this.lastParam) {
                return this.currentValue;
            }
            this.lastParam = param;
            this.valueGetter(param);
            return this.defaultValue;
        };
        this.type = type;
        this.reset(defaultValue, true);
        if (timeBuffer > 0) {
            this.timeBuffer = timeBuffer;
        }
        this.registerGetter(getter);
        // reaction(() => this.loading, loading => {
        //   console.log('loading change', loading)
        // }, { fireImmediately: true })
        // reaction(() => this.isInited, value => {
        //   console.log('初始化状态变更', value)
        // }, { fireImmediately: true })
        // reaction(() => this.currentValue, value => {
        //   console.log('value change', value)
        // })
    }
    reset(nextDefaultValue, force) {
        if (this.isTypedValue(nextDefaultValue)) {
            this.defaultValue = nextDefaultValue;
            this.currentValue = this.defaultValue;
            this.isInited = false;
        }
        else if (force) {
            this.isInited = false;
        }
        return this;
    }
    updateValue(nextValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield nextValue;
            if (this.isTypedValue(value)) {
                this.currentValue = value;
                if (!this.isInited) {
                    this.isInited = true;
                }
                this.loadingEnd();
            }
        });
    }
    registerGetter(getter) {
        this.getterFunc = Utils_1.Utils.isFunctionFilter(getter, this.getterFunc);
    }
    get valueGetter() {
        if (this.timeBuffer > 0) {
            const emitter = Utils_1.Utils.createSimpleTimeBufferInput((resList) => {
                this.updateValue(this.getterFunc(lodash_1.last(resList)));
            }, this, this.timeBuffer, true);
            return mobx_1.action((param) => {
                mobx_1.runInAction(() => __awaiter(this, void 0, void 0, function* () {
                    this.loadingStart();
                    return emitter(param);
                }));
            });
        }
        return mobx_1.action((param) => {
            mobx_1.runInAction(() => {
                this.loadingStart();
                this.updateValue(this.getterFunc(param));
            });
        });
    }
    loadingStart() {
        if (!this.loading)
            this.loading = true;
    }
    loadingEnd() {
        if (this.loading)
            this.loading = false;
    }
    isTypedValue(value) {
        if (value == null) {
            return true;
        }
        else if (Utils_1.Utils.isFunction(this.type)) {
            return this.type(value);
        }
        else {
            const { type } = this;
            switch (type) {
                case String: return Utils_1.Utils.isString(value);
                case Boolean: return Utils_1.Utils.isBoolean(value);
                case Array: return Utils_1.Utils.isArray(value);
                case Number: return Utils_1.Utils.isNumber(value);
                default: return value instanceof type;
            }
        }
    }
}
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "type", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "defaultValue", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "currentValue", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "loading", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Boolean)
], AsyncLoadProperty.prototype, "isInited", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Function)
], AsyncLoadProperty.prototype, "getterFunc", void 0);
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], AsyncLoadProperty.prototype, "emitter", void 0);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "reset", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AsyncLoadProperty.prototype, "updateValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "registerGetter", null);
__decorate([
    mobx_1.computed.struct,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], AsyncLoadProperty.prototype, "valueGetter", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "loadingStart", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "loadingEnd", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncLoadProperty.prototype, "isTypedValue", null);
exports.AsyncLoadProperty = AsyncLoadProperty;
/**
 * @return { PropertyDecorator }
 */
function asyncComputed({ type, defaultValue, watcher, time }) {
    /**
     * @type {PropertyDecorator}
     * @param { * } target
     * @param { string } propertyName
     * @param { PropertyDescriptor } descriptor
     */
    function Async(target, propertyName, descriptor) {
        const asyncName = `$${propertyName}Async`;
        const { get: getter } = descriptor;
        if (getter) {
            descriptor.get = function () {
                let sourceInstance = this;
                if (!this[asyncName]) {
                    const asyncNpm = new AsyncLoadProperty(type, () => Reflect.apply(getter, sourceInstance, []), defaultValue, time);
                    mobx_1.extendObservable(this, {
                        get [asyncName]() {
                            return asyncNpm;
                        }
                    });
                    if (!Utils_1.Utils.isNil(watcher)) {
                        mobx_1.reaction(() => this[watcher], trigger => {
                            this[asyncName].reset(asyncNpm.currentValue).getValue(trigger);
                        }, { fireImmediately: true });
                    }
                }
                return this[asyncName].getValue(this[watcher]);
            };
        }
        return mobx_1.computed.struct(target, propertyName, descriptor);
    }
    return Async;
}
exports.asyncComputed = asyncComputed;
//# sourceMappingURL=AsyncProperty.js.map