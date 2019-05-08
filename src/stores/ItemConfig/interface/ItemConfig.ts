import { ISearchConfig, ISearchConfigConstructor } from "../SearchStore";
import { IDisplayConfig, IDisplayConfigConstructor } from "../ItemDisplayConfig";
import { OptionBase } from "../../../utils";
import { IEventStoreBase } from "../../../utils/EventStore";
import { IReactionPublic, IReactionOptions, intercept, IObservableValue, IComputedValue, IValueDidChange, IReactionDisposer, Lambda, reaction, observe, IInterceptor, IValueWillChange } from "mobx";
import { FilterType, IFormValueTransform } from "../input";
import { ITransformer } from "mobx-utils";

export type FormItemType = "" | "text" | "textArea" | "textarea"
  | 'number'
  | 'date' | 'dateTime' | 'dateToDate'
  | 'select' | 'search'
  | 'check' | 'radio'
  | 'checkOne' | 'switch' | 'address' | undefined | null | never

export type ComputedProperty<T, M = any> = T | ComputedPropertyConstructor<T, M>
export type ComputedPropertyConstructor<T, M = any> = (form: M, itemConfig?: IItemConfig) => T

export type ItemConfigEventHandler<T, R = void> = (e: T, formSource?: any, config?: IFormItemConfig) => R;
export type ValueAny = any;

export interface IFormItemBase {
  type?: FormItemType;
  code: string | '_';
  nameCode?: string;
  label?: string;
  onChange?: ItemConfigEventHandler<ValueAny>;
}

/**
 * typeof i
 */
export interface IFormItemConstructor<M = any> extends IFormItemBase, ISearchConfigConstructor, IDisplayConfigConstructor {
  disabled?: ComputedProperty<boolean, M>
  hidden?: ComputedProperty<boolean, M>
  value?: ComputedProperty<any, M>;
  defaultValue?: ComputedProperty<any, M>;
  required?: ComputedProperty<boolean, M> 
  [key: string]: ComputedProperty<any, M>
}

export interface IBaseConfig extends IFormItemBase {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  hidden?: boolean;
  refConfig?: (...args: any[]) => void
  filter?: FilterType;
  filterToValue?: FilterType;
  transformer?: IFormValueTransform | FilterType;
}

export interface IFormItemConfig extends IBaseConfig, IDisplayConfig, ISearchConfig {
  rule?: any[] | string;
  requiredMessage?: string;
  options?: OptionBase[];
  loading?: boolean;
}

export abstract class CommonStore {
  destorySet: Set<IReactionDisposer | Lambda> = new Set<IReactionDisposer | Lambda>();
  reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void {
    this.destorySet.add(reaction(source, callback, options))
  };
  onceReaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void {
    const a = reaction(source, (arg: {}, r: IReactionPublic) => {
      callback(arg, r)
      a()
    }, options)
  }
  observe<T = any>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): void {
    this.destorySet.add(observe(value, listener, fireImmediately))
  }
  intercept(object: any, handler: IInterceptor<IValueWillChange<any>>): void {
    this.destorySet.add(intercept(object, handler))
  }
  interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): void {
    this.destorySet.add(intercept(object, property, handler))
  }
  destory() {
    for (const destory of this.destorySet) {
      destory()
    }
    this.destorySet.clear();
  }
}

export interface IItemConfig extends IFormItemConfig, IEventStoreBase, CommonStore {
  i?: IFormItemConstructor;
  form: any;
  formSource?: any;
  setOptions(options: any): void;
  setLoading(loading: boolean): void;
  [key: string]: any;
}

export type BaseItemConfigTransformer<T = any> = ITransformer<IItemConfig, T>