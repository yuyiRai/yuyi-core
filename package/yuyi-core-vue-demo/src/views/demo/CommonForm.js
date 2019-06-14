/* eslint-disable */
// import { observer } from 'mobx-vue'
import { Utils } from 'yuyi-core-night'

export default ({
  render(h) {
    const { viewOnly, inline, model, labelWidthStr, rules, onValidated, disabled } = this;
    return (
      <elForm ref='form' class={[{ viewOnly }]} style={{ position: 'relative' }} {...{ props: { inline, model, rules, disabled } }} label-width={labelWidthStr} onValidate={onValidated}>
        {this.$slots.default}
      </elForm>
    )
  },
  name: 'CForm',
  props: ['model', 'rules', 'disabled', 'labelWidth', 'config', 'inline', 'viewOnly'],
  computed: {
    labelWidthStr() {
      const tn = parseFloat(this.labelWidth);
      const isValid = Utils.isNumber(tn);
      if (isValid) {
        const suffix = Utils.isStringFilter(this.labelWidth, '').replace(tn + '', '')
        return `${tn}${suffix}`
      }
      return '150px'
    },
    formStatus() {
      return (this.cForm.formStatus === 'view' || this.viewOnly) ? 'view' : 'common'
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
    }
  },
  data() {
    return {
      validateEmitter: Utils.createSimpleTimeBufferInput(this.onGroupValidated, this),
      fieldValidateResultMap: {},
      groupMap: new Map()
    }
  },
  methods: {
    async validate(callback) {
      this.fieldValidateResultMap = {}
      const valid = await Promise.race([
        new Promise(r => { this.$refs.form.validate().then(r).catch(r) }),
        Utils.waitingPromise(1000)
      ])
      for await (const r of Array.from(this.groupMap.values()).map(validate => validate())) {
        console.error(r)
        for (const key in (r.errors || {})) {
          const e = r.errors[key]
          if (e && e.errors && e.errors.length > 0) {
            e.errors.forEach(error => this.onValidated(key, false, error.message))
          }
        }
      }
      const result = Utils.isBooleanFilter(
        valid,
        true
      ) && Utils.isEmptyObject(this.fieldValidateResultMap)
      this.$emit('validateFailedGroup', this.fieldValidateResultMap)
      // console.error({...this.fieldValidateResultMap}, Utils.isEmptyObject(
      //         this.fieldValidateResultMap, 
      //         true
      //     ))
      return Utils.isFunction(callback) ? callback(result) : result;
    },
    onGroupValidated(list) {
      // console.log(this.fieldValidateResultMap)
      const res = _.filter(
        list,
        ({ code, isValid, msg }, index, list) =>
          _.first(code) !== '!' && _.findIndex(list, ({ code: e_code }) => e_code === '!' + code, index) === -1)
      // console.log('validateFailedAuto', list, res)
      return res.length > 0 && this.$emit('validateFailedAuto', res, this.fieldValidateResultMap)
    },
    onValidated(code, isValid, msg, itemConfig) {
      // /olicy(.*?)Date/.test(code) && console.error(code, isValid, msg, itemConfig)
      if (isValid) {
        const { [code]: successCode, ...other } = this.fieldValidateResultMap
        this.fieldValidateResultMap = other
        this.validateEmitter({ code: "!" + code, isValid, msg })
      } else {
        // console.log(result)
        this.fieldValidateResultMap[code] = Utils.isNotEmptyStringFilter(msg, `${code} is error!`)
        this.validateEmitter({ code, isValid, msg })
        this.$emit('validateFailed', code, this.fieldValidateResultMap, 10)
      }
      return isValid !== true //&& console.log(code, result, this.fieldValidateResultMap)
    }
  }
})