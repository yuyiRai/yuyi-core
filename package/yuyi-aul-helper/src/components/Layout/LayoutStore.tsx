import * as React from 'react';
import { AppRoutesContext } from '../../route/Routes';
import { useLocalStore } from 'mobx-react-lite';
import { ILayoutProps } from '.';
import { IRouteConfig } from '../../route';

export function createStore(routes: IRouteConfig[]) {
  const store = {
    collapsed: false,
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    menu: [...routes],
    routes: [...routes]
  };
  return store;
}
export type LayoutStore = ReturnType<typeof createStore>;
export type LayoutChildren = React.Context<LayoutStore>['Consumer']['prototype']['props']['children']

export const layoutStoreContext = React.createContext<LayoutStore>(null as any)

export const LayoutProvider: React.FunctionComponent<ILayoutProps> = (props) => {
  const routes = React.useContext(AppRoutesContext)
  const store = useLocalStore(() => createStore(routes))
  const { Provider, Consumer } = layoutStoreContext
  return <Provider value={store}><Consumer>{props.children}</Consumer></Provider>
}