import * as React from 'react';
import { AppRoutesContext } from '../../route/Routes';
import { useLocalStore } from 'yuyi-core-night';
import { ILayoutProps } from '.';
import { IRouteConfig } from '../../route';
import { action } from 'mobx';

export function createStore(routes: IRouteConfig[]) {
  const store = {
    collapsed: false,
    toggleCollapsed: action(function () {
      this.collapsed = !this.collapsed;
    }),
    menu: [...routes],
    routes: [...routes]
  };
  return store;
}
export type LayoutStore = ReturnType<typeof createStore>;
export type LayoutChildren = React.Context<LayoutStore>['Consumer']['prototype']['props']['children']

export const layoutStoreContext = React.createContext<LayoutStore>(null as any)

export const useLayoutProvider = (children: (store: LayoutStore) => any) => {
  const routes = React.useContext(AppRoutesContext)
  const store = useLocalStore(() => createStore(routes), [routes])
  const { Provider } = layoutStoreContext
  return <Provider value={store}>{children(store)}</Provider>
}