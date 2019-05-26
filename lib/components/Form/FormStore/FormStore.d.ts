import { IFormValueTransform, ItemConfig } from '@/stores';
import { EventEmitter } from '@/utils/EventEmitter';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IKeyValueMap, ObservableMap } from 'mobx';
import { FormModel, IFormItemConstructor } from '../Interface/FormItem';
import { IFormItemStoreCore } from "./FormItemStoreBase";
import { FormStoreCore } from './FormStoreCore';
import { PatchDataTree } from './PatchData';
export interface ICommonFormConfig extends IKeyValueMap {
    $formStore?: FormStore;
    [k: string]: WrappedFormUtils | FormStore | ItemConfig;
}
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class FormStore<FM extends FormModel = any, VM extends IFormItemStoreCore<FM, any> = IFormItemStoreCore<FM, any>> extends FormStoreCore<FM, VM> {
    antFormInited: boolean;
    constructor(configList?: IFormItemConstructor<any, FM>[]);
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
    setFormValueWithComponentSource(code: string, value: any): boolean;
    /**
     * 直接设置form的值
     * @param value 原始值
     * @param key 基础键
     * @param innerPath 深入键
     * @param transformerType 翻译器类型（不传则表示不翻译）
     */
    private setFormValueBy;
    validate(codeList?: string[]): Promise<any>;
    reactionAntdFormEmitter: EventEmitter<WrappedFormUtils<any>>;
    reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void): void;
    receiveAntdForm(antdForm: WrappedFormUtils): void;
    antdForm: WrappedFormUtils;
    antdFormMap: ObservableMap<string, WrappedFormUtils>;
    setAntdForm(antdForm: WrappedFormUtils, code?: string): void;
}
