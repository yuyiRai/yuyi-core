import { ObservableMap, IObservableArray, IKeyValueMap, IMapDidChange, Lambda } from 'mobx';
import { IFormItemConfig } from './Interface/FormItem';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ItemConfig } from '../../stores';
import { FormItemStore } from './FormItem';
import { EventEmitter } from '../../utils/EventEmitter';
export interface ICommonFormConfig extends IKeyValueMap {
    $formStore?: FormStore;
    [k: string]: WrappedFormUtils | FormStore | ItemConfig;
}
export declare type keys = keyof ICommonFormConfig;
export declare class GFormStore {
    static formMap: WeakMap<any, FormStore>;
    static disposedForm(form: any): void;
    static registerForm<T = any>(form: any, instance: T, replace?: FormStore): FormStore<any>;
}
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class FormStore<T extends IKeyValueMap = any> extends GFormStore {
    [x: string]: any;
    constructor();
    formSource: T;
    formSourceTrack: T[];
    readonly lastFormSource: T;
    formMap: ObservableMap<keyof T, any>;
    readonly form: T;
    errorTack: IMapDidChange[];
    instance: any;
    formSourceListerner: Lambda;
    errorGroup: ObservableMap<keyof T, Error[]>;
    readonly errors: IKeyValueMap<Error[]>;
    getErrors(itemKey: keyof T): Error[];
    hasErrors(itemKey: keyof T): boolean;
    updateError(itemKey: keyof T, errors?: Array<Error>): void;
    clearValidate(): void;
    config: IObservableArray<IFormItemConfig>;
    readonly configList: IFormItemConfig[];
    onItemChange(callback: onItemChangeCallback): void;
    onItemChangeEmit(code: string, value: any): void;
    patchFieldsChange(patch: T, path?: string[], callback?: any): IKeyValueMap<boolean>;
    validate(): Promise<void>;
    readonly allFormMap: WeakMap<any, FormStore<any>>;
    formItemMap: ObservableMap<any, ICommonFormConfig>;
    readonly formItemConfigMap: ICommonFormConfig;
    reactionAntdFormEmitter: EventEmitter<WrappedFormUtils<any>>;
    reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void): void;
    receiveAntdForm(antdForm: WrappedFormUtils): void;
    antdForm: WrappedFormUtils;
    antdFormMap: ObservableMap<string, WrappedFormUtils>;
    setAntdForm(antdForm: WrappedFormUtils, code?: string): void;
    formItemStores: IKeyValueMap<FormItemStore>;
    registerItemStore(code: string): FormItemStore;
    registerForm(form: any, code: string, itemConfig: ItemConfig): void;
    getConfig(code: string): IFormItemConfig;
    setForm(form: T, instance: any): void;
    setConfig(configList: IFormItemConfig[]): void;
    private registerFormSourceListerner;
    replaceForm(formMap: ObservableMap<string, any>): void;
    registerKey(target: any, deep?: boolean): void;
}
export declare function mapToDiff(map: ObservableMap<any>, form: any): ObservableMap<any, any>;
export declare function registerKey(target: any, key: string, deep?: boolean): void;
