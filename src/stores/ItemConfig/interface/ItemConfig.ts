import { IEventStoreBase } from "@/stores/EventStore";
import { IKeyValueMap } from "mobx";
import { ITransformer } from "mobx-utils";
import { FormStore } from "../../../components/Form/FormStore";
import { OptionBase } from "../../../utils";
import { FilterType, IFormValueTransform } from "../input";
import { IDisplayConfig, IDisplayConfigConstructor } from "../ItemDisplayConfig";
import { ISearchConfig, ISearchConfigConstructor } from "../SearchStore";
import { CommonStore } from "./CommonStore";
import { RuleConfig, RuleConfigList } from "./RuleConfig";

export type FormItemType = "" | "text" | "textArea" | "textarea"
  | 'number'
  | 'date' | 'dateTime' | 'dateToDate'
  | 'select' | 'search' | 'selectTree'
  | 'check' | 'radio' | 'radioOne'
  | 'checkOne' | 'switch' | 'address' | 'cascader' | undefined | null | never | 'group'

export type FormModel<M extends object = IKeyValueMap> = M
export type ComputedProperty<T, FM = FormModel> = T | ComputedPropertyConstructor<T, FM>
export type ComputedPropertyConstructor<T, FM = FormModel> = (form: FM, itemConfig?: IItemConfig<FM>) => T

export type ItemConfigEventHandler<V, FM, R = void> = (e: V, formSource?: FM, config?: IFormItemConfig<V, FormModel>) => R;
export type ValueAny = any;

export interface IFormItemBase<V, FM> {
  type?: FormItemType;
  code: string | '_';
  nameCode?: string;
  label?: string;
  onChange?: ItemConfigEventHandler<V, FM>;
  autorunMethod?: (value: V, formStore?: FormStore<FM>, itemConfig?: IItemConfig<V, FM>) => void;
  filter?: FilterType<FM, V>;
  filterToValue?: FilterType<FM, V>;
  transformer?: IFormValueTransform<FM, V> | FilterType<FM, V>;
}

/**
 * typeof i
 */
export interface IFormItemConstructor<V = any, FM = any> extends IFormItemBase<V, FM>, ISearchConfigConstructor<V, FM>, IDisplayConfigConstructor<FM> {
  disabled?: ComputedProperty<boolean, FM>
  hidden?: ComputedProperty<boolean, FM>
  value?: ComputedProperty<V, FM>;
  defaultValue?: ComputedProperty<V, FM>;
  required?: ComputedProperty<boolean | RuleConfig<V>, FM> 
  viewOnly?: ComputedProperty<boolean, FM> 
  computed?: ComputedProperty<string | boolean, FM> 
  children?: IKeyValueMap<IFormItemConstructor<V, FM>>
  [key: string]: ComputedProperty<any, FM>
}

export interface IBaseConfig<V, FM> extends IFormItemBase<V, FM> {
  formSource?: FM;
  value?: V;
  defaultValue?: V;
  disabled?: boolean;
  hidden?: boolean;
  required?: boolean;
  refConfig?: (store: FormStore) => void
}

export interface IFormItemConfig<V, FM> extends IBaseConfig<V, FM>, ISearchConfig<V, FM>, IDisplayConfig {
  rule?: RuleConfig<V> | RuleConfigList<V>;
  rules?: RuleConfig<V> | RuleConfigList<V>;
  requiredMessage?: string;
  options?: OptionBase[];
  loading?: boolean;
  /**
   * 计算值
   */
  computed?: V | boolean;
}

export interface IItemConfigBase<V, FM> extends IFormItemConfig<V, FM>, IEventStoreBase, CommonStore {
  formStore: FormStore<FM>;
  i: IFormItemConstructor<V, FM>;
  form: FM;
  setOptions(options: ComputedProperty<OptionBase[], FM>): void;
  setLoading(loading: ComputedProperty<boolean, FM>, source?: string): void;
}
export interface IItemConfig<V = any, FM = FormModel> extends IItemConfigBase<V, FM> {
  [key: string]: any;
}

export type BaseItemConfigTransformer<V, FM = FormModel> = ITransformer<IItemConfig<V, FM>, FilterType<FM, V>>