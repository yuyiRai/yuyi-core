import { IKeyValueMap } from 'mobx';
import { CommonStore } from '../CommonStore';
import { FormModel, IFormItemConstructor, ItemConfig } from '../ItemConfig';
import { FormStoreCore } from './FormStoreCore';
export declare type ConfigInit<FM = FormModel, VKeys = any> = IFormItemConstructor<FM, VKeys>[] | IKeyValueMap<IFormItemConstructor<FM, VKeys>>;
export declare class ItemConfigGroupStore<FM = FormModel, VKeys = any> extends CommonStore {
    private configSourceMap;
    store: FormStoreCore<FM>;
    constructor(formStore: FormStoreCore<FM>);
    setConfigSource<V>(configSource: ConfigInit<FM, VKeys>): void;
    readonly itemConfigGroup: IKeyValueMap<ItemConfig<VKeys, FM>>;
    readonly configList: ReadonlyArray<IFormItemConstructor<any, VKeys, VKeys>>;
    readonly itemConfigConstructorMap: IKeyValueMap<IFormItemConstructor<FM, VKeys>>;
    readonly itemCodeList: string[];
    readonly itemCodeNameMap: IKeyValueMap<string>;
    readonly itemCodeNameList: string[];
    getConfig(code: string): IFormItemConstructor<FM, VKeys, VKeys>;
    getItemConfig(code: string): ItemConfig<VKeys, FM>;
}
//# sourceMappingURL=ItemConfigGroupStore.d.ts.map