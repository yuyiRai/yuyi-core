import { getItemContainer, castComputed, typeFilterUtils, castArray } from '@yuyi/utils';
import { Input } from 'ant-design-vue/types';
import { Form, WrappedFormUtils, ValidationRule } from 'ant-design-vue/types/form/form';
import { isNil, throttle, debounce, get, merge, set, unset, defaultsDeep } from 'lodash';
import { IDetailFormBase, IFilter, IFilterFunction, IFormItemConfig, IItemConfigGroup, DynamicOptionsLoader, DynamicRuleLoader, DynamicLoader } from './interface';
import { emptyFilter, EPropertyType, StaticUtils, IterableConfigGroup } from './StaticUtils';
import { IKeyValueMap } from '../CommonDataView';
export class Utils<InputForm extends object | {} = any, OutputForm extends object | {} = InputForm> extends StaticUtils<InputForm, OutputForm> {
  [key: string]: any;
  // public filters: IFilter[] = [];
  /**
   * 遍历用config列表，把全部字段整理在一起
   */
  public get configList(): IFormItemConfig[] {
    return this.getProperty(EPropertyType.configList, [])
  };

  public get configCodeMap(): { [key: string]: IFormItemConfig } {
    return this.configList.reduce((arr, item) => Object.assign(arr, { [item.code]: item }), {})
  }

  /**
   * 遍历用config列表，把全部字段整理在一起
   */
  public get filters(): IFilter[] {
    return this.getProperty(EPropertyType.filters, [])
  };
  public form: WrappedFormUtils;

  /** 最后一次更新的值（集合） */
  protected lastChangedValue: InputForm = null;
  /** 最后一次更新了值的表单项code数组 */
  protected lastChangedValueCodes: string[] = []
  /** 最后一次更新了的表单项状态集合 */
  protected lastChangedState: IKeyValueMap<{
    name: string;
    validating: boolean;
    value: any;
    initialValue: any;
    errors: Error[];
  }> = {}
  /** 最后一次更新了值之后的表单项错误信息集合 */
  protected get lastChangedErrors(): IKeyValueMap<Error[]> {
    const errors = {}
    for (const key of Object.keys(this.lastChangedState)) {
      if (this.lastChangedState[key] && this.lastChangedState[key].errors) {
        errors[key] = this.lastChangedState[key].errors
      }
    }
    return errors
  }

  _localFormData: InputForm = {} as InputForm;
  lastLocalForm: InputForm = undefined as InputForm;
  public get localFormData() {
    return this._localFormData
  }
  public set localFormData(form) {
    this.lastLocalForm = this._localFormData
    this._localFormData = form
  }
  // public get safeFormData() {
  //   return cloneDeep({ ...this.localSubmitData })
  // }
  public get localSubmitData(): OutputForm {
    return this.formDataSubmitTransform(this.localFormData);
  }
  public get submitData(): OutputForm {
    return this.localSubmitData;
  }

  /**
   * 全字段的code
   */
  public get codeList(): string[] {
    return this.configList.map(i => i.code)
  }

  public get codeConfigMap() {
    return new Map<string, IFormItemConfig>(this.itemConfig as any)
  }

  /**
   * 通过正则匹配code来获取匹配的配置项中存在的codeList
   * @param match
   * @param reversal  反转
   */
  public matchList(match: RegExp, reversal: boolean): string[] {
    return this.configList.filter(config => reversal ? (!match.test(config.code)) : match.test(config.code)).map(config => config.code);
  }
  public get $autils() {
    return this.$.$autils
  };
  public get $form(): Form {
    return this.$.$form
  };
  public get $set() {
    return this.$.$set
  };
  constructor() {
    super()
    this.formDataLoadTransform = this.formDataLoadTransform.bind(this);
  }

  /**
   * 取得简单的组件可用的placeholder
   * @param item
   */
  protected getPlaceholder(item: IFormItemConfig): string | string[] {
    if (item && item.inputProps) {
      const { disabled, placeholder } = item.inputProps;
      return placeholder != null ? placeholder : `${disabled ? "" : "请输入"}${item.label}`;
    } else if (item) {
      return "请输入" + item.label;
    }
  }

  /**
   * formData翻译器，将报文的数据转换为表单组件可以使用的结构
   * @param formData
   * @param mergeLast 是否将数据到合并上一次的表单
   */
  public formDataLoadTransform(formData: OutputForm, mergeLast: boolean = false): InputForm {
    formData = merge({}, (mergeLast ? this.submitData : {}), formData);
    // console.error('formDataLoadTransform', formData, this.filters)
    // debugger
    this.filters.forEach(([code, filterFrom, filterTo]) => {
      // load优先处理merge-pipe
      const value = filterTo.merge instanceof Array
        ? filterTo.merge.reduce((o, k) => ({ ...o, [k]: get(formData, k) }), {})
        : get(formData, code);
      const toValue = filterFrom(value, formData);
      set(formData, code, toValue);
      // console.error(code, toValue, value)
    });
    return formData as any;
  }


  private mergeValue(formData: any, sourceData: any, keys: string[]) {
    merge(formData, sourceData)
  }

  /**
   * formData翻译器，将表单组件使用的结构数据转换为提交用的报文
   * @param formData
   */
  public formDataSubmitTransform(formData: InputForm): OutputForm {
    // formData = cloneDeep(formData);
    const r = {}
    Object.keys(this.configCodeMap).forEach(code => {
      set(r, code, get(formData, code))
    })
    // console.error('formDataSubmitTransform', formData, this.filters)
    for (const [code, _, filterTo] of this.filters) {
      const value = get(r, code);
      const toValue = filterTo(value, r);
      // submit最后再处理merge-pipe
      if (filterTo.merge) {
        this.mergeValue(r, toValue, filterTo.merge);
        unset(r, code)
      } else {
        set(r, code, toValue === undefined ? null : toValue);
      }
    }
    return r as any;
  }

  public get formItemContainerDefault() {
    return {
      labelCol: { span: 6, xl: 6 },
      wrapperCol: { span: 17, xl: 17 },
      col: 12,
      colon: false
    }
  }
  public getItemContainer(item: any, formItemContainerDefault = this.formItemContainerDefault) {
    const r = {
      colon: formItemContainerDefault.colon,
      ...getItemContainer(item, formItemContainerDefault)
    }
    // console.log(item.code, item.container, getItemContainer(item, formItemContainerDefault))
    return r
  }

  protected configInited = false
  /**
   * 注册配置
   * @param itemConfig
   */
  public configInit(): IItemConfigGroup {
    const CONFIG = this.getProperty(EPropertyType.itemConfig)
    if (!this.configInited) {
      this.fireLoader()
      console.log("CONFIG INIT", this, CONFIG)
      this.configInited = true
    }
    return CONFIG
  }


  /**
   * 注册表单过滤器
   * @param code
   * @param filterFrom
   * @param filterTo
   */
  public registerFilter<InputValue = any, OutputValue = any>(code: string, filterFrom?: false | IFilterFunction<OutputValue, InputValue>, filterTo?: false | IFilterFunction<InputValue, OutputValue>) {
    // console.error('registerFilter', [code, filterFrom, filterTo])
    this.pushFilters([code, filterFrom || emptyFilter, filterTo || emptyFilter]);
  }

  watchFlag: any = null;

  public getConfig(code: string) {
    return this.configCodeMap[code]
  }

  /**
   * 
   * 表单初始化
   * @param initFormData 初始化数据
   * @param instance 组件自身
   * @param force 强制完全清除之前的字段值
   */
  public formInit(initFormData: OutputForm = {} as any, instance: IDetailFormBase, force?: boolean) {
    if (this.watchFlag) {
      this.watchFlag()
      this.watchFlag = null
    }
    // const a = this.$.$watch(() => {
    //   return this.submitData
    // }, () => this.updateDynamicOptionsMap(), { deep: true, immediate: true })
    const b = this.$.$watch(() => {
      return this.$.localInitialValues
      }, () => this.updateDynamicOptionsMap())

    this.watchFlag = () => {
      // a();
      b();
    }

    // 装载form组件
    this.form = this.$form.createForm(instance, {
      onValuesChange: (form, ...args) => {
        // @ts-ignore
        const [update, allValue] = args;
        const lastChangedValueCodes: string[] = []
        // 更新后的数据也包含之前的数据
        const local: InputForm = merge({}, this.localFormData) as any
        // debugger
        const referenceCodes: string[] = []
        for (const [code, value] of Utils.getValuePathIterator(update, this.codeList)) {
          // console.log(code, value)
          set(local, code, value);
          lastChangedValueCodes.push(code)
          const { referenceCodes: itemReferenceCodes = [] } = this.getConfig(code) || {}
          if (itemReferenceCodes) {
            referenceCodes.push(...itemReferenceCodes)
          }
        }
        this.localFormData = local;
        this.lastChangedValue = update;

        this.$.$nextTick(async () => {
          try {
            this.updateDynamicOptionsMap(referenceCodes.concat(lastChangedValueCodes))
            if (referenceCodes.length > 0) {
              await this.$.validate(referenceCodes, false)
              // console.log('field value update', referenceCodes)
            }
          } catch (error) {
            console.error('errors')
          }
        })
        // debugger
        // console.log('onValuesChange', update, this.localFormData, this);
      },
      onFieldsChange: (form, changed) => {
        for (const [code, item] of Utils.getValuePathIterator(changed, this.codeList)) {
          if (item) {
            this.lastChangedState[code] = item
          } else {
            delete this.lastChangedState[code]
          }
        }
        this.lastChangedState = { ...this.lastChangedState }
        // console.log('onFieldsChange', this.lastChangedErrors)
      },
      mapPropsToFields: () => this.mapPropsToFields(initFormData, force)
    });
    return this.form;
  }

  public mapPropsToFields(initFormData: OutputForm, force: boolean) {
    const result = {};
    const localFormData: InputForm = this.formDataLoadTransform(initFormData)
    for (const config of this.configList) {
      const code = config.code;
      let initialValue: any = get(localFormData, code);
      let changed = false
      if (initialValue == null) {
        initialValue = castComputed(config.value || config.defaultValuel, initialValue, this.configList);
        changed = true
      }
      if (!force) {
        set(localFormData, code, get(this.localFormData, code, initialValue));
      } else if (changed) {
        set(localFormData, code, initialValue)
      }
      set(result, code, this.$form.createFormField({ name: code, value: initialValue, initialValue }));
    }
    this.localFormData = localFormData
    this.lastChangedValue = this.localFormData
    // console.log('mapPropsToFields', result, this.localFormData);
    return result;
  }

  public staticOptions: { [key: string]: any; } = {};
  public setLoaderResult<R>(type: 'options' | 'rules', code: string, options: R[]) {
    options = Object.freeze(options) as any
    this.$set(this.staticOptions, code, options);
    return this.staticOptions[code]
  }

  /**
   * 安全取得InputProps的options属性
   * @param item
   */
  public getOptions(item: IFormItemConfig<any>) {
    const getOptions = item && item.inputProps && item.inputProps.options;
    if (getOptions instanceof Array) {
      return getOptions;
    } else if (typeof getOptions === 'string') {
      return this.staticOptions[getOptions] || [];
    } else if (this.staticOptions[item.code] instanceof Array) {
      return this.staticOptions[item.code];
    } else if (typeof getOptions === 'function') {
      // console.log('getOptions', item.code)
      return this.getDynamicLoadOptions('options', item.code);
    } else {
      return [];
    }
  }
  public getRules(item: IFormItemConfig): ValidationRule[] {
    return (item.rules || []).map(rule => {
      if (typeof rule === 'string') {
        return this.staticOptions[rule]
      } else if (typeof rule === 'function') {
        return this.getDynamicLoadOptions('rules', item.code)
      }
      return rule
    }).flat()
  }

  dynamicOptionsMap = {}

  /**
   * 判断表单项是否在加载数据项配置
   * @param item 
   */
  public isOptionsLoading(item: IFormItemConfig): boolean {
    const options = item.inputProps && item.inputProps.options
    return options && this.$.spinningActionMap[typeFilterUtils.isStringFilter(item.inputProps.options) || 'utils:loader:*options:' + item.code]
  }

  public registerOptionsLoader<T>(type: 'options', code: string, fetch: DynamicLoader<T[]>): Promise<T[]>;
  public registerOptionsLoader<T extends ValidationRule>(type: 'rules', code: string, fetch: DynamicLoader<T | T[]>): Promise<T | T[]>;
  /**
   * 注册OptionsLoader
   * 此方法为动态配置项准备，传入表单值和组件本身来取得最终的options
   * @param code item.config
   * @param fetch 获取数据的方法
   */
  public registerOptionsLoader<T>(type: 'rules' | 'options', code: string, fetch: DynamicLoader<T | T[]>): Promise<T | T[]> {
    const loadKey = 'utils:loader:*' + type + ':' + code;
    return StaticUtils.registerOptionsLoader(type, this, loadKey, async () => fetch(this.submitData, this))
  }

  public getDynamicLoadOptions(type: 'rules' | 'options', code: string) {
    const loadKey = 'utils:loader:*' + type + ':' + code;
    if (!this.dynamicOptionsMap[loadKey]) {
      this.dynamicOptionsMap[loadKey] = []
    }
    return this.dynamicOptionsMap[loadKey];
  }

  /**
   * 
   * @param codeList 指定code
   */
  async updateDynamicOptionsMap(codeList?: string[]) {
    const loadedOptions = this.dynamicOptionsMap
    const taskList: Promise<['options' | 'rules', string, any]>[] = []
    for (const [code, item] of this.itemConfig) {
      if (!codeList || codeList.includes(code)) {
        const getOptions = item && item.inputProps && item.inputProps.options;
        if (typeof getOptions === 'function') {
          taskList.push(this.registerOptionsLoader('options', code, getOptions).then(r => ['options', code, r]))
        }
        for (const getRule of castArray(item.rules)) {
          if (typeof getRule === 'function') {
            taskList.push(this.registerOptionsLoader('rules', code, getRule).then(r => ['rules', code, r]))
          }
        }
      }
    }
    for await (const [type, code, result] of taskList) {
      const loadKey = 'utils:loader:*' + type + ':' + code;
      if (result !== loadedOptions[loadKey]) {
        loadedOptions[loadKey] = result
        // console.log('update', code, 'type', this.dynamicOptionsMap)
      }
    }
    this.dynamicOptionsMap = { ...loadedOptions }
  }
  created() {
    this.updateDynamicOptionsMap = debounce(throttle(this.updateDynamicOptionsMap, 1000, {}), 0)
  }

  /**
   * 取得表单控件的props
   * @param item 预配置
   */
  public getItemInputProps(item: IFormItemConfig) {

    return {
      ...item.inputProps,
      options: this.getOptions(item),
      placeholder: this.getPlaceholder(item)
    }
  }

  public get installedItemConfigGroup() {
    const group: IItemConfigGroup = {} as any
    for (const [code, config] of this.itemConfig) {
      const r: IFormItemConfig = {
        ...config,
        itemOptions: this.getItemDecorator(config),
        inputProps: this.getItemInputProps(config)
      }
      group[code] = r as any
    }
    return Utils.createIteratorConfig(group)
  }

  /**
   * 取得表单项配置
   * @param item 预配置
   */
  public getItemDecorator(item: IFormItemConfig) {
    // console.log(rules)
    return {
      validateTrigger: 'blur',
      preserve: true,
      initialValue: item.value || null,
      ...(item.itemOptions || {}),
      rules: this.getRules(item)
    }
  }

  /**
   * 更新form值
   * @param formData
   * @param defalutTo 设置默认值（如果form已录入值则使用录入值）
   * @remarks
   * 这个方法传递的是报文提供的值，直接设置组件使用的值请使用this.form.setFieldsValue
   */
  public formDataUpdate(formData: OutputForm, defalutTo = false) {
    let inputForm = this.formDataLoadTransform(formData)
    if (defalutTo) {
      inputForm = defaultsDeep(this.localFormData, inputForm)
      // debugger
    }
    this.$.$nextTick(() => {
      this.form.setFieldsValue(inputForm);
    })
  }
}
