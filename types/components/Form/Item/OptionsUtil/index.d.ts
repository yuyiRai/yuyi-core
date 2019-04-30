import { ItemConfig, OptionsStore } from "../../../../stores";
import { IReactComponent } from "mobx-react";
export declare function useOptionsStore(itemConfig: ItemConfig): OptionsStore;
export declare function useOptionsStoreProps<P = any>(itemConfig: ItemConfig, Component: IReactComponent<P>): IReactComponent<P>;
