import { IEventStoreBase } from "@/stores/EventStore";
import { IKeyValueMap } from "mobx";
import { ITransformer } from "mobx-utils";
import { FormStore } from "../../../components/Form/FormStore";
import { OptionBase } from "../../../utils";
import { FilterType, IFormValueTransform, IFormValueTransformHandler, FilterTypeKey } from "../input";
import { IDisplayConfig, IDisplayConfigCreater } from "../ItemDisplayConfig";
import { IRuleStore, IRuleStoreCreater } from "../RuleConfigStore";
import { ISearchConfig, ISearchConfigCreater } from "../SearchStore";
import { CommonStore } from "./CommonStore";
import { IRuleConfig } from "./RuleConfig";
export interface INameKeyComponent<K extends FormItemType> {
    $nameKey: K;
}
export declare class A implements INameKeyComponent<"text"> {
    $nameKey: "text";
}
export declare type FormItemType = "" | "text" | "textArea" | "textarea" | 'number' | 'date' | 'dateTime' | 'dateToDate' | 'select' | 'search' | 'selectTree' | 'check' | 'radio' | 'radioOne' | 'checkOne' | 'switch' | 'address' | 'cascader' | undefined | null | never | 'group';
export declare type FormModel<M extends object = IKeyValueMap> = M;
export declare type ValueType<T = object> = T;
/**
 * 属性
 */
export declare type ComputedProperty<FM = FormModel, T = any> = ComputedPropertyCreater<T, FM> | ValueType<T>;
/**
 * 计算属性
 */
export declare type ComputedPropertyCreater<T, FM = FormModel> = (form: FM, itemConfig?: IItemConfig<FM>) => T;
export declare type ItemConfigEventHandler<VALUE, FM, R = void> = (e: VALUE, formSource?: FM, config?: IItemConfig<FM, VALUE>) => R;
export declare type ValueAny = any;
export declare type ConstructorPick<P> = {
    [K in keyof P]?: P[K] extends ComputedPropertyCreater<infer T, infer FM> ? (ComputedProperty<FM, T>) : P[K];
};
export declare type ComputedPick<P, FM> = {
    [K in keyof P]?: P[K] extends ComputedPropertyCreater<infer T, FM> ? T : P[K];
};
/**
 * 表单成员基本配置，固定类型
 */
export declare type IItemConfigStatic<FM, VALUE, CVALUE> = {
    type?: FormItemType;
    code: string | '_';
    nameCode?: string;
    label?: string;
    computed?: ComputedPropertyCreater<VALUE | false, FM>;
    onChange?: ItemConfigEventHandler<VALUE, FM>;
    autorunMethod?: (value: VALUE, formStore?: FormStore<FM>, itemConfig?: IItemConfig<FM, VALUE, CVALUE>) => void;
    filter?: FilterTypeKey | IFormValueTransformHandler<FM, VALUE, CVALUE>;
    filterToValue?: FilterTypeKey | IFormValueTransformHandler<FM, CVALUE, VALUE>;
    transformer?: IFormValueTransform<FM, VALUE, CVALUE> | FilterType<FM, VALUE, CVALUE>;
    refConfig?: (store: FormStore) => void;
    slot?: string;
    useSlot?: boolean | string;
};
export interface IItemConfigCreater<FM = any, VALUE = any> {
    /**
     * a
     */
    disabled?: ComputedPropertyCreater<boolean, FM>;
    hidden?: ComputedPropertyCreater<boolean, FM>;
    value?: ComputedPropertyCreater<VALUE, FM>;
    defaultValue?: ComputedPropertyCreater<VALUE, FM>;
    required?: ComputedPropertyCreater<boolean | IRuleConfig<VALUE>, FM>;
    viewOnly?: ComputedPropertyCreater<boolean, FM>;
    options?: ComputedPropertyCreater<OptionBase[], FM>;
    loading?: ComputedPropertyCreater<boolean, FM>;
}
/**
 * typeof i
 */
export interface IFormItemConstructor<FM = any, VALUE = any, CVALUE = VALUE> extends IItemConfigStatic<FM, VALUE, CVALUE>, ConstructorPick<IItemConfigCreater<FM, VALUE>>, ConstructorPick<ISearchConfigCreater<VALUE, FM>>, ConstructorPick<IDisplayConfigCreater<FM>>, ConstructorPick<IRuleStoreCreater<VALUE, FM>> {
    children?: IKeyValueMap<IFormItemConstructor<FM, VALUE, CVALUE>> | false;
    [key: string]: any;
}
export interface IItemConfig<FM = FormModel, VALUE = any, CVALUE = VALUE> extends IItemConfigStatic<FM, VALUE, CVALUE>, ComputedPick<IItemConfigCreater<FM, VALUE>, FM>, ISearchConfig<VALUE, FM>, IDisplayConfig<FM>, IRuleStore<VALUE, FM>, IEventStoreBase, CommonStore {
    i: IFormItemConstructor<FM, VALUE>;
    formStore: FormStore<FM>;
    formSource: FM;
    form: FM;
    currentValue?: any;
    currentComponentValue?: any;
    setOptions(options: ComputedProperty<FM, OptionBase[]>, source?: string): void;
    setLoading(loading: boolean, source?: string): void;
    useSlot: boolean;
    slot: string;
    [key: string]: any;
}
export declare type Typed<T> = {
    [K in keyof T]: T[K];
};
export declare type ItemConfigType = Typed<IItemConfig>;
export declare type BaseItemConfigTransformer<FM = FormModel, VALUE = any> = ITransformer<IItemConfig<FM, VALUE>, FilterType<FM, VALUE>>;
