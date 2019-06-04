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
import { Utils } from "../../utils";
import { autobind } from 'core-decorators';
import produce from 'immer';
import { action, computed, get, observable, set, toJS } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CommonStore } from '../ItemConfig/interface';
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(list, transformer, strict) {
        if (strict === void 0) { strict = true; }
        var _this = _super.call(this) || this;
        _this.transformList = observable.array([], { name: 'transform list', deep: true });
        _this.model = {};
        _this.keyList = [];
        _this.strict = false;
        _this.watcherList = [];
        _this.lastSnapshots = [];
        _this.onArrayChange = null;
        _this.strict = strict;
        _this.setList(list);
        _this.setTransformer(transformer);
        _this.setWatcher();
        return _this;
    }
    List.prototype.setList = function (list) {
        this.originalList = observable.array(Utils.isArrayFilter(list) || [], { name: 'original list', deep: true });
    };
    /**
     * 当数组成员变更
     * @param response
     */
    List.prototype.onChangeResponse = function (_a) {
        var _b = __read(_a, 2), orginItem = _b[0], index = _b[1];
        // console.log('onChangeResponse', index)
        if (!Utils.isEqual(this.lastSnapshots[index], orginItem, true)) {
            this.onArrayChangeHandler('item change', index, orginItem, this.lastSnapshots[index]);
            set(this.transformList, index, Utils.isNil(orginItem) ? undefined : this.customTransformer(orginItem));
            this.lastSnapshots[index] = this.getOriginalValue(index);
            return true;
        }
        return false;
    };
    Object.defineProperty(List.prototype, "watcherLength", {
        get: function () {
            return this.watcherList.length;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.setWatcher = function () {
        var _this = this;
        return this.reaction(function () { return _this.originalList.length; }, function (length) {
            // console.log('this.originalList.length', length)
            /**
             * 保持数组长度和监听器数组一致
             */
            while (_this.watcherList.length > length) {
                _this.watcherList.pop()();
                _this.keyList.pop();
                _this.transformList.pop();
            }
            var _loop_1 = function () {
                var index = _this.watcherList.length;
                /**
                 * 根据严格模式判断是否使用时间缓冲流
                 */
                var callback = _this.strict
                    ? function (i) { return _this.onChangeResponse([i, index]); }
                    : _this.keyList.push({ index: _this.keyList.length }) > -1
                        && Utils.createSimpleTimeBufferInput(function (resList) {
                            return _this.onChangeResponse([resList[resList.length - 1], index]);
                        }, _this.keyList[_this.watcherList.length], 0, false);
                // 绑定缓冲流需要一个keyList作为识别标志
                // console.log('push reaction', index, length)
                _this.watcherList.push(_this.reaction(function () { return toJS(get(_this.originalList, index)); }, callback, { fireImmediately: true }));
            };
            /**
             * 扩展监听器
             */
            while (_this.watcherList.length < length) {
                _loop_1();
            }
        }, { fireImmediately: true });
    };
    List.prototype.setTransformer = function (transformer) {
        this.customTransformer = createTransformer(Utils.isFunctionFilter(transformer) || (function (i) { return i; }));
    };
    Object.defineProperty(List.prototype, "first", {
        get: function () {
            return get(this.transformList, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "last", {
        get: function () {
            return get(this.transformList, this.transformList.length - 1);
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.push = function () {
        var _a;
        var i = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            i[_i] = arguments[_i];
        }
        (_a = this.originalList).push.apply(_a, __spread(i));
    };
    List.prototype.pop = function () {
        return this.originalList.pop();
    };
    List.prototype.set = function (index, i) {
        var item = this.getOriginal(index);
        if (Utils.isFunction(i)) {
            return this.update(index, i);
        }
        else if (!Utils.isEqual(item, i, true)) {
            set(this.originalList, index, i);
            return this.getOriginal(index);
        }
        return false;
    };
    List.prototype.update = function (index, i) {
        var item = this.getOriginal(index);
        var value = { item: toJS(item) };
        var nextItem = produce(value, function (value) {
            value.item = i(value.item);
        }).item;
        if (item !== nextItem) {
            set(this.originalList, index, nextItem);
            return this.getOriginal(index);
        }
        return false;
    };
    List.prototype.get = function (index, defaultValue, originalDefaultType) {
        if (originalDefaultType === void 0) { originalDefaultType = true; }
        var transValue = get(this.transformList, index);
        if (Utils.isNil(transValue) && !Utils.isNil(defaultValue)) {
            return originalDefaultType ? this.customTransformer(defaultValue) : defaultValue;
        }
        return transValue;
    };
    /**
     * 取对应下标值（纯净值）
     * @param index
     */
    List.prototype.getValue = function (index, defaultValue, originalDefaultType) {
        if (originalDefaultType === void 0) { originalDefaultType = true; }
        return toJS(this.get(index, defaultValue, originalDefaultType));
    };
    List.prototype.getOriginal = function (index, defaultValue, autobind) {
        if (autobind === void 0) { autobind = false; }
        var getter = get(this.originalList, index);
        if (Utils.isNil(getter) && !Utils.isNil(defaultValue)) {
            if (autobind) {
                this.set(index, defaultValue);
                return this.getOriginal(index);
            }
            return defaultValue;
        }
        return getter;
    };
    /**
     * 取得指定下标值（纯净值）
     * @param index
     * @param defaultValue 为null|undefined时提供默认值
     */
    List.prototype.getOriginalValue = function (index, defaultValue) {
        return toJS(this.getOriginal(index, defaultValue));
    };
    List.prototype.onArrayChangeHandler = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log.apply(console, __spread([key], args));
        this.onArrayChange && this.onArrayChange();
    };
    List.prototype.registerOnArrayChange = function (v) {
        this.onArrayChange = v;
    };
    __decorate([
        observable.shallow,
        __metadata("design:type", Object)
    ], List.prototype, "originalList", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], List.prototype, "transformList", void 0);
    __decorate([
        observable,
        __metadata("design:type", Function)
    ], List.prototype, "customTransformer", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], List.prototype, "model", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], List.prototype, "strict", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], List.prototype, "setList", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Boolean)
    ], List.prototype, "onChangeResponse", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Array)
    ], List.prototype, "watcherList", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], List.prototype, "watcherLength", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Array)
    ], List.prototype, "lastSnapshots", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], List.prototype, "setWatcher", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], List.prototype, "setTransformer", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], List.prototype, "first", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], List.prototype, "last", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], List.prototype, "push", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], List.prototype, "pop", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Object)
    ], List.prototype, "set", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Function]),
        __metadata("design:returntype", Object)
    ], List.prototype, "update", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Boolean]),
        __metadata("design:returntype", Object)
    ], List.prototype, "get", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Boolean]),
        __metadata("design:returntype", Object)
    ], List.prototype, "getOriginal", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], List.prototype, "onArrayChangeHandler", null);
    return List;
}(CommonStore));
export { List };
//# sourceMappingURL=ListStore.js.map