import { ItemConfig } from '@/stores';
import { CommonStore } from '@/stores/ItemConfig/interface';
import { FormStoreCore } from './FormStoreCore';
export interface IFormItemStoreCore<FM = any, V = any> {
    code: string;
    formStore: VMFormStore<FM, V>;
    itemConfig: ItemConfig<V, FM>;
}
export interface IFormItemStoreConstructor<FM = any, V = any> {
    new (formStore: VMFormStore<FM, V>, code: string): IFormItemStoreCore<FM, V>;
}
export declare type VMFormStore<FM, V> = FormStoreCore<FM, IFormItemStoreCore<FM, V>>;
export declare class FormItemStoreCore<FM, V> extends CommonStore implements IFormItemStoreCore<FM, V> {
    code: string;
    formStore: VMFormStore<FM, V>;
    constructor(formStore: VMFormStore<FM, V>, code: string);
    readonly itemConfig: ItemConfig<V, FM>;
    readonly hasError: boolean;
    setFormStore(formStore: VMFormStore<FM, V>): void;
}
