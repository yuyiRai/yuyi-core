import { autobind } from 'core-decorators';
import { action, computed, extendObservable, IKeyValueMap, IMapDidChange, observable, ObservableMap, runInAction } from 'mobx';
import { EventStoreInject } from 'src/stores/EventStore';
import { isNotEmptyArray } from 'src/utils';
import { FormModel } from '../Interface/FormItem';
import { IFormItemStoreConstructor, IFormItemStoreCore } from "./FormItemStoreBase";
import { GFormStore } from './GFormStore';
import { ConfigInit, ItemConfigGroupStore } from './ItemConfigGroupStore';

export type onItemChangeCallback = (code: string, value: any) => void

@EventStoreInject(['onItemChange'])
export class FormStoreCore<FM extends FormModel, VM extends IFormItemStoreConstructor<FM> = any> extends GFormStore {
  @observable
  configStore: ItemConfigGroupStore<FM> = new ItemConfigGroupStore<FM>(this);
  constructor(config?: ConfigInit<FM>) {
    super();
    this.configStore.setConfigSource(config || []);
  }
  
  @observable.shallow formMap: ObservableMap<keyof FM, any> = observable.map({}, { deep: false });
  @observable formSource: FM = {} as FM
  @observable formSourceTrack: FM[] = []
  @computed.struct get lastFormSource() {
    return this.formSourceTrack[this.formSourceTrack.length - 1] || this.formSource
  }
  @computed.struct get form(): FM {
    return extendObservable({}, this.formMap.toPOJO()) as FM;
  }

  
  @observable formItemStores: IKeyValueMap<IFormItemStoreCore<FM, any>> = {}
  @action.bound registerItemStore<V>(code: string, Constructor: VM): IFormItemStoreCore<FM, V> {
    // console.log('registerForm', form)
    // debugger
    this.formItemStores[code] = this.formItemStores[code] || new Constructor(this, code)
    // this.registerForm(this.formSource, code, this.formItemStores[code].itemConfig)
    return this.formItemStores[code]
  }

  
  @autobind onItemChange(callback: onItemChangeCallback) {
    this.$on('onItemChange', callback, this)
  }
  @autobind onItemChangeEmit(code: string, value: any) {
    this.$emit('onItemChange', code, value)
  }

  
  @observable.ref errorTack: IMapDidChange[] = []
  @observable.shallow errorGroup: ObservableMap<string, Error[] | undefined> = observable.map({}, { deep: false });
  @computed.struct get errors() { return this.errorGroup.toPOJO() }
  @autobind getErrors(itemKey: string) { return this.errorGroup.get(itemKey) }
  @autobind hasErrors(itemKey: string) { return this.errorGroup.has(itemKey) }
  @autobind updateError(itemKey: string, errors?: Error[] | undefined) {
    const nextError = isNotEmptyArray(errors) ? errors : null
    if (!Utils.isEqual(this.errorGroup.get(itemKey), nextError, true)) {
      runInAction(() => nextError ? this.errorGroup.set(itemKey, nextError) : this.errorGroup.delete(itemKey))
    }
  }
}
