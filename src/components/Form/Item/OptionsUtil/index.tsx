import { IReactComponent } from "mobx-react";
import { Observer, useAsObservableSource } from "mobx-react-lite";
import { ITransformer } from "mobx-utils";
import React from 'react';
import { ItemConfig, OptionsStore } from "../../../../stores";
import 'antd/lib/input/style/css';

export function useOptionsStore(itemConfig: ItemConfig, transformer?: ITransformer<OptionsStore, JSX.Element[]>) {
  // reaction(()=>itemConfig.options, console.log)
  return useAsObservableSource(itemConfig.useOptionsStore(transformer));
}

export function useSearchStore(itemConfig: ItemConfig, transformer?: ITransformer<OptionsStore, JSX.Element[]>) {
  // reaction(()=>itemConfig.options, console.log)
  return useAsObservableSource(itemConfig.useSearchStore(transformer));
}

export function useItemConfig(itemConfig: ItemConfig) {
  // reaction(()=>itemConfig.options, console.log)
  return useAsObservableSource(itemConfig);
}

export function useOptionsStoreProps<P = any>(itemConfig: ItemConfig, Component: IReactComponent<P>): IReactComponent<P> {
  const [ store ] = React.useState(itemConfig.useOptionsStore())
  // reaction(()=>itemConfig.options, console.log)
  return (((props: P) => {
    return <Observer render={() => <Component {...props} options={store.displayOptions} />}></Observer>
  }));
}

