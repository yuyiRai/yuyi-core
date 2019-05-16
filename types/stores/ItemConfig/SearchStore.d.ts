import { IObservableArray, IReactionDisposer } from "mobx";
import { Option, OptionBase } from "../../utils";
import { IItemConfig, ItemConfigEventHandler } from "./interface";
import { CommonStore } from "./interface/CommonStore";
export declare type KeyString = string;
export interface ISearchConfigBase<V, FM> {
    remoteMethod?: ItemConfigEventHandler<KeyString, Promise<OptionBase[]>>;
    allowCreate?: boolean | ItemConfigEventHandler<KeyString, FM, Option>;
    multiple?: boolean;
    loadDataDeep?: number;
}
export interface ISearchConfigConstructor<V, FM> {
    loadData?: undefined | ((key: Option, keyList: Option[], form?: FM, itemConfig?: IItemConfig<V, FM>) => Promise<Option[]> | Option[]);
    getPathValueWithLeafValue?(leafValue: string): Option[] | Promise<Option[]>;
}
export interface ISearchConfig<V, FM> extends ISearchConfigBase<V, FM> {
    loadData?: undefined | ((key: Option, keyList: Option[], form?: FM, itemConfig?: IItemConfig<V, FM>) => Promise<Option[]> | Option[]);
    getPathValueWithLeafValue?(leafValue: string): Option[] | Promise<Option[]>;
}
export declare class SearchStore<V, FM> extends CommonStore {
    [k: string]: any;
    mode: 'filter' | 'search';
    itemConfig: IItemConfig<V, FM>;
    searchKeyHistory: IObservableArray<string>;
    readonly keyWord: string | undefined;
    inited: boolean;
    initedListener: IReactionDisposer;
    constructor(itemConfig: IItemConfig<V, FM>);
    initAction(): IReactionDisposer;
    readonly searchName: any;
    readonly getPathValueWithLeafValue: (leafValue: string) => Option[] | Promise<Option[]>;
    initOption(): Promise<void>;
    initOptionWithLeafValue(value?: string): Promise<void>;
    initOptionWithPathValue(value?: string[]): Promise<void>;
    initTopOptions(): Promise<OptionBase[]>;
    initOptionWithOptionList(optionList: Option[] | Promise<Option[]>): Promise<void>;
    loadDataBuffer: (value: Option[]) => Promise<any>;
    readonly loadData: (dataPath: Option[]) => Promise<void>;
    private loadDataHandler;
    private lazyLoadDataPromise;
    searchOptions(keyPath: Option[], optionsList?: OptionBase[]): {
        path: string;
        result: Option;
    };
    readonly searchHintText: string;
    searchResult: any[];
    onSearch(keyWord: string, trigger?: string): void;
    toSearch(keyWord: string): void;
    resetKeyword(): void;
    readonly remoteMethod: (keyWord: string) => Promise<any>;
    remoteSearch(keyWord: string): Promise<any>;
    multipleRemoteSearch(keyWord: string[]): Promise<OptionBase[]>;
}
