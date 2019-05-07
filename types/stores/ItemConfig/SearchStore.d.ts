import { Option } from "../../utils";
import { IItemConfig } from "./interface/ItemConfig";
export interface ISearchConfig {
    remoteMethod?: <T = Option>(key: string, formSource?: any, config?: this) => Promise<T[]>;
    multiple?: boolean;
}
export declare class SearchStore {
    [k: string]: any;
    itemConfig: IItemConfig;
    keyWord: string | null;
    constructor(itemConfig: IItemConfig);
    readonly searchName: string;
    getSearchName(): string;
    readonly searchHintText: string;
    searchResult: any[];
    onSearch(keyWord: string): void;
    readonly remoteMethod: (keyWord: string) => Promise<any>;
    remoteSearch(keyWord: string): Promise<any>;
    multipleRemoteSearch(keyWord: string[]): Promise<Option[]>;
}
