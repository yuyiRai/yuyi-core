/// <reference types="react" />
import { IReactComponent } from "mobx-react";
import { ITransformer } from "mobx-utils";
import { ItemConfig, OptionsStore } from "../../../../stores";
import 'antd/lib/input/style/css';
export declare function useOptionsStore(itemConfig: ItemConfig, transformer?: ITransformer<OptionsStore, JSX.Element[]>): OptionsStore<JSX.Element>;
export declare function useSearchStore(itemConfig: ItemConfig): import("../../../../stores/ItemConfig/SearchStore").SearchStore;
export declare function useOptionsStoreProps<P = any>(itemConfig: ItemConfig, Component: IReactComponent<P>): IReactComponent<P>;
