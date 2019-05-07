import { ISearchConfig } from "../SearchStore";
import { IDisplayConfig } from "../ItemDisplayConfig";
import { Option } from "../../../utils";
import { IEventStoreBase } from "../../../utils/EventStore";
import { IReactionPublic, IReactionOptions, IObservableValue, IComputedValue, IValueDidChange, IReactionDisposer, Lambda, IInterceptor, IValueWillChange } from "mobx";
import { FilterType, IFormValueTransform } from "../input";
export declare type FormItemType = "" | "text" | "textArea" | "textarea" | 'number' | 'date' | 'dateTime' | 'dateToDate' | 'select' | 'search' | 'check' | 'radio' | 'checkOne' | 'switch' | 'address' | undefined | null | never;
export declare type ComputedProperty<T> = T & ComputedPropertyConstructor<T>;
export declare type ComputedPropertyConstructor<T> = (form: any, itemConfig: IItemConfig) => T;
export interface IFormItemConstructorBase {
    type?: FormItemType;
    code: string | '_';
    nameCode?: string;
    label?: string;
}
export interface IFormItemConstructor extends IFormItemConstructorBase {
    disabled?: ComputedProperty<boolean>;
    hidden?: ComputedProperty<boolean>;
    value?: ComputedProperty<any>;
    defaultValue?: ComputedProperty<any>;
    [key: string]: ComputedProperty<any>;
}
export interface IBaseConfig extends IFormItemConstructorBase {
    value?: any;
    defaultValue?: any;
    disabled?: boolean;
    hidden?: boolean;
    refConfig?: (...args: any[]) => void;
    filter?: FilterType;
    filterToValue?: FilterType;
    transformer?: IFormValueTransform | FilterType;
}
export interface IFormItemConfig extends IBaseConfig, IDisplayConfig, ISearchConfig {
    rule?: any[] | string;
    requiredMessage?: string;
    options?: Option[];
    loading?: boolean;
}
export declare abstract class CommonStore {
    destorySet: Set<IReactionDisposer | Lambda>;
    reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    observe<T = any>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): void;
    intercept(object: any, handler: IInterceptor<IValueWillChange<any>>): void;
    interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): void;
    destory(): void;
}
export interface IItemConfig extends IFormItemConfig, IEventStoreBase, CommonStore {
    i?: IFormItemConstructor;
    form: any;
    formSource?: any;
    setOptions(options: any): void;
    setLoading(loading: boolean): void;
    [key: string]: any;
}
