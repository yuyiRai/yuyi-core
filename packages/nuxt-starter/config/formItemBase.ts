/* eslint-disable */
import { CardFormItem, CheckableSelect, InputType, OrgSelectTree, ProcessTextArea, QuillEditor, SafeComponentType, SummaryQt, useReadonly } from '@/components';
import { ActionFormItem } from '@/components/CommonDataView/components/Containers/ActionFormItem';
import { AppendConfigPipe, AppendConfigPipeFunction, createPipe, IFormItemConfig } from '@/components/CommonFormBase/interface';
import { emptyFilter, IUtils } from '@/components/CommonFormBase/StaticUtils';
import { Utils } from '@/components/CommonFormBase/Utils';
import { FormItemInputInject } from '@/components/CommonFormBase/utils/ComponentInject';
import DateRangePicker from '@/components/CommonItemComponent/DateRangePicker';
import store from '@/store';
import { isNotEmptyValue, isNumber, zipEmptyData, isEmptyArrayStrict } from '@yuyi/utils';
import { Checkbox, Input, InputNumber, Radio, Select } from 'ant-design-vue';
import DatePicker from 'ant-design-vue/es/date-picker';
import { FormItem } from 'ant-design-vue/types/form/form-item';
import { castArray, get, isArray, isNil, map, merge, set, toLength, isString } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import { IAutoOperationBarProps } from '@/components/CommonButton/AutoOperationBar/interface';

function appendRule({ rules = [] }: IFormItemConfig<any>, ...appendRules: any) {
  return [...(rules || []), ...appendRules]
}

/**
 * 码表查询
 * @param codeType
 */
export function getOptions(codeType: string, cacheTime = 10000) {
  return store.dispatch('GetOptions', [`codeList:${codeType}`, () => [codeType], cacheTime])
}

function mergeConfigNext(pipe: AppendConfigPipe<any>, next?: AppendConfigPipe<any>) {
  return function (config: IFormItemConfig<any>, instance: IUtils, ...other: any[]) {
    const base = pipe instanceof Function ? pipe(config, instance, ...other) : pipe;
    if (!next) {
      return base;
    }
    const nextPipe = mergeConfigNext(next)(config, instance, ...other)
    return base instanceof Object ? merge(base, nextPipe) : nextPipe
  }
}

export function mergeConfig(...pipe: AppendConfigPipe<any>[]) {
  const list = pipe.reduce((pipe: AppendConfigPipeFunction<any, any>[], pipeNext: AppendConfigPipe<any>, index: number) => {
    return pipe.concat([pipeNext instanceof Function ? pipeNext : () => pipeNext])
  }, [])
  return
}

declare global {
  export enum ItemConfigType {
    /**
     * 分割
     */
    tags
  }
}

export type ParamExcludeSecond<T> = T extends ((a: any, b: any, ...c: infer P) => any) ? P : never
export type BasePipeGroup = ReturnType<typeof getBaseConfig>
export type BasePipeKey = keyof BasePipeGroup
export type PipeComponent<T, Default = typeof Input> = SafeComponentType<T extends (
  string[] | AppendConfigPipeFunction<any, infer C> | Partial<IFormItemConfig<infer C>>
) ? C : never, Default>

/**
 * 创建config工具类
 */
export class ConfigFactory<T extends InputType = typeof Input, Containers extends typeof Vue = typeof FormItem> {
  public static create<T extends InputType = typeof Input, Containers extends typeof Vue = typeof FormItem>(code: string, label?: string, component?: T, containers?: Containers): ConfigFactory<T, Containers>;
  public static create<T extends InputType = typeof Input, Containers extends typeof Vue = typeof FormItem>(config: IFormItemConfig<any>): ConfigFactory<T, Containers>;
  public static create(code: IFormItemConfig<any> | string, label?: string, component?: any, containerComponent?: any) {
    return new ConfigFactory(code instanceof Object ? code : {
      code,
      label,
      component,
      containerComponent
    })
  }

  config: IFormItemConfig<T, Containers>;
  constructor(config: IFormItemConfig<T, Containers>) {
    this.config = config;
  }

  /**
   * 连接type管道
   * @param config 
   * @param params 
   */
  public type<
    K extends BasePipeKey,
    P extends ParamExcludeSecond<BasePipeGroup[K]>, // 排除固定参数之后的剩余参数
    NextT extends PipeComponent<BasePipeGroup[K], T>
  >(
    config: K,
    ...params: P extends never ? [] : ParamExcludeSecond<BasePipeGroup[K]>
  ): ConfigFactory<NextT, Containers>;
  public type(config: string, ...params: any[]) {
    const pipe = params.length > 0 ? [config, ...params] : config
    if (!this.config.type) {
      this.config.type = [pipe]
    } else {
      this.config.type.unshift(pipe)
    }
    return this
  }

  /**
   * 合并InputProps
   * @param props 
   */
  public mergeInputProps(props: IFormItemConfig<T, Containers>['inputProps']) {
    this.config.inputProps = merge(this.config.inputProps, props)
    return this
  }

  /**
   * 合并配置
   * @param props 
   */
  public merge(props: IFormItemConfig<any>) {
    this.config.inputProps = merge(this.config.inputProps, props)
    return this
  }
}
export type A = BasePipeGroup['split'];
export type B = PipeComponent<A>;
export type C = ParamExcludeSecond<A>;

ConfigFactory.create('app', '标准')
  .type('select')
  .type('split', '^')
  .type('required', 'pppppppp')
  .mergeInputProps({})
  .config;

export function getBaseConfig() {
  const filterOptions = {
    /**
     * 传入以',’分割的字符，通过这个配置转化为数组，提交时再用','拼接
     */
    split: createPipe((obj, instance, splitStr: string = ',') => {
      instance.registerFilter(obj.code,
        (value: string, form) => {
          const toValue = (isNil(value) || !value.split || value.length === 0) ? undefined : value.split(splitStr)
          // console.error('registerFilter', obj.code, value, toValue, form)
          return toValue
        },
        (value: string[], form) => {
          const toValue = (isArray(value) && value.length > 0) ? value.join(splitStr) : undefined
          // console.error('registerFilter', obj.code, value, toValue, form)
          return toValue
        }
      )
    }),
    merge: createPipe((obj, instance, ...codes: string[]) => {
      const filter = v => {
        v = v || {}
        return v
      }
      filter.merge = codes
      instance.registerFilter(obj.code, filter, filter)
    }),
    flag: createPipe((obj, instance, options: [string, string] = ['0', '1']) => {
      instance.registerFilter(
        obj.code,
        v => options[1] === v + '',
        v => v === true ? options[1] : options[0]
      )
    })
  }
  const black = ['select']
  const rules = {
    /** 鼠标移出组件时自动校验 */
    validateHoverout: createPipe({ itemOptions: { validateTrigger: ['mouseleave', 'blur'] } }),
    /** 数组表单值的严格校验 */
    arrayValue: createPipe({
      itemOptions: {
        normalize: (v, preV, allV) => {
          // console.log(v)
          // 空数组自动转化为undefinend
          return isEmptyArrayStrict(v) ? undefined : v
        }
      }
    }),
    /** 校验必录并对应数组为空的情况 */
    required: createPipe((obj, instance, message = `请${
      !obj.type || (obj.type as any[]).find(t => t && (black.includes(t) || black.includes(t[0]))) ? '选择' : '录入'
      }${obj.label}`) => ({
        rules: appendRule(obj, {
          required: true,
          validator(rule, value, callback) {
            // console.log(obj.label, value, isNotEmptyValue(value), isNotEmptyValue)
            if (Array.isArray(value) && value.length === 0) {
              return callback(new Error('请至少录入一项'))
            }
            return isNotEmptyValue(value) ? callback() : callback(new Error(message))
          },
          message: undefined
        })
      })),
    /** 字符串长度 */
    length: createPipe((obj, instance, length?: number | [number, number], transform?: Function) => {
      let [min, max] = castArray(length) as [number?, number?]
      min = toLength(min)
      max = toLength(max)
      if ((min >= 0 || length instanceof Array)) {
        const lengthHint = min && max ? `${min}~${max}` : min || max
        const errorHint = min && max ? '之间' : min > 0 ? '以上' : '以下'
        return ({
          rules: appendRule(obj, {
            validator(rules, value, callback) {
              if (typeof value === 'string' && !(value.length >= min && (max === 0 || (max > min && value.length <= max)))) {
                return callback(new Error(`请将长度控制在${lengthHint}个${errorHint}`))
              }
              callback()
            },
            transform
          })
        })
      }
      return {}
    }),
    /** 联系方式校验 */
    phone: createPipe({
      rules: [{
        validator: (rule, value, callback) => {
          // console.error(value)
          castArray(value).forEach(value => {
            if (
              value != null &&
              !/^[1][3,4,5,7,8][0-9]{9}$/.test(value) && // 手机号
              !/^0[0-9]{2,3}-[0-9]{8}$/.test(value) // 固话
            ) {
              return callback(new Error(`请输入正确的联系电话：1）	手机：11位手机号码；2）	固定电话：区号+“-”+固定电话
              `))
            }
          })
          return callback()
        }
      }]
    })
  }

  const date = createPipe((obj, instance, formatter = 'YYYY-MM-DD', displayFormat = 'YYYY-MM-DD') => {
    instance.registerFilter(obj.code,
      v => {
        const r = v ? moment(v, formatter) : undefined
        return r
      },
      (value) => value ? moment(value).format(formatter) : undefined
    )
    return {
      component: {
        props: DatePicker.props,
        render(h) {
          return h(DatePicker, { props: zipEmptyData(this.$props, true), attrs: this.$attrs, on: this.$listeners })
        }
      },
      itemOptions: { validateTrigger: "change" },
      inputProps: {
        format: displayFormat
      }
    }
  })
  const inputOptions = {
    date,
    datetime: createPipe((obj, instance, formatter = 'YYYY-MM-DD HH:mm:ss', displayFormat = 'YYYY-MM-DD HH:mm:ss') => {
      const r = date(obj, instance, formatter, displayFormat)
      return merge(r, {
        inputProps: {
          showTime: true
        }
      })
    }),
    tags: createPipe((config, instance, splitStr = ',') => {
      // @ts-ignore
      baseOptions.split(config, instance, splitStr)
      return merge(rules.arrayValue, {
        component: Select,
        itemOptions: { validateTrigger: "change" },
        inputProps: {
          'autoFocus': false,
          mode: 'tags',
          options: [],
          notFoundContent: '请输入' + config.label,
          tokenSeparators: [splitStr],
          allowClear: true,
          filterOption: () => true
        }
      })
    }),
    area: createPipe((obj, instance, length?: [number, number]) => {
      return ({
        ...rules.length(obj, instance, length),
        component: ProcessTextArea,
        itemOptions: { validateTrigger: "change", trigger: 'change' },
        inputProps: {
          length,
          disalowLonger: false,
          component: Input.TextArea
        }
      })
    }),
    richText: createPipe((obj, instance, length?: number | [number, number]) => {
      /**
       * 组件内维护着两个值[HTML文本/InnerText]
       * 传入组件时如果value不为数组，则将文本放于[HTML文本], InnerText由组件内部的逻辑自动生成
       * 提交时只取[HTML文本]
       */
      instance.registerFilter(obj.code,
        v => v instanceof Array ? v : (v ? [v] : undefined),
        v => v instanceof Array ? v[0] : undefined
      )

      /**
       * 校验转换，取[HTML文本/InnerText]中的InnerText来校验长度
       * 如果有[InnerText]则取出并进行格式清理
       * @param value value
       */
      const { getNormalizeValue } = QuillEditor as any
      return ({
        // 校验时
        ...rules.length(obj, instance, length, getNormalizeValue),
        component: ProcessTextArea,
        itemOptions: {
          validateTrigger: "changeValues",
          trigger: 'changeValues'
        },
        containerProps: {
          selfUpdate: true
        },
        inputProps: {
          length,
          eventName: 'changeValues',
          getNormalizeValue, // 进度条判断时
          disalowLonger: false,
          component: QuillEditor as any,
          progressProps: {
            size: null
          }
        }
      })
    }),
    dateRange: createPipe((obj, utils, format: string) => {
      const placeholder = obj.inputProps && obj.inputProps.placeholder
      const fieldName = obj.code.split(',')
      filterOptions.merge(obj, utils, ...fieldName)
      return ({
        component: DateRangePicker.TypeA,
        inputProps: {
          placeholder: placeholder instanceof Array ? placeholder : ['起始时间', '截止时间'],
          format,
          fieldName,
          showTime: true
        }
      })
    }),
    select: createPipe((obj, instance, showSelectAll = false) => {
      const mode = obj.inputProps && obj.inputProps.mode
      const isMultiple = (mode && mode !== 'default') || showSelectAll;
      instance.registerFilter(obj.code, (v) => {
        // console.log(v)
        // select组件会把null当成一个值而非为空，导致显示不出占位符
        return isNumber(v) ? v + '' : (v === null ? undefined : v)
      })
      return merge(rules.arrayValue, {
        component: showSelectAll ? CheckableSelect : Select,
        inputProps: {
          placeholder: `请选择${obj.label}`,
          showSearch: false,
          mode: isMultiple ? 'multiple' : mode
        },
        itemOptions: {
          validateTrigger: "change"
        }
      })
    }),
    readonly: useReadonly(),
    number: createPipe(() => {
      return {
        component: FormItemInputInject(InputNumber),
        itemOptions: {
          validateTrigger: 'change',
          trigger: 'blur'
        }
      }
    }),
    radio: createPipe({
      component: Radio.Group,
      inputProps: {
        options: []
      },
      containerProps: {
        hasFeedback: false
      }
    }),
    /** 单选框形式的是否标志 */
    radioFlag: createPipe((item, utils, transformer: [string, string] = ['1', '0']) => {
      // filterOptions.flag(item, utils)
      return {
        component: Radio.Group,
        inputProps: {
          options: [{
            label: '是',
            value: transformer[0]
          }, {
            label: '否',
            value: transformer[1]
          }]
        },
        containerProps: {
          hasFeedback: false
        }
      }
    }),
    checkFlag: createPipe((item, utils, hintText = '是') => {
      filterOptions.flag(item, utils)
      return {
        component: Checkbox,
        innerHTML: hintText,
        itemOptions: {
          valuePropName: 'checked'
        },
        containerProps: {
          hasFeedback: false
        }
      }
    })
  }


  const baseOptions = {
    ...inputOptions,
    ...filterOptions,
    ...rules,
    dataType: createPipe({
      inputProps: {
        options: map({ N: '新增', C: '修改', D: '删除大额交易报告有' }, (label, value) => ({ label, value }))
      }
    }),
    // 对应'是否只读'为是
    disabled: createPipe({
      inputProps: {
        disabled: true
      }
    }),
    cardItem: createPipe({
      containerComponent: CardFormItem
    }),
    actions: createPipe((item, utils, props?: IAutoOperationBarProps) => {
      return {
        containerComponent: ActionFormItem,
        containerProps: props || {
          actions: [
            { name: item.code, title: item.label }
          ],
          align: 'center'
        }
      }
    }),
    /**
     * @param mainCode - （主要）证件类型的代码
     */
    IdCardNo: createPipe((item, utils, mainCode: string) => {
      return {
        rules: [
          (formData: any, utils: Utils) => ({
            validator(rules, value, callback) {
              console.log('IdCardNo, validate', value)
              if (!value || !["110003", "110001"].includes(get(utils.localFormData, mainCode)) || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                return callback()
              }
              callback('请录入正确的身份证号！')
            }
          })
        ]
      }
    }),
    /**
     * 直接指定配置项
     * @param type - 配置项key
     * @param value -值
     */
    force(config, instance, type: string, value: string) {
      return set({}, type, value)
    },
    /**
     * 通用码表载入
     */
    intCodeTable: createPipe<typeof Select>((item, instance: IUtils, codeType) => {
      if (typeof codeType !== 'string') {
        return {}
      }
      return Utils.registerOptions(codeType, async () => [codeType])(item, instance)
    }),
    mount: createPipe((config, instance: IUtils) =>
      merge(inputOptions.number, {
        inputProps: {
          precision: 3
        }
      })
    ),
    year: {
      component: SummaryQt
    }
  }
  return baseOptions
}
