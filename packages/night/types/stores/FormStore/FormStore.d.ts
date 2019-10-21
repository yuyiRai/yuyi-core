import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IKeyValueMap, ObservableMap } from 'mobx';
import { EventEmitter } from '@yuyi919/utils';
import { FormModel, IFormItemConstructor, ItemConfig } from '../ItemConfig';
import { IFormItemStoreConstructor } from "./FormItemStoreBase";
import { FormStoreCore } from './FormStoreCore';
import { PatchDataTree } from './PatchData';
export interface IFormItemValueUpdateTask {
    /**
     * formMap的key，浅层Key
     */
    mapKey: string;
    /**
     * formMap的value，浅层value
     */
    mapValue: any;
    /**
     * 完整的itemConfig.code
     */
    code: string;
    /**
     * 更新值
     */
    value: any;
    /**
     * 上一个值
     */
    lastValue: any;
}
export interface ICommonFormConfig extends IKeyValueMap {
    $formStore?: FormStore;
    [k: string]: WrappedFormUtils | FormStore | ItemConfig;
}
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class FormStore<FM extends FormModel = any, VM extends IFormItemStoreConstructor<FM, any> = IFormItemStoreConstructor<FM, any>> extends FormStoreCore<FM, VM> {
    antFormInited: boolean;
    readonly BufferCacheGroup: {
        ___timeBufferList: Map<any, [EventEmitter<any>, Promise<any[]>, number]>;
        ___timeBufferValueMap: WeakMap<[EventEmitter<any>, Promise<any[]>, number], any>;
    };
    constructor(configList?: IFormItemConstructor<any, FM>[]);
    patchFieldsChange(patch: PatchDataTree<FM>): IKeyValueMap<boolean>;
    patchFieldsChange(patch: PatchDataTree<FM>, async: true): Promise<IKeyValueMap<boolean>>;
    readonly firePatchFieldsChangeTaskList: (value: object) => Promise<any>;
    /**
     * 变更字段值
     * @param patch
     * @param path
     * @param callback
     */
    private withFieldsChange;
    /**
     * item.value翻译器集合
     */
    readonly formValueTransform: ObservableMap<any, any>;
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
    /**
     * 使用组件值设置表单的值
     * @param code 字段
     * @param value 值
     */
    setFormValueWithComponentValue(code: string, value: any): boolean;
    /**
     * 直接设置form的值
     * @param value 原始值
     * @param key 基础键
     * @param innerPath 深入键
     * @param transformerType 翻译器类型（不传则表示不翻译）
     */
    private setFormValueBy;
    /**
     *
     * @param code
     * @returns 是否成功（不成功可能是因为没有名字）
     */
    setFormValueWithName(code: string, nameValue?: string): boolean;
    pushTaskList(req: IFormItemValueUpdateTask): void;
    protected readonly fireUpdateValueTaskList: (value: IFormItemValueUpdateTask) => Promise<any>;
    handleUpdateFormValue(tasklist: IFormItemValueUpdateTask[]): void;
    validate(codeList?: string[]): Promise<any>;
    reactionAntdFormEmitter: EventEmitter<WrappedFormUtils<any>>;
    reactionAntdForm(callback: (antdForm: WrappedFormUtils) => void): void;
    receiveAntdForm(antdForm: WrappedFormUtils): void;
    antdForm: WrappedFormUtils;
    antdFormMap: ObservableMap<string, WrappedFormUtils>;
    setAntdForm(antdForm: WrappedFormUtils, code?: string): void;
}
//# sourceMappingURL=FormStore.d.ts.map