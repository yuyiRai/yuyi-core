import { ItemConfig } from "../../../stores";
import { OptionsStore } from "../../../stores/ItemConfig/OptionsStore";
import { IKeyValueMap } from 'mobx';
import { ITransformer } from 'mobx-utils';
import * as React from 'react';
export declare type ItemConfigContext = {
    code: string;
    pipe?: (itemConfig: ItemConfig) => any;
};
export declare const FormItemConfigContext: React.Context<ItemConfigContext>;
export declare function useFormItemConfig<V = any, FM extends IKeyValueMap = IKeyValueMap>(): {
    itemConfig: ItemConfig<V, FM>;
};
export declare type ReturnMapType<T extends IKeyValueMap> = {
    [K in keyof T]: ReturnType<T[K]>;
};
export declare type ComputedMap<T extends ComputedMap = any> = IKeyValueMap<(this: ILiteSearchStore<T>) => any>;
export interface ILiteSearchStore<T extends ComputedMap = any> extends IUseSearchStoreOptions<T> {
    searchStore: IUseSearchStoreOptions<T>['itemConfig']['searchStore'];
    optionsStore: IUseSearchStoreOptions<T>['itemConfig']['optionsStore'];
    code: IUseSearchStoreOptions<T>['itemConfig']['code'];
    type: IUseSearchStoreOptions<T>['itemConfig']['type'];
    destory(): any;
    append(key: keyof T, value: ReturnType<T[typeof key]>): void;
    [k: string]: any;
}
export declare type LiteSearchStore<T extends ComputedMap<T> = any> = ILiteSearchStore<T> & ReturnMapType<T>;
export interface IUseSearchStoreOptions<T extends ComputedMap<T> = ComputedMap> {
    transformer?: ITransformer<OptionsStore<any, any>, any[]>;
    itemConfigContext?: {
        itemConfig: ItemConfig;
    };
    itemConfig?: ItemConfig;
    computedMap?: T;
    ref?: React.MutableRefObject<any>;
    callback?: React.MutableRefObject<{
        callback: (key: string) => any;
    }>;
}
declare type Creater<T> = T | (() => T);
export declare function useSearchStore<T extends ComputedMap, O extends IUseSearchStoreOptions<T>>(options: Creater<O & {
    computedMap?: T;
}>): LiteSearchStore<T>;
export {};
//# sourceMappingURL=useItemConfig.d.ts.map