import { ObservableMap, IObservableArray, IKeyValueMap, IMapDidChange, Lambda } from 'mobx';
import { IFormItemConstructor } from './Interface/FormItem';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ItemConfig, IFormValueTransform } from '../../stores';
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
    config: IObservableArray<IFormItemConstructor>;
    readonly configList: IFormItemConstructor[];
    onItemChange(callback: onItemChangeCallback): void;
    onItemChangeEmit(code: string, value: any): void;
    patchFieldsChange(patch: T, path?: string[], callback?: any): IKeyValueMap<boolean>;
    readonly formValueTransform: Map<string, IFormValueTransform>;
    getV2FValue(key: string, value: any): any;
    getF2VValue(key: string, value: any): any;
    setFormValue(value: any, key: string, innerPath?: string): boolean;
    validate(): Promise<void>;
    readonly allFormMap: WeakMap<any, FormStore<any>>;
    reactionAntdFormEmitter: EventEmitter<WrappedFormUtils<any>>;
    reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void): void;
    receiveAntdForm(antdForm: WrappedFormUtils): void;
    antdForm: WrappedFormUtils;
    antdFormMap: ObservableMap<string, WrappedFormUtils>;
    setAntdForm(antdForm: WrappedFormUtils, code?: string): void;
    formItemStores: IKeyValueMap<FormItemStore>;
    registerItemStore(code: string): FormItemStore;
    getConfig(code: string): IFormItemConstructor;
    setForm(form: T, instance: any): void;
    setConfig(configList: IFormItemConstructor[]): void;
    private registerFormSourceListerner;
    replaceForm(formMap: ObservableMap<string, any>): void;
    registerKey(target: any, deep?: boolean): void;
}
export declare function mapToDiff(map: ObservableMap<any>, form: any): ObservableMap<any, any>;
export declare function registerKey(target: any, key: string, deep?: boolean): void;
