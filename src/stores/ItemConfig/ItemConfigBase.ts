/* eslint-disable */
import { autobind } from 'core-decorators';
import { difference, forEach, get, isError, isRegExp, map, set, toString, trim } from 'lodash';
import { action, computed, extendObservable, IKeyValueMap, isComputedProp, IValueDidChange, observable, ObservableMap, toJS } from 'mobx';
import { Option, OptionBase } from '../../utils';
import { EventEmitter } from '../../utils/EventEmitter';
// import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
import { getDefaultRules } from './input';
import { RuleConfigList, RuleConfigMap } from './interface';
import { IFormItemConstructor, IItemConfig } from './interface/ItemConfig';
import { ItemConfigBaseConfig } from './ItemConfigBaseConfig';

export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
  name: string;
}
export class ItemConfigBase<V, FM = any> extends ItemConfigBaseConfig<V, FM> implements IItemConfig<V, FM> {
  [key: string]: any;

  @observable initConfig: ObservableMap<string, any> = observable.map({})

  @observable $version = 0
  // @observable loading = false;
  @computed private get otherKey() {
    return difference(
      this.baseConfigKeys,
      this.propertyNameList,
      ['refConfig', 'code', 'rule', 'remoteMethod', 'loading', 'children', 'options', 'viewOnly', 'isViewOnly', 'transformer', 'computed']
    )
  }

  onPropertyChange = new EventEmitter<IPropertyChangeEvent>()

  constructor(initModel: IFormItemConstructor<V, FM>, form: FM = {} as FM, componentProps: any = {}) {
    super()
    // this.reaction(() => this.i.options, options => {
    //   console.log('initConfig change', Utils.isArrayFilter(options, this.getComputedValue('options')) || [])
    // })
    // this.observe(this.initConfig, (e: IMapDidChange) => {
    //   console.log('initConfig change', e, this);
    // })

    if (initModel) {
      this.init(initModel, form, componentProps)
    }
    // this.observe(this.formSource, (e: IPropertyChangeEvent) => {
    //   console.log('initConfig change2', this[e.name], this.baseConfig[e.name], e, this)
    // }
    this.observe(this.baseConfigModel.model, (e: IPropertyChangeEvent) => {
      this.onPropertyChange.emit(e)
      // console.log('initConfig change2', this[e.name], this.baseConfig[e.name], e, this)
        const { oldValue, newValue, name } = e
        if (name === 'options' && !Utils.isEqual(oldValue, newValue)) {
    //       this.label === '查勘地点' && console.log(
    //         `${name}: options[${(oldValue || []).length}] => options[${(newValue || []).length}]`, { config: i, event: e }, this.options)
    //       if (newValue) {
    //         this.optionsInited = Utils.isNotEmptyArray(newValue)
    //       }
          this.$emit('options-change', e.newValue)
        }
        // console.log(`${e.name}: ${e.oldValue} => ${e.newValue}`, {config: i, event: e})
    })
    this.onPropertyChange.subscribe()
  }

  @action.bound registerObservables(baseConfig: any) {
    for (const key of this.otherKey) {
      // const keyName = _.camelCase("set-"+key)
      if (!isComputedProp(this, key)) {
        const thisArg = this;
        extendObservable(this, {
          get [key]() {
            return thisArg.getComputedValue(key, baseConfig)
          },
          // [keyName](value) {
          //   // console.log(key, 'set', value, baseConfig.label)
          //   return baseConfig[key] = value
          // }
        }, {
            // [keyName]: action.bound
          }, { deep: false })
      }
    }
  }

  optionsInited = false
  @action.bound setConfig(baseConfig: IFormItemConstructor<V, FM>, strict?: boolean) {
    const isChange = this.setBaseConfig(baseConfig, strict)
    isChange && this.registerObservables(baseConfig)
  }

  @action.bound init(initModel: IFormItemConstructor<V, FM>, form: IKeyValueMap, componentProps = {}) {
    this.setConfig(initModel)
    this.setForm(form)
    this.componentProps = componentProps
  }


  @computed.struct get searchName() {
    return this.getSearchName()
  }
  @autobind getSearchName() {
    const v = get(Utils.cloneDeep(this.formSource), this.nameCode)
    return Utils.isStringFilter(v) || this.currentValue
  }

  @computed.struct get currentValue() {
    const v = this.parentConfig ? get((this.parentConfig as any).currentComponentValue, this.keyInnerCode) : get(this.formSource || {}, this.code)
    return toJS(v)
  }


  // @observable searchKeyWord;
  // @action.bound setNextSearch(keyWord) {
  //   if (!Utils.likeArray(this.searchKeyWord, keyWord)) {
  //     this.searchKeyWord = keyWord
  //   }
  // }

  @computed get remoteMethod() {
    if (Utils.isFunction(this.i.remoteMethod)) {
      return async (keyWord: string, form?: any) => {
        const r = await this.i.remoteMethod(keyWord, this.form, this)
        // console.log('remoteSearch get', keyWord, r, this.i.remoteMethod)
        return r
      }
    } else if (this.type === 'search') {
      return async (keyWord: string, form?: any) => {
        return this.options
      }
    } else {
      return async (keyWord: string, form?: any) => {
        return this.options
      }
    }
  }

  get remoteOptions(): Promise<any[]> | any[] {
    return this.remoteMethod ? this.remoteSearchBySearchName(this.searchName) : this.options
  }

  @autobind async remoteSearchBySearchName(keyWordStr: string) {
    if (Utils.isString(keyWordStr)) {
      return await this.remoteSearch(keyWordStr.split(','))
    }
    return await this.remoteSearch(keyWordStr as any)
  }
  @autobind async remoteSearch(keyWord: string[]) {
    const { remoteMethod, multiple } = this;
    let nextOptions: Option[] = []
    if (Utils.isFunction(remoteMethod)) {
      // runInAction(() => this.setLoading(true)) 
      if (multiple) {
        const keyWordArr: string[] = Utils.zipEmptyData(Utils.castArray(keyWord));
        if (keyWordArr.length > 0) {
          try {
            await Promise.all(map(keyWordArr, async keyWord => {
              // console.log('keyWord', keyWord)
              // console.log('remoteSearch start', keyWord)
              const data = await remoteMethod(keyWord, this.form);
              nextOptions.push(...data)
              return data
            })) //.concat([Utils.waitingPromise(100, true)]))
          } catch (e) {
            throw e;
          }
          // console.log('resList', keyWordArr, this.i.label, resList)
        }
      } else {
        nextOptions = await remoteMethod(toString(keyWord))
        // console.log(this.i.label, 'start search', keyWord, nextOptions)
        // console.log('resList', keyWord, this.i.label, r)
      }
      // runInAction(() => this.setLoading(false)) 
    }
    return nextOptions;
  }
  // searchMethods = (key) => {
  //   const keyArr = _.castArray(key);
  //   if (!Utils.isNil(key) && (keyArr!== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
  //     if (this.itemConfig.allowInput) {
  //       this.setShadowOption(key)
  //     }
  //     this.searchEventEmitter(key)
  //   }
  // }

  @computed.struct get rule(): RuleConfigList {
    const { i, componentProps: componentProps } = this
    return this.isViewOnly ? [] : (this.getRuleList(i, componentProps) || [])
  }
  @action.bound setRule(v: RuleConfigList) {
    if (this.i.rule !== v)
      this.i.rule = v
  }

  validateHandler = (value: any, strict: boolean = false) => {
    return new Promise((resolve, reject) => {
      const resultList = []
      const ruleList = this.rule.filter((rule) => (rule.strict && strict) || (!rule.strict && !strict))
      // console.log('validateHandler start', ruleList)
      if ((Utils.isArrayFilter(ruleList) || []).length === 0) {
        return resolve(true)
      }
      // console.log('validateHandler', ruleList)
      const length = ruleList.length
      for (const rule of ruleList) {
        if ((rule.strict && strict) || (!rule.strict && !strict)) {
          const validator = Utils.isFunctionFilter(rule.validator) || ((a: any, b: any, c: (arg0: boolean) => void) => c(true))
          validator(ruleList, value, (e: Error | undefined) => {
            resultList.push(rule)
            if (isError(e)) {
              reject(e.message || rule.message)
            } else if (resultList.length === length) {
              resolve(true)
            }
          })
        }
      }
    })
  }

  @computed get allowCreate(): boolean | ((data: any, form?: any) => Option) {
    return this.getComputedValue('allowCreate') || false
  }
  @computed get allowInput(): boolean {
    return this.getComputedValue('allowInput') || (this.type == 'search' && !this.multiple && this.allowCreate)
  }

  @action updateVersion() {
    this.$version = this.$version + 1
  }


  /**
   * @type {function}
   */
  onValidateHandler = () => { }
  /**
   * 
   * @param { (code: string, isValid: boolean, errorMsg: string, config: this) => void} callback 
   */
  onValidate(callback: () => void) {
    if (Utils.isFunction(callback))
      this.onValidateHandler = callback
  }

  @computed get requiredRule() {
    const { required } = this
    if (required) {
      if (Utils.isObject(required) && Utils.isFunction((required as any).validator)) {
        const { validator } = this.required as any
        return Object.assign({}, this.required, { validator: this.shadowRuleRegister(validator) })
      }
      return {
        required: true,
        validator: this.shadowRuleRegister(
          Utils.isFunctionFilter(this.required,
            (rule: any, value: any, callback: any) => {
              // value = Utils.isNotEmptyValueFilter(value, this.form[this.code])
              if (Utils.isEmptyData(trim(value)) || (this.type === 'number' && value == 0)) {
                return callback(new Error(this.requiredMessage || `[${this.label}]不能为${this.type === 'number' ? '0' : '空'}！`))
              }
              return callback();
            })),
        trigger: this.i.type === 'check' ? 'none' : (this.i.type == 'select' ? 'change' : 'blur') //i.type == 'select' ? 'blur' : 'change'
      }
    }
  }

  @autobind shadowRuleRegister(validator: any) {
    return (rule: any, value: any, callback: { (arg0: any): void; (): void; }) => {
      return validator(rule, value, (error: { message: any; }) => {
        if (isError(error) || Utils.isNotEmptyString(error)) {
          if (!this.componentProps.$store || !this.componentProps.$store.state.taskDispatcher.shadowRequired) {
            return callback(error)
          } else {
            // console.log('will catch shadowform error')
            this.componentProps.$store.dispatch('catchShadowFormError', Utils.isStringFilter(this.i.requiredMessage, error.message, error)).then(() => {
              // console.log('catch shadowform error')
            })
          }
        }
        return callback()
      })
    }
  }

  @autobind getRuleList(i: IKeyValueMap<any>, componentProps: IKeyValueMap<any>): RuleConfigList | undefined {
    const iRules = []
    // if (this.required) {
    if (this.requiredRule) {
      iRules.push(this.requiredRule)
    }
    let ruleGetter = Utils.isFunction(i.rule) ? i.rule(this.form, this) : i.rule;
    if (Utils.isNotEmptyString(ruleGetter)) {
      const [ruleName, message] = ruleGetter.split('|')
      // console.trace(this, this.defaultRule, ruleName, message)
      const defaultRule = Utils.castComputed(this.defaultRule[ruleName], this.form, this);
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
    if (Utils.isNotEmptyArray(componentProps.rules)) {
      iRules.push(...componentProps.rules)
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
    if (this.i.type == 'select' || (this.i.type === 'search' && this.strictSearch)) {
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

  @autobind async optionsMatcher(r: any, values: any, callback: any) {
    if (!this.allowCreate) {
      const options = await Reflect.apply(this.getOptionsSafe, this, [])
      for (const value of Utils.isStringFilter(values, '').split(',')) {
        if (Utils.isNotEmptyValue(value) && (Utils.isArrayFilter(Utils.getOptionsByValue(options, value)) || []).length === 0) {
          console.error(this.label, '选择项匹配失败，请重新选择！', options, this.form, values, this)
          return callback(new Error(`[${this.label}]数据异常，请重新输入选择！`))
        }
      }
    }
    // console.log(this.label, '选择项匹配成功！', options, this.form, values, this)
    return callback()
  }

  @autobind async getOptionsSafe(): Promise<OptionBase[]> {
    if (this.type === 'search' && (this.options.length === 0 || !this.optionsInited)) {
      if (!Utils.isArrayFilter(this.remoteOptions)) {
        // console.log('safe start', this.label, this.searchName, this.remoteOptions, this.options)
        const options = await this.remoteOptions
        // console.log('safe end', this.label, this.searchName, options)
        return options
      }
      // console.log('get remote', this.label, this.searchName, this.remoteOptions)
      return this.remoteOptions;
    }
    return this.options;
  }

  @computed get defaultRule() {
    return Object.assign(ItemConfigBase.getDefaultRules(this, this.componentProps), getDefaultRules(this))
  }
  static getDefaultRules<V, FM>(itemConfig: IItemConfig<V, FM>, configStore: any): RuleConfigMap {
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
      licanseNo: (form: { licenseType: any; }, config: any) => [{
        validator: (rule: any, value: string, callback: { (): void; (): void; (arg0: Error): void; (): void; }) => {
          // console.log('licenseNo', value)
          if (Utils.isNotEmptyString(value)) {
            if (trim(value) === '*' || value.indexOf('新车') > -1 || (itemConfig.code !== 'licanseNo' && value === '车外')) {
              return callback()
            } else {
              const selected: Option = Utils.getOptionsByValue(get(configStore, '$store.state.taskDispatcher.licenseTypeList'), form.licenseType)
              // console.log(form.licenseType, selected)
              const res = (selected && !/警|军队|其它/ig.test(selected.label as string))
                ? /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/
                : /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9警]{5,6}$/;
              if (res.test(value)) {
                return callback()
              } else
                return callback(new Error());
            }
          }
          return callback()
        },
        trigger: 'blur',
        message: '请录入正确的车牌号！'
      }],
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

