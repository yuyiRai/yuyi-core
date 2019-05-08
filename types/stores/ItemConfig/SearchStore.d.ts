import { IObservableArray } from "mobx";
import { Option, OptionBase } from "../../utils";
import { IItemConfig, ItemConfigEventHandler, CommonStore } from "./interface";
export declare type KeyString = string;
export interface ISearchConfigConstructor {
    remoteMethod?: ItemConfigEventHandler<KeyString, Promise<OptionBase[]>>;
    allowCreate?: boolean | ItemConfigEventHandler<KeyString, Option>;
    multiple?: boolean;
}
export interface ISearchConfig extends ISearchConfigConstructor {
}
export declare class SearchStore extends CommonStore {
    [k: string]: any;
    mode: 'filter' | 'search';
    itemConfig: IItemConfig;
    searchKeyHistory: IObservableArray<string>;
    readonly keyWord: string | undefined;
    constructor(itemConfig: IItemConfig);
    readonly searchName: string;
    getSearchName(): string;
    readonly searchHintText: string;
    searchResult: any[];
    onSearch(keyWord: string): void;
    toSearch(keyWord: string): void;
    resetKeyword(): void;
    readonly remoteMethod: (keyWord: string) => Promise<OptionBase[]>;
    remoteSearch(keyWord: string): Promise<OptionBase[]>;
    multipleRemoteSearch(keyWord: string[]): Promise<OptionBase[]>;
}
