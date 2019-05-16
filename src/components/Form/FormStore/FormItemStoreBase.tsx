import { ItemConfig } from '@/stores';
import { computed, observable } from 'mobx';
import { CommonStore } from '../Interface/FormItem';
import { FormStoreCore } from './FormStoreCore';

export interface IFormItemStoreCore<FM = any, V = any> {
  code: string;
  formStore: VMFormStore<FM, V>;
  itemConfig: ItemConfig<V, FM>
}
export interface IFormItemStore<FM = any, V = any> {
  new (formStore: VMFormStore<FM, V>, code: string): IFormItemStoreCore<FM, V>
}

export type VMFormStore<FM, V> = FormStoreCore<FM, IFormItemStore<FM, V>>;

export class FormItemStoreCore<FM, V> extends CommonStore implements IFormItemStoreCore<FM, V> {
  @observable.ref
  public code: string;
  @observable.ref
  public formStore: VMFormStore<FM, V>;

  constructor(formStore: VMFormStore<FM, V>, code: string) {
    super();
    this.formStore = formStore;
    this.code = code;
  }

  @computed.struct
  public get itemConfig(): ItemConfig<V, FM> {
    return this.formStore.configStore.getItemConfig(this.code);
  }
  @computed
  public get hasError(): boolean {
    return this.formStore.hasErrors(this.itemConfig.code);
  }
}