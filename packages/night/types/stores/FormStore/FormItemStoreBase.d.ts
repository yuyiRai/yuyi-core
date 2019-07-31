import { CommonStore } from '../CommonStore';
import { ItemConfig } from '../ItemConfig';
import { FormStoreCore } from './FormStoreCore';
export interface IFormItemStoreCore<FM = any, V = any> {
    code: string;
    formStore: VMFormStore<FM, V>;
    itemConfig: ItemConfig<V, FM>;
}
export interface IFormItemStoreConstructor<FM = any, V = any, VM extends IFormItemStoreCore<FM, V> = IFormItemStoreCore<FM, V>> {
    new (formStore: VMFormStore<FM, V>, code: string): VM;
}
export declare type VMFormStore<FM, V> = FormStoreCore<FM, IFormItemStoreConstructor<FM, V>>;
export declare class FormItemStoreCore<FM, V> extends CommonStore implements IFormItemStoreCore<FM, V> {
    code: string;
    type: string;
    formStore: VMFormStore<FM, V>;
    constructor(formStore: VMFormStore<FM, V>, code: string);
    readonly itemConfig: ItemConfig<V, FM>;
    readonly hasError: boolean;
    readonly currentError: Error[] | undefined;
    setFormStore(formStore: VMFormStore<FM, V>): void;
}
//# sourceMappingURL=FormItemStoreBase.d.ts.map