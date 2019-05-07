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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var ParseUtils_1 = require("../../../utils/ParseUtils");
var utils_1 = __importStar(require("../../../utils"));
var FormValueTransform = /** @class */ (function () {
    function FormValueTransform(type) {
        this.type = type;
    }
    Object.defineProperty(FormValueTransform.prototype, "F2V", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupF2V;
                case 'check':
                    return this.groupF2V;
                case 'checkOne':
                    return function (v) { return v === '1'; };
                case 'dateTime':
                    return function (v) { return utils_1.default.isDate(v) ? v :
                        (utils_1.default.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) { return utils_1.default.isArrayFilter(v, []).filter(function (i) { return utils_1.default.isNotEmptyValue(i); }); };
            }
            return this.normalF2V;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValueTransform.prototype, "V2F", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupV2F;
                case 'check':
                    return this.groupV2F;
                case 'checkOne':
                    return function (v) {
                        return v === true ? '1' : '0';
                    };
                case 'dateTime':
                    return function (v) { return utils_1.default.isDate(v) ? v :
                        (utils_1.default.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) {
                        var _a = __read(utils_1.default.isArrayFilter(v, []).filter(function (i) { return utils_1.default.isNotEmptyValue(i); }), 2), s = _a[0], e = _a[1];
                        if (utils_1.default.isNotEmptyValue(s) && utils_1.default.isNotEmptyValue(e)) {
                            return ["" + s + (s.length < 11 ? ' 00:00:00' : ''), "" + (s.length < 11 ? ParseUtils_1.parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : '')];
                        }
                        return [s, e];
                    };
            }
            return this.normalF2V;
        },
        enumerable: true,
        configurable: true
    });
    FormValueTransform.prototype.normalF2V = function (value) {
        return utils_1.default.isNotEmptyValueFilter(value, null);
    };
    FormValueTransform.prototype.groupF2V = function (string) {
        return utils_1.default.isNotEmptyString(string) ? string.split(',').filter(function (i) { return utils_1.default.isNotEmptyString(i); }) : [];
    };
    FormValueTransform.prototype.groupV2F = function (array) {
        return utils_1.default.isArrayFilter(array, []).filter(function (i) { return utils_1.default.isNotEmptyString(i); }).join(',');
    };
    __decorate([
        utils_1.observable,
        __metadata("design:type", String)
    ], FormValueTransform.prototype, "type", void 0);
    __decorate([
        utils_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "F2V", null);
    __decorate([
        utils_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormValueTransform.prototype, "V2F", null);
    return FormValueTransform;
}());
exports.FormValueTransform = FormValueTransform;
function getTransform(type) {
    return new FormValueTransform(type);
}
exports.default = getTransform;
