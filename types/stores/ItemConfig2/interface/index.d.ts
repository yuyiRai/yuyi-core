import { IComputedValue, IInterceptor, IObservableValue, IReactionDisposer, IReactionOptions, IReactionPublic, IValueDidChange, IValueWillChange, Lambda } from "mobx";
import { ITransformer } from "mobx-utils";
import { OptionBase } from "../../../utils";
import { IEventStoreBase } from "@/stores/EventStore";
import { FilterType, IFormValueTransform } from "../../ItemConfig/input";
import { IDisplayConfig, IDisplayConfigCreater } from "../../ItemConfig/ItemDisplayConfig";
import { ISearchConfig, ISearchConfigCreater } from "../../ItemConfig/SearchStore";
export declare type FormItemType = "" | "text" | "textArea" | "textarea" | 'number' | 'date' | 'dateTime' | 'dateToDate' | 'select' | 'search' | 'check' | 'radio' | 'radioOne' | 'checkOne' | 'switch' | 'address' | 'cascader' | undefined | null | never;
export declare type ComputedProperty<T, M = any> = T | ComputedPropertyConstructor<T, M>;
export declare type ComputedPropertyConstructor<T, M = any> = (form: M, itemConfig?: IItemConfig) => T;
export declare type ItemConfigEventHandler<T, R = void> = (e: T, formSource?: any, config?: IFormItemConfig) => R;
export declare type ValueAny = any;
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
export interface IFormItemConstructor<M = any> extends IFormItemBase, ISearchConfigCreater<any, any>, IDisplayConfigCreater<M> {
    [key: string]: ComputedProperty<any, M>;
}
export interface IBaseConfig extends IFormItemBase {
    value?: any;
    defaultValue?: any;
    disabled?: boolean;
    hidden?: boolean;
    refConfig?: (...args: any[]) => void;
    filter?: FilterType<any>;
    filterToValue?: FilterType<any>;
    transformer?: IFormValueTransform<any> | FilterType<any>;
}
export interface IFormItemConfig extends IBaseConfig, IDisplayConfig<any>, ISearchConfig<any, any> {
    rule?: any[] | string;
    requiredMessage?: string;
    options?: OptionBase[];
    loading?: boolean;
}
export declare abstract class CommonStore2 {
    destorySet: Set<IReactionDisposer | Lambda>;
    reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    onceReaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    observe<T = any>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): void;
    intercept(object: any, handler: IInterceptor<IValueWillChange<any>>): void;
    interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): void;
    destory(): void;
    registerKey(target: any, key: string, deep?: boolean): void;
}
export interface IItemConfig extends IFormItemConfig, IEventStoreBase, CommonStore2 {
    i?: IFormItemConstructor;
    form: any;
    formSource?: any;
    setOptions(options: any): void;
    setLoading(loading: boolean): void;
    [key: string]: any;
}
export declare type BaseItemConfigTransformer<T = any> = ITransformer<IItemConfig, T>;
