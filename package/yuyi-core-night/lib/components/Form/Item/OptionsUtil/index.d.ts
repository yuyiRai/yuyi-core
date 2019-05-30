/// <reference types="react" />
import { IReactComponent } from "mobx-react";
import { ITransformer } from "mobx-utils";
import { ItemConfig } from "@/stores";
import 'antd/lib/input/style/css';
import { OptionsStore } from "@/stores/ItemConfig/OptionsStore";
export declare function useOptionsStore<T = JSX.Element>(itemConfig: ItemConfig, transformer?: ITransformer<OptionsStore, T[]>): OptionsStore<any, any>;
export declare function useSearchStore<T = JSX.Element>(itemConfig: ItemConfig, transformer?: ITransformer<OptionsStore, T[]>): import("../../../../stores/ItemConfig/SearchStore").SearchStore<any, any>;
export declare function useItemConfig(itemConfig: ItemConfig): ItemConfig<any, import("mobx").IKeyValueMap<any>>;
export declare function useOptionsStoreProps<P = any>(itemConfig: ItemConfig, Component: IReactComponent<P>): IReactComponent<P>;
