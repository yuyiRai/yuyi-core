import { IKeyValueMap, ObservableMap } from 'mobx';
import { ItemConfig } from 'src/stores';
import { CommonStore, IFormItemConstructor, FormModel } from '../Interface/FormItem';
import { FormStoreCore } from './FormStoreCore';
export declare type ConfigInit<FM = FormModel, VKeys = any> = IFormItemConstructor<FM, VKeys>[] | IKeyValueMap<IFormItemConstructor<FM, VKeys>>;
export declare class ItemConfigGroupStore<FM = FormModel, VKeys = any> extends CommonStore {
    store: FormStoreCore<FM>;
    configSource: ObservableMap<string, IFormItemConstructor<FM, VKeys>>;
    itemConfigMap: ObservableMap<string, ItemConfig<VKeys, FM>>;
    readonly config: IFormItemConstructor<FM, VKeys, VKeys>[];
    readonly configList: IFormItemConstructor<FM, VKeys, VKeys>[];
    readonly itemConfigConstructorMap: IKeyValueMap<IFormItemConstructor<FM, VKeys>>;
    readonly itemCodeList: string[];
    readonly itemCodeNameMap: IKeyValueMap<string>;
    readonly itemCodeNameList: string[];
    getConfig(code: string): IFormItemConstructor<FM, VKeys, VKeys>;
    getItemConfig(code: string): ItemConfig<VKeys, FM>;
    setConfigSource<V>(configSource: ConfigInit<FM, V>): void;
    constructor(formStore: FormStoreCore<FM>);
}
