import { Option, OptionBase } from "../../utils";
import { IObservableArray, IReactionDisposer } from "mobx";
import { IItemConfig, ItemConfigEventHandler } from "./interface";
import { ItemConfigModule } from "./itemConfigModule";
export declare type KeyString = string;
export interface ISearchConfigBase<FM> {
    remoteMethod?: ItemConfigEventHandler<KeyString, FM, Promise<OptionBase[]>>;
    allowCreate?: boolean | ItemConfigEventHandler<KeyString, FM, Option>;
    multiple?: boolean;
    loadDataDeep?: number;
}
export interface ISearchConfigCreater<V, FM> {
    strictSearch?: boolean;
    loadData?: undefined | ((key: Option, keyList: Option[], form?: FM, itemConfig?: IItemConfig<FM, V>) => Promise<Option[]> | Option[]);
    getPathValueWithLeafValue?(leafValue: string): Option[] | Promise<Option[]>;
}
export interface ISearchConfig<V, FM> extends ISearchConfigBase<FM> {
    strictSearch?: boolean;
    loadData?: undefined | ((key: Option, keyList: Option[], form?: FM, itemConfig?: IItemConfig<FM, V>) => Promise<Option[]> | Option[]);
    getPathValueWithLeafValue?(leafValue: string): Option[] | Promise<Option[]>;
}
export declare class SearchStore<V, FM> extends ItemConfigModule<FM, V> {
    [k: string]: any;
    mode: 'filter' | 'search';
    searchKeyHistory: IObservableArray<string>;
    readonly keyWord: string | undefined;
    inited: boolean;
    initedListener: IReactionDisposer;
    searchResult: any;
    postConstructor(): void;
    constructor(itemConfig: IItemConfig<FM, V>);
    initAction(): IReactionDisposer;
    readonly searchName: any;
    readonly getPathValueWithLeafValue: (leafValue: string) => Option[] | Promise<Option[]>;
    initOption(): Promise<void>;
    initOptionWithLeafValue(value?: string): Promise<void>;
    initOptionWithPathValue(value?: string[]): Promise<void>;
    initTopOptions(): Promise<OptionBase[]>;
    initOptionWithOptionList(optionList: Option[]): Promise<void>;
    setLoadedOptions(options: OptionBase[]): void;
    loadingStart(sourceName?: string): void;
    loadingEnd(sourceName?: string): void;
    readonly loadDataBuffer: (value: Option[]) => Promise<any>;
    readonly loadData: typeof SearchStore['prototype']['loadDataHandler'] | undefined;
    private loadDataHandler;
    private lazyLoadDataPromise;
    searchOptions(keyPath: Option[], optionsList?: OptionBase[]): {
        path: string;
        result: Option;
    };
    readonly searchHintText: string;
    onSearch(keyWord: string, trigger?: string): void;
    toSearch(keyWord: string): Promise<void>;
    resetKeyword(): void;
    readonly remoteMethod: ((keyWord: string) => Promise<OptionBase[]>) | (() => Promise<any[]>);
    static getRemoteMethod: (itemConfig: IItemConfig<import("mobx").IKeyValueMap<any>, any, any>) => (keyWord: string) => Promise<OptionBase[]>;
    remoteSearch(keyWord: string): Promise<any[]>;
    multipleRemoteSearch(keyWord: string[]): Promise<OptionBase[]>;
}
//# sourceMappingURL=SearchStore.d.ts.map