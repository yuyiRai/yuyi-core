import { IKeyValueMap, IMapDidChange, Lambda, ObservableMap } from 'mobx';
import { FormModel } from '../ItemConfig';
import { FormItemStoreCore, IFormItemStoreConstructor } from "./FormItemStoreBase";
import { GFormStore } from './GFormStore';
import { ConfigInit, ItemConfigGroupStore } from './ItemConfigGroupStore';
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class FormStoreCore<FM extends FormModel, VM extends IFormItemStoreConstructor<FM> = any> extends GFormStore {
    name: string;
    setUUID(uuid: string): void;
    configStore: ItemConfigGroupStore<FM>;
    formSourceListerner: Lambda;
    /**
     * 下一批待校验的code队列
     */
    validateList: Set<string>;
    clearValidate(): void;
    readonly allFormMap: WeakMap<any, import("./FormStore").FormStore<any, any>>;
    constructor();
    lastSetConfig: ConfigInit<FM>;
    setConfig<V>(config: ConfigInit<FM, V>): void;
    formMap: ObservableMap<keyof FM, any>;
    lastFormSource: FM;
    formSource: FM;
    /**
     * 克隆自formMap的对象，取到对应字段时才触发reaction
     */
    readonly formsourceCloneFromMap: FM;
    formCache: FM;
    setForm(formSource: FM): void;
    replaceForm(formMap: ObservableMap<string, any>): void;
    getValueWithName(code: string, nameCode: string): string;
    formItemStores: IKeyValueMap<FormItemStoreCore<FM, any>>;
    registerItemStore<T extends FormItemStoreCore<FM, any>>(code: string, Init: VM): T;
    unregisterItemStore(code: string): boolean;
    onItemChange(callback: onItemChangeCallback): void;
    onItemChangeEmit(code: string, value: any): void;
    errorTack: IMapDidChange[];
    errorGroup: ObservableMap<string, Error[] | undefined>;
    readonly errors: IKeyValueMap<Error[]>;
    getErrors(itemKey: string): Error[];
    hasErrors(itemKey: string): boolean;
    updateError(itemKey: string, errors?: Error[] | undefined): void;
}
//# sourceMappingURL=FormStoreCore.d.ts.map