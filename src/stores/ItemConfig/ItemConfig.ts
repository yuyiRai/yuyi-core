/* eslint-disable */
import { action, computed, IKeyValueMap, IValueDidChange, observable, toJS, IValueWillChange } from 'mobx';
import { FormStore } from '../../components/Form/FormStore';
import { EventStoreInject } from '../../utils/EventStore';
import { IItemConfig, BaseItemConfigTransformer } from './interface/ItemConfig';
import { ItemConfigBase } from './ItemConfigBase';
import { SearchStore } from './SearchStore';
import { ITransformer, createTransformer } from 'mobx-utils';
import { get } from 'lodash';
import { OptionsStore } from '../SelectAndSearchStore';
import getTransform, { IFormValueTransform, FilterType } from './input/FormValueTransform';

export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
  name: string;
}

@EventStoreInject(['options-change'])
export class ItemConfig extends ItemConfigBase implements IItemConfig {
  @observable private static commonTransformerConfig: BaseItemConfigTransformer<FilterType>;
  @action.bound public static setCommonTransformerPipe(func: BaseItemConfigTransformer<FilterType>) {
    this.commonTransformerConfig = func;
  }
  @computed public static get commonTransformer(): BaseItemConfigTransformer<FilterType> {
    return createTransformer<IItemConfig, FilterType>(
      this.commonTransformerConfig || function ({ type, multiple }: IItemConfig) {
        if (['select', 'search'].includes(type) && multiple) {
          return 'group'
        }
        return ({
          'check': 'group',
          'checkOne': {
            F2V: (v: any) => v === '1',
            V2F: (v: any) => {
              return v===true ? '1' : '0'
            }
          }
        })[type];
      }
    )
  }

  [key: string]: any;
  @observable.ref form: IKeyValueMap = {};

  @observable $version = 0
  // @observable loading = false;


  @observable searchStore: SearchStore;
  @action.bound setSearchStore(searchStore: SearchStore) {
    this.searchStore = searchStore
  }
  @action.bound useSearchStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config: ItemConfig = this) {
    const store = this.searchStore || new SearchStore(config)
    this.setSearchStore(store)
    this.useOptionsStore(transformer, config)
    return store;
  }

  @computed get formValueTransform(): IFormValueTransform {
    return getTransform(this.transformer)
  }
  @computed get transformer() {
    return this.i.transformer || ItemConfig.commonTransformer(this)
  }
  @computed get form2Value() {
    const { filter } = this.i
    return Utils.isFunctionFilter(filter, this.formValueTransform.F2V)
  }
  @computed get value2Form() {
    const { filterToValue } = this.i
    return Utils.isFunctionFilter(filterToValue, this.formValueTransform.V2F)
  }

  @computed get currentComponentValue() {
    return this.form2Value(this.currentValue)
  }
  
  @observable optionsStore: OptionsStore;
  @action.bound useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config: IItemConfig = this) {
    const store = this.optionsStore || new OptionsStore(config, transformer)
    this.optionsStore = store
    return store;
  }
  
  @computed private get keyCode() {
    return this.code.split('.')[0]
  }
  @computed private get keyInnerCode() {
    return this.keyCode!==this.code ? this.code.replace(this.keyCode+'.','') : undefined
  }

  @observable.ref formStore: FormStore;
  @action.bound setFormStore(formStore: FormStore) {
    this.formStore = formStore
    this.interceptProperty(this.formStore.formSource, this.keyCode, (event: IValueWillChange<any>) => {
      console.log(event, event.newValue, get(event.object, this.keyInnerCode), this.keyCode, this.keyInnerCode)
      return event
    })
  }
  @computed.struct get formSource() {
    // console.log('this.formStore', this.formStore && this.formStore.formSource);
    return (this.formStore && this.formStore.lastFormSource) || this.form
  }

  constructor(initModel: any, form: any = {}, componentProps: any = {}) {
    super(initModel, form, componentProps)
  }

  export() {
    const model:any = {}
    for (const key of this.iKeys) {
      model[key] = this[key]
    }
    model.__isExportObject = true
    return toJS(model);
  }

}

