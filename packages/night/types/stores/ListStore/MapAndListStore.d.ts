import { IKeyValueMap, ObservableMap } from 'mobx';
import { CommonStore } from '../CommonStore';
export declare type IKeyData<Key extends string> = IKeyValueMap<any> & {
    readonly [K in Key]-?: string;
};
export declare class KeyDataMapStore<DataKey extends string, SourceData extends IKeyData<DataKey>, TargetData extends IKeyData<DataKey> = SourceData> extends CommonStore {
    readonly keyName: DataKey;
    transformer: IMapTransformer<DataKey, SourceData, TargetData>;
    sourceMap: ObservableMap<string, SourceData>;
    protected readonly targetMap: ObservableMap<string, TargetData>;
    readonly sourceData: IKeyValueMap<SourceData>;
    sourceDataSnapshot: IKeyValueMap<SourceData>;
    readonly targetData: IKeyValueMap<TargetData>;
    readonly sourceValueList: readonly SourceData[];
    readonly keyList: string[];
    readonly valueList: ReadonlyArray<TargetData>;
    getSourceData(keyValue: string): SourceData;
    reduce(callback: any, init: any): any;
    mapValueWithSource<VT = any>(valueKey: string, autoZip?: boolean): IKeyValueMap<VT>;
    mapValueWithTarget<VT = any>(valueKey: string, autoZip?: boolean): IKeyValueMap<VT>;
    getTargetData(keyValue: string): TargetData;
    getConfigKey(config: SourceData | TargetData): (SourceData | TargetData)[DataKey];
    setConfigKey(config: SourceData | TargetData, keyValue: string): (SourceData | TargetData)[DataKey];
    setSourceData(sourceData: SourceData[] | IKeyValueMap<SourceData>): void;
    constructor(keyName: DataKey, transformer: IMapTransformer<DataKey, SourceData, TargetData>);
}
export interface IMapTransformer<DataKey extends string, SourceData extends IKeyData<DataKey>, TargetData extends IKeyData<DataKey> = SourceData> {
    create(source: Readonly<SourceData>): TargetData;
    update(newSource: Readonly<SourceData>, prevTarget: TargetData): TargetData;
    delete?(target: TargetData, source?: SourceData): void;
}
//# sourceMappingURL=MapAndListStore.d.ts.map