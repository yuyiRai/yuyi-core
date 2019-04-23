/* eslint-disable */
import { observer } from 'mobx-vue';
export const CFormButton = {
    name: 'CFormButton',
    functional: true,
    inject: {
        cForm: {
            default: Utils.stubObject
        }
    },
    render(h, { data, children, injections: { cForm } }) {
        return <elButton {...data} v-show={cForm.formStatus !== 'view'}>{children}</elButton>;
    }
};
export default observer({
    render(h) {
        const { viewOnly, inline, model, labelWidthStr, rules, onValidated, disabled } = this;
        return (<elForm ref='form' class={[{ viewOnly }]} {...{ props: { inline, model, rules, disabled } }} label-width={labelWidthStr} onValidate={onValidated}>
        {this.$slots.default}
      </elForm>);
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
        async validate(callback) {
            const valid = await Promise.race([
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
                const { [code]: successCode, ...other } = this.fieldValidateResultMap;
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