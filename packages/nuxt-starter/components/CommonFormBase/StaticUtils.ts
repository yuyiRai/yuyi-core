import { uuid } from '@yuyi/utils';
import { cloneDeep, merge, set } from 'lodash';
import { CommonFormBaseMixins } from './CommonFormBaseMixins';
import { AppendConfigPipeFunction, IAppendGroupPipeGroup, IFilter, IFilterFunction, IFormItemConfig, IItemConfigGroup, DynamicRuleLoader, DynamicLoader } from './interface';
import { Utils } from './Utils';
import { registerDefaultOptions } from './utils/initConfig';
import { createForm } from '../CommonDataView/createForm';
import { convertArr2Map } from '@/utils/CommonUtils';
import { ValidationRule } from 'ant-design-vue/types/form/form';

export const emptyFilter = (value: any) => value
export const enum EPropertyType {
  configList,
  filters,
  loaders,
  itemConfig,
  initialValue
}
/**
 * @description
 * [配置项的code,配置项,配置项在配置组Key,组内的index]
 */
export type ConfigGroupIteratorMeta = [string, IFormItemConfig<any, any>, string, number]
export type ConfigGroupIterator = Iterable<ConfigGroupIteratorMeta>
export type IterableConfigGroup = IItemConfigGroup & ConfigGroupIterator
export type Loader<Name extends string = string, Utils extends StaticUtils = StaticUtils, DisplayName extends string = Name> = [Name, (utils: Utils) => string | object | Promise<any>, DisplayName?]

export interface IUtils {
  [EPropertyType.filters]: IFilter[];
  /**
   * 遍历用config列表，把全部字段整理在一起
   */
  [EPropertyType.configList]: IFormItemConfig[];
  [EPropertyType.itemConfig]?: IterableConfigGroup;
  [EPropertyType.initialValue]?: any;
  [EPropertyType.loaders]: Loader[];
  $$$key?: string;
  /**
   * 注册表单过滤器
   * @param code
   * @param filterFrom
   * @param filterTo
   */
  registerFilter<InputValue, OutputValue>(code: string, filterFrom?: false | IFilterFunction<OutputValue, InputValue>, filterTo?: false | IFilterFunction<InputValue, OutputValue>): void;
}

export const _KeyFlag = '$$$Key'
export class StaticUtils<InputForm = any, OutputForm = any> {
  public $$$key: string;
  protected $: CommonFormBaseMixins<InputForm, OutputForm>;
  private static _Global = new Map<string, IUtils>();
  protected $static = StaticUtils;
  get $global() {
    return StaticUtils._Global;
  }

  /**
   * 注册配置
   * @param $$$key - uuid
   * @param itemConfig - 配置集合
   * @param initialValue - 初始值集合
   * @param appendConfigPipe - 追加管道
   */
  public static configInit($$$key: string, itemConfig: IItemConfigGroup = {}, initialValue: any = {}, appendConfigPipe?: IAppendGroupPipeGroup) {
    const cache: IUtils = {
      [EPropertyType.filters]: [],
      [EPropertyType.configList]: [],
      [EPropertyType.itemConfig]: null,
      [EPropertyType.loaders]: [],
      [EPropertyType.initialValue]: cloneDeep(initialValue),
      $$$key,
      registerFilter(code, filter, filterTo) {
        cache[EPropertyType.filters].push([code, filter || emptyFilter, filterTo || emptyFilter]);
      }
    };
    cache[EPropertyType.itemConfig] = StaticUtils.createIteratorConfig(
      StaticUtils.mapConfigGroup(
        itemConfig,
        (config, index, groupKey) => {
          config = registerDefaultOptions(
            cloneDeep(config), cache as any, appendConfigPipe
          )
          cache[EPropertyType.configList].push(Object.freeze(config));
          return config
        }
      )
    );
    return cache as IUtils;
  }

  public static createIteratorConfig(configGroup: IItemConfigGroup): IterableConfigGroup {
    Object.defineProperty(configGroup, 'cacheMap', {
      value: new WeakMap(),
      writable: false,
      enumerable: false,
      configurable: false
    })
    Object.defineProperty(configGroup, Symbol.iterator, {
      value() {
        return StaticUtils.configGroupIterator(this, this.cacheMap)
      },
      writable: false,
      enumerable: false,
      configurable: false
    })
    return configGroup as any
  }

  public static registerConfig(config: IItemConfigGroup, initialValue?: any, appendConfigPipe?: IAppendGroupPipeGroup) {
    const key = uuid();
    StaticUtils._Global.set(key, this.configInit(key, config, initialValue, appendConfigPipe));
    return function (constructor: any) {
      Object.defineProperty(constructor.prototype, _KeyFlag, {
        value: key,
        writable: false,
        configurable: false,
        enumerable: false
      });
    };
  }

  public connect(instance: CommonFormBaseMixins) {
    if (!this.$$$key || instance.$data[_KeyFlag] !== this.$$$key) {
      this.$ = instance;
      const key = instance.$data[_KeyFlag];
      // if (key) {
      // console.error('connect', instance, key, StaticUtils);
      // }
      this.$$$key = key;
    }
  }

  public getGlobalConfig() {
    return StaticUtils._Global.get(this.$$$key);
  }
  public getGlobalItemConfig() {
    return StaticUtils._Global.get(this.$$$key)[EPropertyType.itemConfig];
  }

  protected static getProperty(utils: IUtils, type: EPropertyType, defaultValue?: any) {
    const r = utils[type];
    return r != null ? r : defaultValue;
  }
  protected getProperty(type: EPropertyType, defaultValue?: any) {
    const preOptions = StaticUtils._Global.get(this.$$$key);
    return StaticUtils.getProperty(preOptions, type, defaultValue)
  }

  /**
   * 遍历itemConfigGroup
   * @param group
   * @param groupIterator 参照Array.forEach
   */
  public static forEachConfigGroup({ operation, ...group }: IItemConfigGroup = {}, groupIterator: (config: IFormItemConfig, index: any, groupKey: string) => any) {
    const entry = Object.entries(group);
    for (let i = 0; i < entry.length; i++) {
      const [groupKey, value] = entry[i];
      const entryValue = Object.entries(value);
      for (let j = 0; j < entryValue.length; j++) {
        const [index, config] = entryValue[j];
        groupIterator(config, index, groupKey);
      }
    }
    return group;
  }


  /**
   * 遍历itemConfigGroup
   * @param group
   * @param groupIterator 参照Array.forEach
   */
  public static *configGroupIterator({ operation, ...group }: IItemConfigGroup = {}, cacheListGroup: WeakMap<IItemConfigGroup, [string, number, string][]>): ConfigGroupIterator {
    if (cacheListGroup.has(group)) {
      for (const [groupKey, index, path] of cacheListGroup.get(group)) {
        const config = group[groupKey] && group[groupKey][index] || undefined
        yield [config.code, config, groupKey, index]
      }
      return cacheListGroup
    }
    const cacheList: [string, number, string][] = []
    const entry = Object.entries(group);
    for (let i = 0; i < entry.length; i++) {
      const [groupKey, value] = entry[i];
      const entryValue = Object.entries(value);
      for (let j = 0; j < entryValue.length; j++) {
        const [indexKey, config] = entryValue[j];
        const index = parseInt(indexKey)
        const path = `${groupKey}[${index}]`
        yield [config.code, config, groupKey, index];
        cacheList.push([groupKey, index, path])
      }
    }
    return cacheListGroup.set(group, cacheList)
  }

  /**
   * 遍历itemConfigGroup
   * @param group
   * @param groupIterator 参照Array.map
   */
  public static mapConfigGroup<T = IFormItemConfig>({ operation, ...group }: IItemConfigGroup = {}, groupIterator: (config: IFormItemConfig, index: any, groupKey: string) => T) {
    const result: IItemConfigGroup<T> = {} as any;
    const entry = Object.entries(group);
    for (let i = 0; i < entry.length; i++) {
      const [groupKey, value] = entry[i];
      const entryValue = Object.entries(value);
      result[groupKey] = []
      if (entryValue.length > 0) {
        for (let j = 0; j < entryValue.length; j++) {
          const [index, config] = entryValue[j];
          result[groupKey][index] = groupIterator(config, index, groupKey);
        }
      }
    }
    return result
  }

  /**
   * 遍历itemConfigGroup
   * @param group
   * @param groupIterator 参照Array.filter
   */
  public static filterConfigGroup({ operation, ...group }: IItemConfigGroup = {}, groupIterator: (config: IFormItemConfig, index: any, groupKey: string) => boolean) {
    const result: IItemConfigGroup = {};
    const entry = Object.entries(group);
    for (let i = 0; i < entry.length; i++) {
      const [groupKey, value] = entry[i];
      const entryValue = Object.entries(value);
      result[groupKey] = []
      if (entryValue.length > 0) {
        let unshiftIndex = 0;
        for (let j = 0; j < entryValue.length; j++) {
          const [index, config] = entryValue[j];
          if (groupIterator(config, index, groupKey)) {
            result[groupKey][parseInt(index) - unshiftIndex] = config;
          } else {
            unshiftIndex++;
          }
        }
      }
    }
    return result;
  }

  /**
   * 注册运行时校验规则构建
   * @param name 规则名（唯一）
   * @param ruleFactory 根据配置/表单变化的规则构建函数
   */
  public static registerRule(name: string, ruleFactory: DynamicRuleLoader): AppendConfigPipeFunction<any, any> {
    return function register(config: IFormItemConfig, utils: IUtils) {
      const loaderKeyStr = StaticUtils.registerOptionsLoader('rules', utils, name, ruleFactory)
      const rules = config.rules || []
      rules.push(loaderKeyStr);
      config.rules = rules
      return config
    };
  }
  /**
   * 注册表单配置获取
   * @param code
   * @param fetch
   * @param append
   */
  public static registerOptions(code: string, fetch: () => Promise<any[]>, append: any = {}): AppendConfigPipeFunction<any, any> {
    return function register(config: IFormItemConfig, utils: IUtils) {
      return merge({
        inputProps: {
          allowClear: true,
          options: StaticUtils.registerOptionsLoader(
            'options',
            utils,
            code,
            (_, utils: Utils) => utils.$autils.getOptions(code, fetch || (() => utils.$autils.waiting(1000, [])), 100000)
          )
        }
      }, append);
    };
  }

  get getFieldValue() {
    return this.$ && this.$.getFieldValue || (() => {});
  }


  public static registerOptionsLoader<T>(type: 'rules' | 'options', utils: IUtils, code: string, fetch?: DynamicLoader<T | T[]>): string;
  public static registerOptionsLoader<T>(type: 'rules' | 'options', utils: Utils, code: string, fetch?: DynamicLoader<T | T[]>): Promise<T | T[]>;
  /**
   * 注册OptionsLoader
   * @param type 
   * @param utils 如果为传入实例化utils则立即进行装载
   * @param code 通用options的configKey
   * @param fetch 
   */
  public static registerOptionsLoader<T>(type: 'rules' | 'options', utils: Utils | IUtils, code: string, fetch: DynamicLoader<T | T[]>) {
    // 实例化中调用此方法
    if (utils instanceof StaticUtils) {
      const loader = utils.$autils.$action(async () => fetch(utils.localFormData, utils))
      if (!utils.staticOptions[code]) {
        utils.$.spinningStart(code)
        utils.setLoaderResult(type, code, [])
        return new Promise<any[]>(resolve => {
          loader.then((list) => {
            if (list !== utils.staticOptions[code]) {
              utils.setLoaderResult(type, code, list)
            }
            utils.$.spinningEnd(code)
            resolve(list)
          })
        })
      } else {
        utils.$.spinningStart(code)
        return loader.then(r => utils.$autils.waiting(0, r)).finally(() => {
          utils.$.spinningEnd(code)
        })
      }
    } else {
      const loaderKeyStr = 'utils:loader:' + type + ':' + code
      // 静态解析中调用此方法
      // 序列
      StaticUtils.addLoader(utils, [
        loaderKeyStr,
        (instanceThis: Utils) => StaticUtils.registerOptionsLoader(type, instanceThis, loaderKeyStr, fetch),
        `加载${code}配置用数据...`
      ] as Loader)
      return loaderKeyStr
    }
  }

  public static addLoader(utils: IUtils, loader: Loader) {
    StaticUtils.getProperty(utils, EPropertyType.loaders).push(loader)
  }
  public addLoader(loader: Loader) {
    this.getProperty(EPropertyType.loaders).push(loader)
  }

  /**
   * @description
   * 因为实现了Iterable接口所以可以使用for...of进行遍历
   * 遍历器返回结构为：[配置项的code,配置项,配置项在配置组Key,组内的index]
   */
  get itemConfig(): IterableConfigGroup {
    return this.getProperty(EPropertyType.itemConfig)
  }

  get initialValues(): any {
    return this.getProperty(EPropertyType.initialValue)
  }

  /**
   * 加载运行时配置流
   */
  public fireLoader() {
    // debugger
    this.getProperty(EPropertyType.loaders).forEach(
      // async ([name, loader]: Loader) => {
      //   // const code = await loader(this)
      //   // console.log(name, code)
      // }
      ([name, loader]: Loader) => loader(this)
    )
  }

  public static *getValuePathIterator(values: any, allowPath: string[] | { [path: string]: boolean }) {
    if (values == null) return null;
    // 使用数组记录结构，第一项为当前节点的key，第二项是该key的值，其后是当前节点的血源key
    const p: [string, any, string][] = Object.entries(values) as any;
    if (allowPath instanceof Array) {
      allowPath = convertArr2Map(allowPath)
    }
    while (p.length > 0) {
      const nextList = []
      let index = 0
      for (const [key, valueOrP, parentKey] of p) {
        const currentPath = parentKey && parentKey + '.' + key || key;
        if (valueOrP instanceof Object && !allowPath[currentPath]) {
          const next = Object.entries(valueOrP).map(i => [...i, currentPath]) as [string, any, string[]][];
          nextList.push(...next)
        } else {
          yield [currentPath, valueOrP] as [string, any]
        }
        index++
      }
      for (let i = 0; i < index; i++) {
        p.shift()
      }
      if (nextList.length > 0) {
        p.push(...nextList)
      }
    }
  }
  public static * getErrorIterator(errors: any) {
    if (errors == null) return null;
    const p = Object.entries(errors) as [string, any, ...string[]][];
    while (p.length > 0) {
      const nextList = []
      let index = 0
      for (const [key, obj, ...keys] of p) {
        if (!obj.errors) {
          const next = Object.entries(obj).map(i => [...i, ...keys, key]) as [string, any, ...string[]][];
          nextList.push(...next)
        } else {
          yield [[...keys, key].join('.'), obj.errors] as [string, Error[]]
        }
        index++
      }
      for (let i = 0; i < index; i++) {
        p.shift()
      }
      if (nextList.length > 0) {
        p.push(...nextList)
      }
    }
  }
  public static getErrorListFromErrors(errors: {
    values: any;
    errors: {
      [key: string]: {
        errors: Error[], [key: string]: any;
      }
    }
  }) {
    const p = Object.entries(errors) as [string, any, ...string[]][];
    const errorList = []
    while (p.length > 0) {
      const nextList = []
      let index = 0
      for (const [key, obj, ...keys] of p) {
        if (!obj.errors) {
          const next = Object.entries(obj).map(i => [...i, ...keys, key]) as [string, any, ...string[]][];
          nextList.push(...next)
        } else {
          errorList.push([[...keys, key].join('.'), obj.errors])
        }
        index++
      }
      for (let i = 0; i < index; i++) {
        p.shift()
      }
      if (nextList.length > 0) {
        p.push(...nextList)
      }
    }
    return errorList
  }

  public static createForm(itemConfig: IItemConfigGroup<IFormItemConfig>, initialValues?: any, appendConfigPipe?: IAppendGroupPipeGroup) {
    return createForm(itemConfig, initialValues, appendConfigPipe)
  }
}
