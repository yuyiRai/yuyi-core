import { ItemConfig, OptionsStore } from "../../../../stores";
import { useAsObservableSource, Observer } from "mobx-react-lite";
import { IReactComponent } from "mobx-react";
import React from 'react'

export function useOptionsStore(itemConfig: ItemConfig) {
  // reaction(()=>itemConfig.options, console.log)
  return useAsObservableSource(new OptionsStore(itemConfig));
}


export function useOptionsStoreProps<P = any>(itemConfig: ItemConfig, Component: IReactComponent<P>): IReactComponent<P> {
  const [ store ] = React.useState(new OptionsStore(itemConfig))
  // reaction(()=>itemConfig.options, console.log)
  return (((props: P) => {
    return <Observer render={() => <Component {...props} options={store.displayOptions} />}></Observer>
  }));
}