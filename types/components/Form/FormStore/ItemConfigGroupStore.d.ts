import { IKeyValueMap, ObservableMap } from 'mobx';
import { ItemConfig } from 'src/stores';
import { CommonStore, IFormItemConstructor, FormModel } from '../Interface/FormItem';
import { FormStoreCore } from './FormStoreCore';
export declare type ConfigInit<FM = FormModel, VKeys = any> = IFormItemConstructor<VKeys, FM>[] | IKeyValueMap<IFormItemConstructor<VKeys, FM>>;
export declare class ItemConfigGroupStore<FM = FormModel, VKeys = any> extends CommonStore {
    store: FormStoreCore<FM>;
    configSource: ObservableMap<string, IFormItemConstructor<VKeys, FM>>;
    itemConfigMap: ObservableMap<string, ItemConfig<VKeys, FM>>;
    readonly config: IFormItemConstructor<VKeys, FM>[];
    readonly configList: IFormItemConstructor<VKeys, FM>[];
    readonly itemConfigConstructorMap: IKeyValueMap<IFormItemConstructor<VKeys, FM>>;
    readonly itemCodeList: string[];
    readonly itemCodeNameMap: IKeyValueMap<string>;
    readonly itemCodeNameList: string[];
    getConfig(code: string): IFormItemConstructor<VKeys, FM>;
    getItemConfig(code: string): ItemConfig<VKeys, FM>;
    setConfigSource<V>(configSource: ConfigInit<FM, V>): void;
    constructor(formStore: FormStoreCore<FM>);
}
