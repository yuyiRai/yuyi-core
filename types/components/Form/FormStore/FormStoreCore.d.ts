import { IKeyValueMap, IMapDidChange, ObservableMap } from 'mobx';
import { FormModel } from '../Interface/FormItem';
import { IFormItemStore, IFormItemStoreCore } from "./FormItemStoreBase";
import { GFormStore } from './GFormStore';
import { ConfigInit, ItemConfigGroupStore } from './ItemConfigGroupStore';
export declare type onItemChangeCallback = (code: string, value: any) => void;
export declare class FormStoreCore<FM extends FormModel, VM extends IFormItemStore<FM> = any> extends GFormStore {
    configStore: ItemConfigGroupStore<FM>;
    constructor(config?: ConfigInit<any, FM>);
    formMap: ObservableMap<string, any>;
    formSource: FM;
    formSourceTrack: FM[];
    readonly lastFormSource: FM;
    readonly form: FM;
    formItemStores: IKeyValueMap<IFormItemStoreCore<FM, any>>;
    registerItemStore<V>(code: string, Constructor: VM): IFormItemStoreCore<FM, V>;
    onItemChange(callback: onItemChangeCallback): void;
    onItemChangeEmit(code: string, value: any): void;
    errorTack: IMapDidChange[];
    errorGroup: ObservableMap<string, Error[] | undefined>;
    readonly errors: IKeyValueMap<Error[]>;
    getErrors(itemKey: string): Error[];
    hasErrors(itemKey: string): boolean;
    updateError(itemKey: string, errors?: Error[] | undefined): void;
}
