import { autobind } from 'core-decorators';
import { forEach, isError, isRegExp, set, trim } from 'lodash';
import { computed, IKeyValueMap, observable } from "mobx";
// import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
import { getDefaultRules } from './input/Date';
import { IItemConfig, IItemConfigBase } from "./interface";
import { CommonStore } from "./interface/CommonStore";
import { RuleConfigList, RuleConfigMap } from './interface/RuleConfig';

export class RuleStore<V, FM> extends CommonStore {
  @observable itemConfig: IItemConfigBase<V, FM>;
  constructor(itemConfig: IItemConfigBase<V, FM>) {
    super();
    this.itemConfig = itemConfig
  }

  @computed 
  public get requiredRule() {
    const { itemConfig } = this
    const { required } = itemConfig
    if (required) {
      if (Utils.isObject(required) && Utils.isFunction((required as any).validator)) {
        const { validator } = itemConfig.required as any
        return Object.assign({}, itemConfig.required, { validator: this.shadowRuleRegister(validator) })
      }
      return {
        required: true,
        validator: this.shadowRuleRegister(
          Utils.isFunctionFilter(itemConfig.required,
            (rule: any, value: any, callback: any) => {
              // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
              if (Utils.isEmptyData(trim(value)) || (itemConfig.type === 'number' && value == 0)) {
                return callback(new Error(itemConfig.requiredMessage || `[${itemConfig.label}]不能为${itemConfig.type === 'number' ? '0' : '空'}！`))
              }
              return callback();
            })),
        trigger: itemConfig.type === 'check' ? 'none' : (itemConfig.type == 'select' ? 'change' : 'blur') //i.type == 'select' ? 'blur' : 'change'
      }
    }
  }

  @autobind 
  public shadowRuleRegister(validator: any) {
    // const { componentProps } = this.itemConfig
    return (rule: any, value: any, callback: { (arg0: any): void; (): void; }) => {
      return validator(rule, value, (error: { message: any; }) => {
        if (isError(error) || Utils.isNotEmptyString(error)) {
          // if (!componentProps.$store || !componentProps.$store.state.taskDispatcher.shadowRequired) {
            return callback(error)
          // } else {
          //   // console.log('will catch shadowform error')
          //   componentProps.$store.dispatch('catchShadowFormError', Utils.isStringFilter(this.itemConfig.requiredMessage, error.message, error)).then(() => {
          //     // console.log('catch shadowform error')
          //   })
          // }
        }
        return callback()
      })
    }
  }

  @autobind 
  public getRuleList(i: IKeyValueMap<any>): RuleConfigList | undefined {
    const iRules = []
    // if (this.required) {
    if (this.requiredRule) {
      iRules.push(this.requiredRule)
    }
    let ruleGetter = Utils.isFunction(i.rule) ? i.rule(this.itemConfig.formSource, this) : i.rule;
    if (Utils.isNotEmptyString(ruleGetter)) {
      const [ruleName, message] = ruleGetter.split('|')
      // console.trace(this, this.defaultRule, ruleName, message)
      const defaultRule = Utils.castComputed(this.defaultRule[ruleName], this.itemConfig.formSource, this);
      const defaultRuleList = Utils.castObjectArray(defaultRule, false);
      const isTrigger = ['change', 'blur', 'none'].includes(message);
      if (Utils.isNotEmptyString(message)) {
        forEach(defaultRuleList, i =>
          set(i, isTrigger ? 'trigger' : 'message', message)
        )
      }
      iRules.push(...defaultRuleList)
    } else if (Utils.isNotEmptyArray(ruleGetter)) {
      iRules.push(...ruleGetter)
    } else if (isRegExp(ruleGetter)) {
      iRules.push({
        validator(rule: any, value: any, callback: { (): void; (arg0: Error): void; }) {
          return ruleGetter.test(value) ? callback() : callback(new Error())
        },
        message: i.regExpMessage || `请正确输入${i.label}！`,
        trigger: 'blur'
      })
    } else if (Utils.isNotEmptyObject(ruleGetter)) {
      iRules.push(ruleGetter)
    }
    // _.forEach(iRules, config => {
    //   const { validator, required } = config
    //   if(_.isFunction(validator) && required)
    //     config.validator = this.shadowRuleRegister(validator)
    // })
    // iRules.forEach(config=>{
    //   const { validator, message } = config
    //   config.nativeValidator = validator;
    //   if(_.isFunction(validator))
    //     config.validator = (r, values, callback) => {
    //       validator(r, values, (e) => {
    //         if(!this.hidden && (!this.componentProps.$store || !this.componentProps.$store.state.taskDispatcher.shadowRequired) && _.isError(e)) {
    //           // Utils.$message.error(e.message || message)
    //           // console.log(this.code, e, config)
    //           this.onValidateHandler(this.code, false, e.message || message, this, config)
    //         } else {
    //           this.onValidateHandler(this.code, true, null, this, config)
    //         }
    //         Reflect.apply(callback, this, [e])
    //       })
    //     }
    // })
    if (this.itemConfig.type == 'select' || this.itemConfig.type === 'search') {
      iRules.push({
        validator: this.optionsMatcher,
        trigger: 'change',
        get strict(): boolean {
          return true;
        }
      })
    }
    // i.code === 'planDischargeDate' && console.log('get rule', this, $version, iRules)
    return Utils.isNotEmptyArrayFilter(iRules, undefined)
  }


  @autobind 
  public async optionsMatcher(r: any, values: any, callback: any) {
    if (!this.itemConfig.allowCreate) {
      const options = this.itemConfig.options || []
      for (const value of Utils.isStringFilter(values, '').split(',')) {
        if (Utils.isNotEmptyValue(value) && (Utils.isArrayFilter(Utils.getOptionsByValue(options, value)) || []).length === 0) {
          console.error(this.itemConfig.label, '选择项匹配失败，请重新选择！', options, this.itemConfig.formSource, values, this)
          return callback(new Error(`[${this.itemConfig.label}]数据异常，请重新输入选择！`))
        }
      }
    }
    // console.log(this.label, '选择项匹配成功！', options, this.form, values, this)
    return callback()
  }

  @computed 
  public get defaultRule() {
    return Object.assign(
      RuleStore.getDefaultRules(this.itemConfig), 
      getDefaultRules(this.itemConfig)
    )
  }
  public static getDefaultRules<FM>(itemConfig: IItemConfig<FM>): RuleConfigMap {
    return {
      phone: {
        validator: (rule: any, value: any, callback: any) => {
          // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
          // console.log('check', value)
          // console.log(rule, value, l,a, this.itemPipe.itemConfig.rule)
          if (Utils.isEmptyValue(value)) {
            return callback();
          }
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (!reg.test(value + "")) {
            // console.log()
            return callback(new Error('请输入正确的手机号！'));
          }
          return callback();
        },
        // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
        trigger: 'blur',
        message: '请录入正确的手机号！'
      },
      'chejiahao': [{
        validator: (rule: any, value: any, callback: any) => {
          if (Utils.isEmptyValue(value)) {
            return callback();
          }
          if (Utils.isString(value) && value.length === 17) {
            return callback(new Error());
          }
          return callback();
        },
        // pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
        trigger: 'blur',
        message: '车架号只允许17位'
      }],
      plusOnly: (form: any, config: { label?: any; }) => [{
        validator($: any, value: string, callback: { (arg0: Error): void; (): void; }) {
          // console.log(v,b)
          if (Utils.isNotEmptyValue(value) && (Utils.isNumberFilter(parseFloat(value)) || 0) <= 0) {
            return callback(new Error())
          }
          return callback();
        },
        tirgger: 'change',
        message: `${config.label}必须大于0！`
      }],
      // licanseNo: (form: { licenseType: any; }, config: any) => [{
      //   validator: (rule: any, value: string, callback: { (): void; (): void; (arg0: Error): void; (): void; }) => {
      //     // console.log('licenseNo', value)
      //     if (Utils.isNotEmptyString(value)) {
      //       if (trim(value) === '*' || value.indexOf('新车') > -1 || (itemConfig.code !== 'licanseNo' && value === '车外')) {
      //         return callback()
      //       } else {
      //         const selected: Option = Utils.getOptionsByValue(get(configStore, '$store.state.taskDispatcher.licenseTypeList'), form.licenseType)
      //         // console.log(form.licenseType, selected)
      //         const res = (selected && !/警|军队|其它/ig.test(selected.label as string))
      //           ? /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/
      //           : /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/;
      //         if (res.test(value)) {
      //           return callback()
      //         } else
      //           return callback(new Error());
      //       }
      //     }
      //     return callback()
      //   },
      //   trigger: 'blur',
      //   message: '请录入正确的车牌号！'
      // }],
      idCard: [{
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        trigger: 'blur',
        message: '请录入正确的身份证号！'
      }],
      commonCode: [{
        pattern: /(^([a-zA-z0-9].*)$)/,
        trigger: 'blur',
        message: `请录入正确的[${itemConfig.label}]！`
      }]
    }
  }
}