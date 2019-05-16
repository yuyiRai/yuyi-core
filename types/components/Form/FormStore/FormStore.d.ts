import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IKeyValueMap, IMapDidChange, IObservableArray, Lambda, ObservableMap } from 'mobx';
import { IFormValueTransform, ItemConfig } from '@/stores';
import { CommonStore } from '@/stores/ItemConfig/interface/CommonStore';
import { EventEmitter } from '@/utils/EventEmitter';
import { FormItemStore } from './FormItem';
import { IFormItemConstructor, FormModel } from './Interface/FormItem';
export declare const ConfigKeys: any[];
export interface ICommonFormConfig extends IKeyValueMap {
    $formStore?: FormStore;
    [k: string]: WrappedFormUtils | FormStore | ItemConfig;
}
export declare class GFormStore extends CommonStore {
    static formMap: WeakMap<any, FormStore>;
    static disposedForm(form: any): void;
    static registerForm<T = any>(form: any, instance: T, replace?: FormStore): FormStore<any>;
}
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class ItemConfigGroup {
    config: IObservableArray<IFormItemConstructor>;
    readonly configList: any[];
    readonly itemConfigConstructorMap: IKeyValueMap<IFormItemConstructor>;
    readonly itemCodeList: string[];
    readonly itemCodeNameMap: IKeyValueMap<string>;
    readonly itemCodeNameList: string[];
    getConfig(code: string): any;
    setConfigList(configList: IFormItemConstructor[]): void;
}
export declare class FormStoreCore extends GFormStore {
    configStore: ItemConfigGroup;
    constructor(configList?: IFormItemConstructor[]);
}
export declare class FormStore<FM extends FormModel = any> extends FormStoreCore {
    constructor(configList?: IFormItemConstructor[]);
    formSource: FM;
    formSourceTrack: FM[];
    readonly lastFormSource: FM;
    formMap: ObservableMap<keyof FM, any>;
    readonly form: FM;
    errorTack: IMapDidChange[];
    instance: any;
    formSourceListerner: Lambda;
    errorGroup: ObservableMap<keyof FM, Error[] | undefined>;
    readonly errors: IKeyValueMap<Error[]>;
    getErrors(itemKey: keyof FM): Error[];
    hasErrors(itemKey: keyof FM): boolean;
    updateError(itemKey: keyof FM, errors?: Error[] | undefined): void;
    clearValidate(): void;
    onItemChange(callback: onItemChangeCallback): void;
    onItemChangeEmit(code: string, value: any): void;
    patchFieldsChange(patch: PatchDataTree<FM>, path?: string[], callback?: any): IKeyValueMap<boolean>;
    readonly formValueTransform: Map<string, IFormValueTransform<FM, any, any>>;
    /**
     * 将组件用value转换为表单用的value
     * @param key 完整code
     * @param value 值
     */
    getV2FValue(key: string, value: any): any;
    /**
     * 将表单用value转换为组件用的value
     * @param key 完整code
     * @param value form值
     */
    getF2VValue(key: string, value: any): any;
    /**
     * store的form里记录的都是原始值
     * component使用的值是在使用时进行过转译
     * 然后在onchange时再将返回回来的组件用值转译为form值
     * @param code
     * @param value 原始值
     */
    setFormValue(code: string, value: any): void;
    private getItemConfig;
    setFormValueWithComponentSource(code: string, value: any): boolean;
    /**
     * 直接设置form的值
     * @param value 原始值
     * @param key 基础键
     * @param innerPath 深入键
     * @param transformerType 翻译器类型（不传则表示不翻译）
     */
    private setFormValueBy;
    searchNameWatcher: any;
    getValueWithName(code: string, nameCode: string): string;
    validate(codeList?: string[]): Promise<void>;
    readonly allFormMap: WeakMap<any, FormStore<any>>;
    reactionAntdFormEmitter: EventEmitter<WrappedFormUtils<any>>;
    reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void): void;
    receiveAntdForm(antdForm: WrappedFormUtils): void;
    antdForm: WrappedFormUtils;
    antdFormMap: ObservableMap<string, WrappedFormUtils>;
    setAntdForm(antdForm: WrappedFormUtils, code?: string): void;
    formItemStores: IKeyValueMap<FormItemStore>;
    registerItemStore(code: string): FormItemStore;
    setConfig(configList: IFormItemConstructor[]): void;
    setForm(form: FM, instance: any): void;
    private registerFormSourceListerner;
    replaceForm(formMap: ObservableMap<string, any>): void;
    registerFormKey(target: any, deep?: boolean): void;
}
export declare type PatchData<T> = {
    name: keyof T;
    value?: any;
    validating?: boolean;
    errors?: Error[];
};
export declare type PatchDataTree<T> = {
    [key: string]: PatchDataTree<T> | PatchData<T>;
};
