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
/* eslint-disable */
const lodash_1 = require("lodash");
const mobx_1 = require("mobx");
const Utils_1 = require("./Utils");
class CommonDto {
    /**
     * sourceDto
     */
    constructor(dto) {
        /**
         * 是否已创建缓存
         * @param { string } keyName
         */
        this.hasComputed = (keyName) => {
            return !Utils_1.Utils.isNil(Reflect.getOwnPropertyDescriptor(this, '_' + keyName));
        };
        this.getComputed = (keyName) => {
            return this['_' + keyName];
        };
        this.$$___source_dto = dto;
        this.$$___instance = { dto };
        for (const key in dto) {
            const keyName = _.camelCase("set-" + key);
            mobx_1.extendObservable(this, {
                get [key]() {
                    return this.$$___source_dto[key];
                },
                set [key](value) {
                    return this.$$___source_dto[key] = value;
                },
                [keyName](value) {
                    // console.log(key, 'set', value, this.i.label)
                    // const r = this.i[key] = value
                    return Reflect.set(this.$$___source_dto, key, value);
                }
            }, {
                [keyName]: mobx_1.action.bound
            }, { deep: false });
        }
    }
    /**
     * get value by key
     * @param { string } keyName
     */
    get(keyNameStr, defaultValue = undefined, useCreater = true) {
        if (Utils_1.Utils.isNotEmptyString(keyNameStr)) {
            for (let keyName of keyNameStr.split('||')) {
                const value = this.hasComputed(keyName)
                    ? this.getComputed(keyName)
                    : ((this[useCreater ? 'getAndCreateDeepPropertyByStr' : 'getPropertyByStr'])(keyName, defaultValue));
                // 取到值之后创建缓存，确定路径已经存在了
                if (Utils_1.Utils.isNotEmptyValue(value)) {
                    this.setSafeComputed(keyName);
                    return value;
                }
            }
        }
    }
    /**
     * 创建缓存，使用安全方法
     * @param { string } keyName
     */
    createComputed(keyName) {
        return mobx_1.extendObservable(this, {
            get ['_' + keyName]() {
                return this.getPropertyByStr(keyName);
            }
        });
    }
    setSafeComputed(keyName) {
        return !this.hasComputed(keyName) && this.createComputed(keyName);
    }
    setLastValue(keyName, value) {
        const lastValueKey = `$$$_last_$__${keyName}`;
        if (Utils_1.Utils.isEqual(value, this[lastValueKey])) {
            return false;
        }
        else {
            this[lastValueKey] = value;
            return true;
        }
    }
    /**
     * 设置值
     * @param { string } keyName
     * @param { * } value
     * @param { boolean } isSafe 安全模式
     */
    set(keyName, value = undefined, isSafe = false) {
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
    }
    /**
     *
     * @param { string } keyStr 指针地址
     * @param { * } defaultValue 没有取到值时默认返回并为该指针所赋的值
     */
    getAndCreateDeepPropertyByStr(keyStr, defaultValue) {
        if (Utils_1.Utils.isNil(keyStr)) {
            // debugger
            return defaultValue;
        }
        if (!Utils_1.Utils.isEmptyValue(keyStr)) {
            const express = Utils_1.Utils.getExpressByStr(keyStr, defaultValue);
            // console.log(this.$$___source_dto, keyStr, express, Reflect.apply(Utils.getInnerWarpField, this, [this.$$___source_dto, ...express]))
            return Utils_1.Utils.getPropertyFieldByCreate(this.$$___source_dto, ...express);
            // return Utils.getPropByPath(this.$$___source_dto, keyStr, false).v
        }
        return defaultValue;
    }
    /**
     * 根据字符串解析指针，如果没有值或解析不正确则返回undefined
     * @param { string } keyName 例: a.b[0].c
     * @param { * } defaultValue 任何
     */
    getPropertyByStr(keyName, defaultValue) {
        const value = lodash_1.property(keyName)(this.$$___source_dto);
        return Utils_1.Utils.isEmptyValue(value) ? defaultValue : value;
    }
    setPropertyByStr(keyName, value) {
        const dto = this.$$___source_dto;
        const str = `dto.${keyName} = ${Utils_1.Utils.isEmptyValue(value) ? `undefined` : `${!Utils_1.Utils.isString(value) ? JSON.stringify(value) : `"${value}"`};`}`;
        try {
            eval(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    export() {
        return this.$$___source_dto;
    }
    clone() {
        return lodash_1.cloneDeep(this.$$___source_dto);
    }
    equals(dto, deep = false) {
        return deep ? lodash_1.isEqual(dto, this.$$___source_dto) : this.$$___source_dto === dto;
    }
}
__decorate([
    mobx_1.observable.ref,
    __metadata("design:type", Object)
], CommonDto.prototype, "$$___source_dto", void 0);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "get", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "createComputed", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "setSafeComputed", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "setLastValue", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "set", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "getAndCreateDeepPropertyByStr", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "getPropertyByStr", null);
__decorate([
    mobx_1.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonDto.prototype, "setPropertyByStr", null);
exports.default = CommonDto;
exports.CommonDto = CommonDto;
//# sourceMappingURL=CommonDto.js.map