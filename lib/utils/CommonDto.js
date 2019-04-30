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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var lodash_1 = require("lodash");
var mobx_1 = require("mobx");
var Utils_1 = require("./Utils");
var core_decorators_1 = require("core-decorators");
var CommonDto = /** @class */ (function () {
    /**
     * sourceDto
     */
    function CommonDto(dto) {
        var _this = this;
        this.$$___instance = {};
        this.getComputed = function (keyName) {
            return _this['_' + keyName];
        };
        this.$$___source_dto = dto;
        this.$$___instance = { dto: dto };
        var _loop_1 = function (key) {
            var _a, _b;
            var keyName = lodash_1.camelCase("set-" + key);
            mobx_1.extendObservable(this_1, (_a = {},
                Object.defineProperty(_a, key, {
                    get: function () {
                        return this.$$___source_dto[key];
                    },
                    enumerable: true,
                    configurable: true
                }),
                Object.defineProperty(_a, key, {
                    set: function (value) {
                        this.$$___source_dto[key] = value;
                    },
                    enumerable: true,
                    configurable: true
                }),
                _a[keyName] = function (value) {
                    // console.log(key, 'set', value, this.i.label)
                    // const r = this.i[key] = value
                    return Reflect.set(this.$$___source_dto, key, value);
                },
                _a), (_b = {},
                _b[keyName] = mobx_1.action.bound,
                _b), { deep: false });
        };
        var this_1 = this;
        for (var key in dto) {
            _loop_1(key);
        }
    }
    /**
     * get value by key
     * @param { string } keyName
     */
    CommonDto.prototype.get = function (keyNameStr, defaultValue, useCreater) {
        var e_1, _a;
        if (defaultValue === void 0) { defaultValue = undefined; }
        if (useCreater === void 0) { useCreater = true; }
        if (Utils_1.Utils.isNotEmptyString(keyNameStr)) {
            try {
                for (var _b = __values(keyNameStr.split('||')), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var keyName = _c.value;
                    var value = this.hasComputed(keyName)
                        ? this.getComputed(keyName)
                        : ((this[useCreater ? 'getAndCreateDeepPropertyByStr' : 'getPropertyByStr'])(keyName, defaultValue));
                    // 取到值之后创建缓存，确定路径已经存在了
                    if (Utils_1.Utils.isNotEmptyValue(value)) {
                        this.setSafeComputed(keyName);
                        return value;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    /**
     * 创建缓存，使用安全方法
     * @param { string } keyName
     */
    CommonDto.prototype.createComputed = function (keyName) {
        var _a;
        return mobx_1.extendObservable(this, (_a = {},
            Object.defineProperty(_a, '_' + keyName, {
                get: function () {
                    return this.getPropertyByStr(keyName);
                },
                enumerable: true,
                configurable: true
            }),
            _a));
    };
    /**
     * 是否已创建缓存
     * @param { string } keyName
     */
    CommonDto.prototype.hasComputed = function (keyName) {
        return !Utils_1.Utils.isNil(Reflect.getOwnPropertyDescriptor(this, '_' + keyName));
    };
    ;
    CommonDto.prototype.setSafeComputed = function (keyName) {
        return !this.hasComputed(keyName) && this.createComputed(keyName);
    };
    CommonDto.prototype.setLastValue = function (keyName, value) {
        var lastValueKey = "$$$_last_$__" + keyName;
        if (Utils_1.Utils.isEqual(value, this[lastValueKey])) {
            return false;
        }
        else {
            this[lastValueKey] = value;
            return true;
        }
    };
    /**
     * 设置值
     * @param { string } keyName
     * @param { * } value
     * @param { boolean } isSafe 安全模式
     */
    CommonDto.prototype.set = function (keyName, value, isSafe) {
        if (value === void 0) { value = undefined; }
        if (isSafe === void 0) { isSafe = false; }
        // console.log('set', keyName, value)
        if (!this.setLastValue(keyName, value)) {
            // console.log('值没有发生变化，set失败', keyName, value)
            return false;
        }
        else {
            if (!isSafe && value === this.getAndCreateDeepPropertyByStr(keyName, value)) {
                // 取到值之后创建缓存，确定路径已经存在了
                return true;
            }
            this.setSafeComputed(keyName);
            return this.setPropertyByStr(keyName, value);
        }
    };
    /**
     *
     * @param { string } keyStr 指针地址
     * @param { * } defaultValue 没有取到值时默认返回并为该指针所赋的值
     */
    CommonDto.prototype.getAndCreateDeepPropertyByStr = function (keyStr, defaultValue) {
        if (Utils_1.Utils.isNil(keyStr)) {
            // debugger
            return defaultValue;
        }
        if (!Utils_1.Utils.isEmptyValue(keyStr)) {
            var express = Utils_1.Utils.getExpressByStr(keyStr, defaultValue);
            // console.log(this.$$___source_dto, keyStr, express, Reflect.apply(Utils.getInnerWarpField, this, [this.$$___source_dto, ...express]))
            return Utils_1.Utils.getPropertyFieldByCreate.apply(Utils_1.Utils, __spread([this.$$___source_dto], express));
            // return Utils.getPropByPath(this.$$___source_dto, keyStr, false).v
        }
        return defaultValue;
    };
    /**
     * 根据字符串解析指针，如果没有值或解析不正确则返回undefined
     * @param { string } keyName 例: a.b[0].c
     * @param { * } defaultValue 任何
     */
    CommonDto.prototype.getPropertyByStr = function (keyName, defaultValue) {
        var value = lodash_1.property(keyName)(this.$$___source_dto);
        return Utils_1.Utils.isEmptyValue(value) ? defaultValue : value;
    };
    CommonDto.prototype.setPropertyByStr = function (keyName, value) {
        var dto = this.$$___source_dto;
        console.warn(dto);
        var str = "dto." + keyName + " = " + (Utils_1.Utils.isEmptyValue(value) ? "undefined" : (!Utils_1.Utils.isString(value) ? JSON.stringify(value) : "\"" + value + "\"") + ";");
        try {
            eval(str);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    CommonDto.prototype.export = function () {
        return this.$$___source_dto;
    };
    CommonDto.prototype.clone = function () {
        return lodash_1.cloneDeep(this.$$___source_dto);
    };
    CommonDto.prototype.equals = function (dto, deep) {
        if (deep === void 0) { deep = false; }
        return deep ? lodash_1.isEqual(dto, this.$$___source_dto) : this.$$___source_dto === dto;
    };
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Object)
    ], CommonDto.prototype, "$$___source_dto", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "get", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "createComputed", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "hasComputed", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "setSafeComputed", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "setLastValue", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "set", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "getAndCreateDeepPropertyByStr", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "getPropertyByStr", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], CommonDto.prototype, "setPropertyByStr", null);
    return CommonDto;
}());
exports.CommonDto = CommonDto;
exports.default = CommonDto;
