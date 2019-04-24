/* eslint-disable */
import { autobind } from 'core-decorators';
import { difference, isNil, forEach, map, set, trim, isRegExp, keys, isError, toString } from 'lodash';
import { action, computed, extendObservable, isComputedProp, observable, observe, reaction, IKeyValueMap, IReactionDisposer, IReactionOptions, IReactionPublic, IObservableValue, IComputedValue, IValueDidChange, Lambda } from 'mobx';
import { EventStoreInject } from '../../utils/EventStore';
import { asyncComputed } from '../../utils/AsyncProperty';
import { Utils } from '../../utils/Utils';
import { DisplayConfig } from './ItemDisplayConfig';
import { getDefaultRules } from './input/Date';
import { Option } from '../../utils';

export type ValidatorCallback = (error?: string | Error) => void
export type RuleConfig<T = any> = {
  validator?(rules: any, value: T, callback: ValidatorCallback): void,
  strict?: boolean | undefined,
  trigger?: 'change' | 'blur' | Array<'change' | 'blur'>,
  message?: string,
  pattern?: RegExp,
  required?: boolean
}
export type RuleConfigList<T = any> = Array<RuleConfig<T>>
export type RuleConfigGetter<T = any> = (...args: any[]) => RuleConfig<T> | RuleConfigList<T>
export type RuleConfigMap<T = any> = { [k: string]: RuleConfig<T> | RuleConfigList<T> | RuleConfigGetter<T> }

export interface IItemConfig {
  multiple?: boolean;
  [key: string]: any;
}

@EventStoreInject(['options-change'])
export class ItemConfig implements IItemConfig {
  [key: string]: any;
  destorySet: Set<IReactionDisposer | Lambda> = new Set<IReactionDisposer | Lambda>()
  @observable.ref i: IKeyValueMap = {};
  @observable.ref iKeys: string[] = []
  /**
   * @type { FormStore }
   */
  // @observable formStore;
  // @computed get form() {
  //   return this.formStore ? this.formStore.form : {}
  // }
  @observable.ref form: IKeyValueMap;
  @observable.ref componentProps: IKeyValueMap = {}
  @observable.shallow initConfig = observable.map({})
  @observable $version = 0
  // @observable loading = false;
  @observable displayConfig = new DisplayConfig()
  @computed get displayProps() {
    return this.displayConfig.init(this, this.componentProps)
  }
  @computed get isViewOnly() {
    // console.log(this.props)
    return this.viewOnly! || (this.componentProps && (this.componentProps.viewOnly || this.componentProps.formStatus === 'view'))
  }
  @computed get otherKey() {
    return difference(
      this.iKeys,
      keys(this),
      ['refConfig', 'code', 'label', 'required', 'hidden', 'rule', 'remoteMethod', 'loading', 'options', 'isViewOnly']
    )
  }
  constructor(initModel: any, form: any = {}, componentProps: any = {}) {
    // this.reaction(()=>this.remoteOptions, options=>{
    //   console.log('remoteOptions change', this.i.label, options, this)
    // })
    // this.reaction(() => this.loading, options=>{
    //   console.log('loading change', this.i.label, options)
    // })
    this.reaction(() => this.i, (i: any) => {
      // console.log('register', i)
      for (const name of ['loading', 'options']) {
        this.registerKey(i, name)
      }
      this.observe(i, (e: any) => {
        this.$version++
        // console.log(e)
        const { oldValue, newValue, name } = e;
        if (name === '$$core_options' && !Utils.isEqual(oldValue, newValue)) {
          this.label ==='诊断名称' && console.log(
            `${name}: options[${(oldValue||[]).length}] => options[${(newValue||[]).length}]`, { config: i, event: e })
          if(newValue) {
            this.optionsInited = Utils.isNotEmptyArray(newValue)
          }
          this.$emit('options-change', e.newValue)
        }
        // console.log(`${e.name}: ${e.oldValue} => ${e.newValue}`, {config: i, event: e})
      })
      // this.$emit('options-change', this.options)
      // this.reaction(() => i.loading, value => {
      //   // this.loading = value
      //   console.log('i loading change', this.i.label, value)
      // }, { fireImmediately: true })
      this.registerObservables(i)
    }, { fireImmediately: true })
    if (initModel) {
      this.init(initModel, form, componentProps)
    }

  }

  @autobind reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions) {
    this.destorySet.add(reaction(source, callback, options))
  }
  @autobind observe<T = any>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean) {
    this.destorySet.add(observe(value, listener, fireImmediately))
  }


  @action.bound registerObservables(baseConfig: any) {
    for (const key of this.otherKey) {
      // const keyName = _.camelCase("set-"+key)
      if (!isComputedProp(this, key)) {
        const thisArg = this;
        extendObservable(this, {
          get [key]() {
            return Utils.isNumber(thisArg.$version) && thisArg.getComputedValue(key, baseConfig)
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

  @autobind registerKey(i: any, key: string) {
    const defaultV = i[key]
    const coreKey = `$$core_${key}`;
    observable.ref(i, coreKey, {
      value: defaultV,
      enumerable: false,
      configurable: true
    })
    computed(i, key, {
      get() {
        return (this[coreKey])
      },
      set(value) {
        this[coreKey] = value
      }
    })
    // set(this.i, key, defaultV)
    // extendObservable(, {
    //   [key]: defaultV
    // }, {}, { deep: false })
  }

  @action.bound setForm(form: any) {
    // if(form instanceof FormStore){
    //   this.formStore = form
    // } else if(form){
    //   const getter = FormStore.registerForm(form)
    //   if(!this.formStore || this.getter !== this.formStore)
    //     this.formStore = getter
    //   else 
    //     this.formStore.setForm(form)
    // }
    this.form = form;
  }
  optionsInited = false
  @action.bound setConfig(next: any) {
    if (Utils.isEqual(this.i, next))
      this.registerObservables(this.i)
    else {
      this.iKeys = Object.keys(next)
      this.registerObservables({ ...next })
      this.i = next;
      this.optionsInited = false
      if (Utils.isFunction(next.refConfig)) {
        Reflect.apply(next.refConfig, this, [this])
      }
    }
  }

  @action.bound init(initModel: IKeyValueMap, form: IKeyValueMap, componentProps = {}) {
    this.setConfig(initModel || {})
    this.setForm(form)
    this.componentProps = componentProps
  }

  @autobind getComputedValue(key: string, target: any = this.i, defaultValue?: any) {
    const keyValue = target[key] //(action(Utils.getPropertyFieldByCreate))(this.i, [key, defaultValue])
    // if(keyValue !== this.i[key]) {
    //   this.updateVersion()
    // }
    if (!(/(^refConfig$)|^(on|get(.*?))|((.*?)Method)$|(.*?)filter(.*?)/.test(key)) && (keyValue instanceof Function)) {
      const computedValue = keyValue(this.form || {}, this)
      return Utils.isNil(computedValue) ? defaultValue : computedValue
    }
    return keyValue
  }

  /**
   * 是否控制必录
   */
  @computed.struct get required() {
    return this.$version > -1 && this.getComputedValue('required');
  }
  /**
   * 是否
   */
  @computed.struct get hidden() {
    return Utils.isNumber(this.$version) && this.getComputedValue('hidden');
  }
  @computed.struct get label() {
    return this.getComputedValue('label');
  }
  @computed.struct get type() {
    return this.i.type;
  }
  @computed.struct get code() {
    return this.i.code;
  }
  @computed.struct get nameCode() {
    return this.i.nameCode;
  }

  @computed.struct get searchName() {
    return this.getSearchName()
  }
  @autobind getSearchName() {
    const { nameCode } = this;
    return !isNil(nameCode) ? (this.form || {})[nameCode] : (this.form || {})[this.code]
  }

  @computed.struct get currentValue() {
    return (this.form || {})[this.code]
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

  @asyncComputed({
    type: Array,
    defaultValue: [],
    time: 100,
    watcher: 'searchName'
  }) get remoteOptions(): Promise<any[]> | any[] {
    return this.remoteMethod ? this.remoteSearchBySearchName(this.searchName) : this.options
  }

  @autobind async remoteSearchBySearchName(keyWordStr: string) {
    if (Utils.isString(keyWordStr)) {
      return await this.remoteSearch(keyWordStr.split(','))
    }
    return await this.remoteSearch(keyWordStr)
  }
  @autobind async remoteSearch(keyWord: string[]) {
    const { remoteMethod, multiple } = this;
    let nextOptions: Option[] = []
    if (Utils.isFunction(remoteMethod)) {
      this.setLoading(true)
      if (multiple) {
        const keyWordArr: string[] = Utils.zipEmptyData(Utils.castArray(keyWord));
        if (keyWordArr.length > 0) {
          try {
            await Promise.all(map(keyWordArr, async keyWord => {
              // console.log('keyWord', keyWord)
              // console.log('remoteSearch start', keyWord)
              const data = await remoteMethod(keyWord, this.form);
              Utils.arrayPush(nextOptions, data)
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
      this.setLoading(false)
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
    return this.isViewOnly ? [] : this.getRuleList(i, componentProps)
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

  @computed get loading() {
    return this.i.loading
  }
  @action.bound setLoading(v: boolean) {
    // console.error('setLoading', v)
    this.i.loading = v
    // this.updateVersion()
  }
  @computed get allowCreate(): boolean | ((data: any, form?: any) => Option) {
    return this.getComputedValue('allowCreate') || false
  }
  @computed get allowInput(): boolean {
    return this.getComputedValue('allowInput') || (this.type=='search' && !this.multiple)
  }
  /**
   * @type { Array } 配置项Array
   */
  @computed get options(): Option[] {
    // trace()
    // this.label === '归属车辆' && console.log('伤者类型 get options', Utils.isArrayFilter(this.$version, this.getComputedValue('options'), []))
    return Utils.isArrayFilter(this.$version, this.i.options, this.getComputedValue('options')) || []
  }
  @action.bound setOptions(v: any) {
    if (!Utils.likeArray(this.options, v)) {
      // this.label === '诊断名称' && console.log('设置Option', this.i.label, this.options, v)
      this.i.options = v
      this.updateVersion()
      // console.log('setOptions', v)
      this.$emit('options-change', v)
    }
  }
  @action updateVersion() {
    this.$version = this.$version + 1
  }

  export() {
    const model = {}
    for (const key in this.i) {
      model[key] = this.getComputedValue(key)
    }
    return model;
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

  destory() {
    for (const destory of this.destorySet) {
      destory()
    }
    this.destorySet.clear();
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
    if (Utils.isNumber(this.$version) && this.requiredRule) {
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
    if (this.i.type=='select' || this.i.type==='search') {
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

  @autobind async getOptionsSafe(): Promise<Option[]> {
    if (this.type === 'search' && (this.options.length === 0 || !this.optionsInited)) {
      if (!Utils.isArrayFilter(this.remoteOptions)) {
        console.log('safe start', this.label, this.remoteOptions, this.options)
        const b = reaction(() => this.remoteOptions, options => {
          console.log('safe end', this.label, options)
          b()
          return options
        })
      }
      return this.remoteOptions;
    }
    return this.options;
  }

  @computed get defaultRule() {
    return this.$version > -1 && Object.assign(ItemConfig.getDefaultRules(this, this.componentProps.$store.state.taskDispatcher), getDefaultRules(this))
  }
  static getDefaultRules(itemConfig: ItemConfig, configStore: any): RuleConfigMap {
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
      plusOnly: (form: any, config: { label: any; }) => [{
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
              const selected: Option = Utils.getOptionsByValue(configStore.licenseTypeList, form.licenseType)
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

