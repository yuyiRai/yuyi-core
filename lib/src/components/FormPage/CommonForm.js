"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var mobx_vue_1 = require("mobx-vue");
exports.CFormButton = {
    name: 'CFormButton',
    functional: true,
    inject: {
        cForm: {
            default: Utils.stubObject
        }
    },
    render: function (h, _a) {
        var data = _a.data, children = _a.children, cForm = _a.injections.cForm;
        return <elButton {...data} v-show={cForm.formStatus !== 'view'}>{children}</elButton>;
    }
};
exports.default = mobx_vue_1.observer({
    render: function (h) {
        var _a = this, viewOnly = _a.viewOnly, inline = _a.inline, model = _a.model, labelWidthStr = _a.labelWidthStr, rules = _a.rules, onValidated = _a.onValidated, disabled = _a.disabled;
        return (<elForm ref='form' class={[{ viewOnly: viewOnly }]} {...{ props: { inline: inline, model: model, rules: rules, disabled: disabled } }} label-width={labelWidthStr} onValidate={onValidated}>
        {this.$slots.default}
      </elForm>);
    },
    name: 'CForm',
    props: ['model', 'rules', 'disabled', 'labelWidth', 'config', 'inline', 'viewOnly'],
    computed: {
        labelWidthStr: function () {
            var tn = parseFloat(this.labelWidth);
            var isValid = Utils.isNumber(tn);
            if (isValid) {
                var suffix = Utils.isStringFilter(this.labelWidth).replace(tn + '', '');
                return "" + tn + suffix;
            }
            return '150px';
        },
        formStatus: function () {
            return (this.cForm.formStatus === 'view' || this.viewOnly) ? 'view' : 'common';
        }
    },
    inject: {
        cForm: {
            default: Utils.stubObject
        }
    },
    provide: function () {
        return {
            onValidated: this.onValidated,
            cForm: this
        };
    },
    data: function () {
        return {
            validateEmitter: Utils.createSimpleTimeBufferInput(this.onGroupValidated, this),
            fieldValidateResultMap: {}
        };
    },
    methods: {
        validate: function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var valid, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.race([
                                new Promise(function (r) { _this.$refs.form.validate().then(r).catch(r); }),
                                Utils.waitingPromise(1000)
                            ])];
                        case 1:
                            valid = _a.sent();
                            result = Utils.isBooleanFilter(valid, Utils.isEmptyObject(this.fieldValidateResultMap));
                            this.$emit('validateFailedGroup', this.fieldValidateResultMap);
                            // console.error({...this.fieldValidateResultMap}, Utils.isEmptyObject(
                            //         this.fieldValidateResultMap, 
                            //         true
                            //     ))
                            return [2 /*return*/, Utils.isFunction(callback) ? callback(result) : result];
                    }
                });
            });
        },
        // async validate(callback) {
        //   const resList = await Promise.all(_.map(this.$refs.form.fields, field => {
        //     return new Promise(r => {
        //       console.log('start', field.prop)
        //       field.validate('', (message, errors) => {
        //         const isError = Utils.isNotEmptyString(message)
        //         this.onValidated(field.prop, !isError, message)
        //         console.log('result', field.prop)
        //         r(isError?[message, errors]:null)
        //       })
        //     })
        //   }))
        //   const valid = Utils.zipEmptyData(resList).length === 0
        //   console.log(resList, valid)
        //   // const valid = await new Promise(r => { this.$refs.form.validate().then(r).catch(r) })
        //   // console.log(valid)
        //   const result = Utils.isBooleanFilter(
        //     valid,
        //     Utils.isEmptyObject(this.fieldValidateResultMap)
        //   )
        //   this.$emit('validateFailedGroup', this.fieldValidateResultMap)
        //   // console.error({...this.fieldValidateResultMap}, Utils.isEmptyObject(
        //   //         this.fieldValidateResultMap, 
        //   //         true
        //   //     ))
        //   return Utils.isFunction(callback) ? callback(result) : result;
        // },
        onGroupValidated: function (list) {
            // console.log(this.fieldValidateResultMap)
            var res = _.filter(list, function (_a, index, list) {
                var code = _a.code, isValid = _a.isValid, msg = _a.msg;
                return _.first(code) !== '!' && _.findIndex(list, function (_a) {
                    var e_code = _a.code;
                    return e_code === '!' + code;
                }, index) === -1;
            });
            // console.log('validateFailedAuto', list, res)
            return res.length > 0 && this.$emit('validateFailedAuto', res, this.fieldValidateResultMap);
        },
        // onValidated2(code, isValid, msg) {
        //   // console.log(code, isValid, msg)
        //   // this.onValidated(code, isValid, msg)
        // },
        onValidated: function (code, isValid, msg, itemConfig) {
            // /olicy(.*?)Date/.test(code) && console.error(code, isValid, msg, itemConfig)
            if (isValid) {
                var _a = this.fieldValidateResultMap, _b = code, successCode = _a[_b], other = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                this.fieldValidateResultMap = other;
                this.validateEmitter({ code: "!" + code, isValid: isValid, msg: msg });
            }
            else {
                // console.log(result)
                this.fieldValidateResultMap[code] = Utils.isNotEmptyStringFilter(msg, code + " is error!");
                this.validateEmitter({ code: code, isValid: isValid, msg: msg });
                this.$emit('validateFailed', code, this.fieldValidateResultMap, 10);
            }
            return isValid !== true; //&& console.log(code, result, this.fieldValidateResultMap)
        }
    }
});
//# sourceMappingURL=CommonForm.js.map