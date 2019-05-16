import { autobind } from 'core-decorators';
import { keys as getKeys, reduce, values } from 'lodash';
import { action, computed, IKeyValueMap, observable, ObservableMap, toJS } from 'mobx';
import { ItemConfig } from 'src/stores';
import { CommonStore, IFormItemConstructor, FormModel } from '../Interface/FormItem';
import { FormStoreCore } from './FormStoreCore';

export type ConfigInit<V, FM = FormModel> = IFormItemConstructor<V, FM>[] | IKeyValueMap<IFormItemConstructor<V, FM>>

export class ItemConfigGroupStore<FM = FormModel, VKeys = any> extends CommonStore {
  @observable
  public store: FormStoreCore<FM>;
  @observable.shallow
  public configSource: ObservableMap<string, IFormItemConstructor<VKeys, FM>> = observable.map({}, { deep: false })
  @observable
  public itemConfigMap: ObservableMap<string, ItemConfig<VKeys, FM>> = observable.map({}, { deep: false })

  @computed
  public get config() {
    return toJS(Array.from(this.configSource.values()));
  }

  @computed
  public get configList() {
    return values(this.configSource.toJSON());
  }

  @computed
  public get itemConfigConstructorMap(): IKeyValueMap<IFormItemConstructor<VKeys, FM>> {
    return this.config.reduce((obj, config) => {
      return config.code ? Object.assign(obj, {
        [config.code]: config
      }) : obj;
    }, {});
  }

  @computed
  public get itemCodeList() {
    return getKeys(this.itemConfigConstructorMap);
  }

  @computed
  public get itemCodeNameMap(): IKeyValueMap<string> {
    return this.config.reduce((obj, config) => {
      return config.nameCode ? Object.assign(obj, {
        [config.code]: config.nameCode
      }) : obj;
    }, {});
  }

  @computed
  public get itemCodeNameList() {
    return values(this.itemCodeNameMap);
  }

  @autobind
  public getConfig(code: string) {
    return this.configSource.get(code)
  }
  @autobind
  public getItemConfig(code: string) {
    return this.itemConfigMap.get(code)
  }

  @action.bound
  public setConfigSource<V>(configSource: ConfigInit<V, FM>) {
    console.log('setConfig', configSource, this, this.store)
    this.mapToDiff(this.configSource, reduce(configSource, (object, config: IFormItemConstructor<V, FM>, key: string | number) => {
      return (Utils.isNumber(key) || Utils.isEqual(key, config.code)) ? Object.assign(object, { [config.code]: config }) : object
    }, {}))
  }

  constructor(formStore: FormStoreCore<FM>) {
    super()
    this.store = formStore
    this.observe(this.configSource, listener => {
      console.log('on-base-config-change', listener, this)
      if (listener.type === 'add') {
        this.itemConfigMap.set(listener.name, new ItemConfig<VKeys, FM>(listener.newValue, this.store.formSource, this, this.store as any).log('on-base-config-change'))
      } else if (listener.type === 'delete') {
        this.getItemConfig(listener.name).destory()
        this.itemConfigMap.delete(listener.name)
      } else {
        this.getItemConfig(listener.name).setConfig(listener.newValue as any)
      }
    })
  }
}
