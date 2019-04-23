"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const mobx_vue_1 = require("mobx-vue");
exports.CFormButton = {
    name: 'CFormButton',
    functional: true,
    inject: {
        cForm: {
            default: Utils.stubObject
        }
    },
    render(h, { data, children, injections: { cForm } }) {
        return React.createElement("elButton", Object.assign({}, data, { "v-show": cForm.formStatus !== 'view' }), children);
    }
};
exports.default = mobx_vue_1.observer({
    render(h) {
        const { viewOnly, inline, model, labelWidthStr, rules, onValidated, disabled } = this;
        return (React.createElement("elForm", Object.assign({ ref: 'form', class: [{ viewOnly }] }, { props: { inline, model, rules, disabled } }, { "label-width": labelWidthStr, onValidate: onValidated }), this.$slots.default));
    },
    name: 'CForm',
    props: ['model', 'rules', 'disabled', 'labelWidth', 'config', 'inline', 'viewOnly'],
    computed: {
        labelWidthStr() {
            const tn = parseFloat(this.labelWidth);
            const isValid = Utils.isNumber(tn);
            if (isValid) {
                const suffix = Utils.isStringFilter(this.labelWidth).replace(tn + '', '');
                return `${tn}${suffix}`;
            }
            return '150px';
        },
        formStatus() {
            return (this.cForm.formStatus === 'view' || this.viewOnly) ? 'view' : 'common';
        }
    },
    inject: {
        cForm: {
            default: Utils.stubObject
        }
    },
    provide() {
        return {
            onValidated: this.onValidated,
            cForm: this
        };
    },
    data() {
        return {
            validateEmitter: Utils.createSimpleTimeBufferInput(this.onGroupValidated, this),
            fieldValidateResultMap: {}
        };
    },
    methods: {
        validate(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const valid = yield Promise.race([
                    new Promise(r => { this.$refs.form.validate().then(r).catch(r); }),
                    Utils.waitingPromise(1000)
                ]);
                const result = Utils.isBooleanFilter(valid, Utils.isEmptyObject(this.fieldValidateResultMap));
                this.$emit('validateFailedGroup', this.fieldValidateResultMap);
                // console.error({...this.fieldValidateResultMap}, Utils.isEmptyObject(
                //         this.fieldValidateResultMap, 
                //         true
                //     ))
                return Utils.isFunction(callback) ? callback(result) : result;
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
        onGroupValidated(list) {
            // console.log(this.fieldValidateResultMap)
            const res = _.filter(list, ({ code, isValid, msg }, index, list) => _.first(code) !== '!' && _.findIndex(list, ({ code: e_code }) => e_code === '!' + code, index) === -1);
            // console.log('validateFailedAuto', list, res)
            return res.length > 0 && this.$emit('validateFailedAuto', res, this.fieldValidateResultMap);
        },
        // onValidated2(code, isValid, msg) {
        //   // console.log(code, isValid, msg)
        //   // this.onValidated(code, isValid, msg)
        // },
        onValidated(code, isValid, msg, itemConfig) {
            // /olicy(.*?)Date/.test(code) && console.error(code, isValid, msg, itemConfig)
            if (isValid) {
                const _a = this.fieldValidateResultMap, _b = code, successCode = _a[_b], other = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                this.fieldValidateResultMap = other;
                this.validateEmitter({ code: "!" + code, isValid, msg });
            }
            else {
                // console.log(result)
                this.fieldValidateResultMap[code] = Utils.isNotEmptyStringFilter(msg, `${code} is error!`);
                this.validateEmitter({ code, isValid, msg });
                this.$emit('validateFailed', code, this.fieldValidateResultMap, 10);
            }
            return isValid !== true; //&& console.log(code, result, this.fieldValidateResultMap)
        }
    }
});
//# sourceMappingURL=CommonForm.js.map