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
import set from "lodash/set";
import Utils, { computed, observable } from "../../../utils";
import { DateFormatter, EDateFormatter, parseTime } from "../../../utils";
export var TransformerType;
(function (TransformerType) {
    TransformerType[TransformerType["NONE"] = 0] = "NONE";
    /**
     * form值转换为组件值(component-value, form-field-value)
     */
    TransformerType[TransformerType["F2V"] = 1] = "F2V";
    /**
     * 组件值(component-value, form-field-value)转换为form值
     */
    TransformerType[TransformerType["V2F"] = 2] = "V2F";
})(TransformerType || (TransformerType = {}));
var FormValueTransform = /** @class */ (function () {
    function FormValueTransform(type, code) {
        this.type = type;
        this.code = code;
    }
    Object.defineProperty(FormValueTransform.prototype, "F2V", {
        get: function () {
            var type = this.type;
            if (Utils.isObject(type) && type.F2V) {
                return type.F2V;
            }
            switch (this.type) {
                case 'group':
                    return this.getGroupF2V();
                case 'path':
                    return this.getGroupF2V(false);
                case 'dateTime':
                    return this.dateFormatter(EDateFormatter.dateTime);
                case 'date':
                    return this.dateFormatter(EDateFormatter.date);
                case 'dateToDate':
                    return function (v) { return Utils.isArrayFilter(v, []).filter(function (i) { return Utils.isNotEmptyValue(i); }); };
            }
            return this.normalCommon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValueTransform.prototype, "V2F", {
        get: function () {
            var type = this.type;
            if (Utils.isObject(type) && type.V2F) {
                return type.V2F;
            }
            switch (this.type) {
                case 'group':
                    return this.getGroupV2F();
                case 'path':
                    return this.getGroupV2F(false);
                case 'dateTime':
                    return this.dateFormatter(EDateFormatter.dateTime);
                case 'date':
                    return this.dateFormatter(EDateFormatter.date);
                case 'dateToDate':
                    return function (v) {
                        var _a = __read(Utils.isArrayFilter(v, []).filter(function (i) { return Utils.isNotEmptyValue(i); }), 2), s = _a[0], e = _a[1];
                        if (Utils.isNotEmptyValue(s) && Utils.isNotEmptyValue(e)) {
                            return ["" + s + (s.length < 11 ? ' 00:00:00' : ''), "" + (s.length < 11 ? parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : '')];
                        }
                        return [s, e];
                    };
            }
            return this.normalCommon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValueTransform.prototype, "Component2FormModel", {
        get: function () {
            var _this = this;
            var type = this.type;
            if (Utils.isObject(type) && type.V2F) {
                return type.Component2FormModel;
            }
            return function (value, form) { return set(form, _this.code, _this.V2F(value)); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValueTransform.prototype, "Form2ComponentModel", {
        get: function () {
            var _this = this;
            var type = this.type;
            if (Utils.isObject(type) && type.V2F) {
                return type.Form2ComponentModel;
            }
            return function (value, form) { return set(form, _this.code, _this.F2V(value)); };
        },
        enumerable: true,
        configurable: true
    });
    FormValueTransform.prototype.normalCommon = function (value) {
        return Utils.isNotEmptyValueFilter(value);
    };
    FormValueTransform.prototype.dateFormatter = function (formatter) {
        return function (value) { return Utils.toDateString(value, formatter); };
    };
    FormValueTransform.prototype.getGroupF2V = function (isRemoveRepeat) {
        var _this = this;
        if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
        return function (value) { return _this.groupF2V(value, isRemoveRepeat); };
    };
    FormValueTransform.prototype.getGroupV2F = function (isRemoveRepeat) {
        var _this = this;
        if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
        return function (array) { return _this.groupV2F(array, isRemoveRepeat); };
    };
    FormValueTransform.prototype.groupF2V = function (value, isRemoveRepeat) {
        if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
        var next;
        if (Utils.isNotEmptyString(value)) {
            next = value.split(',');
        }
        else {
            next = Utils.castArray(value);
        }
        return Utils.zipEmptyData(next, isRemoveRepeat);
    };
    FormValueTransform.prototype.groupV2F = function (array, isRemoveRepeat) {
        if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
        return Utils.toString(Utils.zipEmptyData(Utils.isArrayFilter(Utils.toJS(array), []), isRemoveRepeat));
    };
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormValueTransform.prototype, "type", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", String)
    ], FormValueTransform.prototype, "code", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "F2V", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "V2F", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "Component2FormModel", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "Form2ComponentModel", null);
    return FormValueTransform;
}());
export { FormValueTransform };
export default function getTransform(code, type) {
    return new FormValueTransform(type, code);
}
//# sourceMappingURL=FormValueTransform.js.map