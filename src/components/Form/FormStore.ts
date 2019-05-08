import { get, set, difference, keys, forEach, toArray, isNil, values } from 'lodash';
import {
  action, computed, extendObservable, observable, ObservableMap,
  IObservableArray, IKeyValueMap, observe, runInAction, IMapDidChange, reaction, Lambda, IObjectDidChange
} from 'mobx';
import { Utils, isNotEmptyArray } from '../../utils';
import { IFormItemConstructor, CommonStore } from './Interface/FormItem';
import { Memoize } from 'lodash-decorators'
import { autobind } from 'core-decorators';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import reduce from 'immer';
import { ItemConfig, IFormValueTransform } from '../../stores';
import { FormItemStore } from './FormItem';
import { EventEmitter } from '../../utils/EventEmitter';
import { EventStoreInject } from '../../utils/EventStore';
import getTransform from '../../stores/ItemConfig/input/FormValueTransform';

export interface ICommonFormConfig extends IKeyValueMap {
  $formStore?: FormStore;
  [k: string]: WrappedFormUtils | FormStore | ItemConfig;
}
export type keys = keyof ICommonFormConfig;

export class GFormStore extends CommonStore {
  static formMap: WeakMap<any, FormStore> = new WeakMap<any, FormStore>();
  static disposedForm(form: any) {
    this.formMap.delete(form)
  }
  static registerForm<T = any>(form: any, instance: T, replace?: FormStore) {
    let formStore: FormStore | undefined = this.formMap.get(form);
    if (!formStore) {
      formStore = replace || new FormStore();
      formStore.setForm(form, instance);
      // console.log('register form', form)
      this.formMap.set(form, formStore);
    }
    return formStore;
  }
}

export type onItemChangeCallback = (code: string, value: any) => void

@EventStoreInject(['onItemChange'])
export class FormStore<T extends IKeyValueMap = any> extends GFormStore {
  [x: string]: any;
  constructor() {
    super()
    observe(this.errorGroup, (listener: IMapDidChange) => {
      this.errorTack.push(listener)
      console.log('this.errorGroup', this.errorTack)
    })
    observe(this.formMap, listener => {
      // const config = this.formItemConfigMap[listener.name]
      // console.log('this.formMap', listener, this.formSource, this.formItemConfigMap)
      // for (const key in this.formItemConfigMap) {
      //   const config = this.formItemConfigMap[key]
      //   console.log('update config', config, key, (listener.name))
      //   if (config instanceof ItemConfig) {
      //     config.form[listener.name] = (listener as any).newValue
      //     // break;
      //   }
      // }
      
    })
    reaction(() => this.formMap, () => {
      console.log('this.formMap')
    })
  }
  @observable formSource: T = {} as T
  @observable formSourceTrack: T[] = []
  @computed.struct get lastFormSource(){
    return this.formSourceTrack[this.formSourceTrack.length-1] || this.formSource
  }
  @observable.shallow formMap: ObservableMap<keyof T, any> = observable.map({}, { deep: false });
  @computed.struct get form(): T {
    return extendObservable({}, this.formMap.toPOJO()) as T;
  }
  @observable.ref errorTack: IMapDidChange[] = []
  @observable.ref instance: any = {}

  formSourceListerner: Lambda;

  @observable.shallow errorGroup: ObservableMap<keyof T, Error[]> = observable.map({}, { deep: false });
  @computed.struct get errors() { return this.errorGroup.toPOJO() }
  @autobind getErrors(itemKey: keyof T) { return this.errorGroup.get(itemKey) }
  @autobind hasErrors(itemKey: keyof T) { return this.errorGroup.has(itemKey) }
  @autobind updateError(itemKey: keyof T, errors?: Array<Error>) {
    const nextError = isNotEmptyArray(errors) ? errors : null
    if (!Utils.isEqual(this.errorGroup.get(itemKey), nextError, true)) {
      runInAction(() => nextError ? this.errorGroup.set(itemKey, nextError) : this.errorGroup.delete(itemKey))
    }
  }
  @action.bound clearValidate() {
    this.errorGroup.clear()
  }

  @observable.shallow private config: IObservableArray<IFormItemConstructor> = observable.array([]);
  @computed public get configList() {
    return this.config.toJSON()
  }
  @computed public get itemCodeList() {
    return this.config.map(i => i.code)
  }
  @computed public get itemCodeNameMap(): IKeyValueMap<string> {
    return this.config.reduce((obj, config) => {
      return config.nameCode ? Object.assign(obj, {
        [config.code]: config.nameCode
      }) : obj
    }, {})
  }
  @computed public get itemCodeNameList() {
    return values(this.itemCodeNameMap)
  }

  @autobind onItemChange(callback: onItemChangeCallback) {
    this.$on('onItemChange', callback, this)
  }
  @autobind onItemChangeEmit(code: string, value: any) {
    this.$emit('onItemChange', code, value)
  }

  // @Memoize
  @action.bound patchFieldsChange(patch: T, path: string[] = [], callback?: any): IKeyValueMap<boolean> {
    const result: IKeyValueMap<boolean> = {}
    // debugger
    for (const [key, data] of Object.entries(patch)) {
      const nextpath = path.concat([key])
      const pathStr = nextpath.join('.')
      if (data.name === pathStr) {
        // this.formMap.set(pathStr, data.value)
        // this.formSource[key] = data.value
        // validating 为ture表示正在校验，为false表示结束校验，空则代表不影响值变更
        if (data.validating !== true) {
          console.log('hasError', data.name, data, isNotEmptyArray(data.errors))
          if (data.validating === false) {
            // this.errorGroup.set(key, isNotEmptyArray(data.errors) ? data.errors : null)
            this.updateError(data.name, data.errors)
          }
          registerKey(this.formSource, pathStr)
          if (Utils.isFunction(callback)) {
            Object.assign(result, callback(pathStr, data.value))
          } else {
            const isChanged = this.setFormValue(data.value, key)
            Object.assign(result, {[key]: isChanged}) 
          }
        }
      } else {
        const next = this.patchFieldsChange(data, nextpath, callback || ((pathStr: string, value: any): IKeyValueMap<boolean> => {
          const innerPath = pathStr.replace(key + '.', '')
          const isChanged = this.setFormValue(value, key, innerPath)
          return { [pathStr]: isChanged } // 值不变
        }))
        Object.assign(result, next)
      }
    }
    return result
  }

  @computed get formValueTransform() {
    return Utils.reduce(this.config, (nextMap, i) => {
      const key = i.code
      const store = this.formItemStores[key]
      return nextMap.set(key, (store && store.itemConfig.formValueTransform) || getTransform(i.type))
    }, new Map<string, IFormValueTransform>())
  }
  @autobind getV2FValue(key: string, value: any) {
    const transforms = this.formValueTransform.get(key)
    if(transforms) {
      return transforms.V2F(value)
    }
    return value
  }
  @autobind getF2VValue(key: string, value: any) {
    const transforms = this.formValueTransform.get(key)
    if(transforms) {
      return transforms.F2V(value)
    }
    return value
  }
  @action.bound setFormValue(value: any, key: string, innerPath?: string): boolean {
    let isChanged: boolean;
    let nextValue: any;
    let pathStr = key;
    if(Utils.isNotEmptyString(innerPath)) {
      pathStr += '.' + innerPath
      const preObj = this.formMap.get(key) || {}
      const obj = reduce(preObj, (i: any) => {
        if (!Utils.isEqual(get(i, innerPath), value, true)) {
          const toValue = this.getV2FValue(pathStr, value)
          set(i, innerPath, toValue)
        }
      })
      nextValue = obj;
      isChanged = obj !== preObj
    } else {
      nextValue = this.getV2FValue(key, value);
      isChanged = !Utils.isEqual(this.formSource[key], nextValue, true)
    }
    if (isChanged) {
      this.formSource[key] = nextValue
      this.formMap.set(key, nextValue)
      this.onItemChangeEmit(pathStr, nextValue)
      console.log('set', 'formMap', pathStr, value, nextValue, this.formSource, this.formItemStores)
      this.setFormValueWithName(pathStr)
    }
    return isChanged
  }
  public searchNameWatcher: any = {}
  @action.bound setFormValueWithName(code: string) {
    const nameCode = this.itemCodeNameMap[code]
    const { itemConfig: { optionsStore }} = this.formItemStores[code]
    if(Utils.isNotEmptyString(nameCode) && nameCode !== code) {
      // this.reaction(() => optionsStore.selectedLablesStr, searchName => {
      //   console.log('get nameCode',  'formMap', optionsStore, optionsStore.selectedLables)
      //   set(this.formSource, nameCode, optionsStore.selectedLablesStr)
      // }, { fireImmediately: true })
      // this.searchNameWatcher[nameCode] = true
      
      console.log('get nameCode',  'formMap', optionsStore, optionsStore.selectedLables)
      set(this.formSource, nameCode, optionsStore.selectedLablesStr)
    }
  }

  @autobind async validate() {
    const r = await this.antdForm && this.antdForm.validateFields(this.itemCodeList, { force: true })
    console.log(r);
  }

  @computed get allFormMap() {
    return FormStore.formMap
  }

  // @observable formItemMap: ObservableMap<any, ICommonFormConfig> = observable.map({})
  // @computed.struct get formItemConfigMap() {
  //   return this.formItemMap.get(this.formSource) || {}
  // }

  @observable.ref reactionAntdFormEmitter = new EventEmitter<WrappedFormUtils>()
  @action.bound reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void) {
    const sub = this.reactionAntdFormEmitter.subscribe((antdForm) => {
      // console.log('reactionAntdForm', sub)
      callback(antdForm)
      sub.unsubscribe()
    })
  }
  @action.bound receiveAntdForm(antdForm: WrappedFormUtils) {
    this.reactionAntdFormEmitter.emit(antdForm)
  }
  @observable.ref antdForm: WrappedFormUtils;
  @observable.shallow antdFormMap: ObservableMap<string, WrappedFormUtils> = observable.map({})
  @action.bound setAntdForm(antdForm: WrappedFormUtils, code?: string) {
    if(antdForm!==this.antdForm) {
      this.antdForm = antdForm
    }
    if(code) {
      this.antdFormMap.set(code, antdForm)
    }
  }
  @observable formItemStores: IKeyValueMap<FormItemStore> = {}

  @action.bound registerItemStore(code: string): FormItemStore {
    // console.log('registerForm', form)
    this.formItemStores[code] = this.formItemStores[code] || new FormItemStore(this, code)
    // this.registerForm(this.formSource, code, this.formItemStores[code].itemConfig)
    return this.formItemStores[code]
  }

  // @action.bound registerForm(form: any, code: string, itemConfig: ItemConfig) {
  //   // console.log('registerForm', form)
  //   const keyMap: ICommonFormConfig = this.formItemMap.get(form) || {}
  //   if(keyMap[code] !== itemConfig){
  //     keyMap.$formStore = this
  //     keyMap[code] = itemConfig
  //     this.formItemMap.set(form, keyMap)
  //   }
  // }

  @Memoize
  @autobind getConfig(code: string) {
    return this.configList.find(item => item.code === code)
  }

  @action.bound setForm(form: T, instance: any) {
    console.log('setForm', form, this.configList.length)
    mapToDiff(this.formMap, form)
    this.registerKey(form)
    this.formSource = form;
    this.instance = instance
    this.clearValidate()
    this.registerFormSourceListerner();
  }
  @action.bound setConfig(configList: IFormItemConstructor[]) {
    console.log('setConfig', configList)
    this.config = observable.array(configList, { deep: false })
    this.registerKey(this.formSource)
    this.registerFormSourceListerner();
  }
  private registerFormSourceListerner() {
    if (this.formSourceListerner) {
      this.formSourceListerner();
      this.formSourceListerner = null
    }
    this.formSourceListerner = observe(this.formSource, (listener: IObjectDidChange) => {
      // console.log('this.formSource', listener)
      this.formSourceTrack.push(this.formSource);
    });
  }

  @action.bound replaceForm(formMap: ObservableMap<string, any>) {
    this.formMap = formMap;
  }
  @action.bound registerKey(target: any, deep: boolean = false)  {
    for (const code of this.itemCodeList) {
      console.log('registerKey', code)
      registerKey(target, code, deep)
    }
    for (const code of this.itemCodeNameList) {
      console.log('registerKey', code)
      registerKey(target, code, deep)
    }
    return 
  }
}

export function mapToDiff(map: ObservableMap<any>, form: any) {
  const push = difference(keys(form), toArray(map.keys() as any));
  forEach(toArray(map), ([key, value]) => {
    if (isNil(form[key]))
      map.delete(key);
    else if (!Utils.isEqual(form[key], value)) {
      map.set(key, form[key]);
    }
  });
  forEach(push, key => {
    map.set(key, form[key]);
  });
  return map;
}

export function registerKey(target: any, key: string, deep: boolean = false) {

  const keyDeep = key.split('.');
  // const coreKey = `$$core_${keyDeep[0]}`;
  const defaultV = get(target, keyDeep[0], null)
  const d = (deep?observable:observable.ref)
  d(target, keyDeep[0], { value: defaultV, enumerable: false, configurable: true })
  // computed.struct(target, keyDeep[0], {
  //   get() { return get(this, coreKey) },
  //   set(value) { set(this, coreKey, value) }
  // })
  // console.log('registerKey', target, key);
}