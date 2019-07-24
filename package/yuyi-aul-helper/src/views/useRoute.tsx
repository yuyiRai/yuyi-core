import React from 'react';
import Loadable from 'react-loadable';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { useEffect } from 'react';

export interface IRouteCommonProps extends RouteProps {
  path: string;
  exact?: boolean;
  /**
   * @defaultValue switch
   */
  mode?: 'switch' | 'muiltple';
}

export function useRoute(pathToPromise: Loadable.Options<any, any>['loader']) {
  const Loaded = Loadable({
    loader: pathToPromise,
    loading: () => {
      return <span>loading</span>
    }
  });
  return (function (props: IRouteCommonProps) {
    Loaded.preload()
    return (
      <Route {...props}>
        <Route path={props.path} exact component={Loaded} />
        <Switch>
          {props.children}
        </Switch>
      </Route>
    );
  }) as React.FunctionComponent<IRouteCommonProps>;
}

export function useRoute2(Loaded: any) {
  return (function (props: IRouteCommonProps) {
    return (
      <Route {...props}>
        <Route path={props.path} exact component={Loaded} />
        <Switch>
          {props.children}
        </Switch>
      </Route>
    );
  }) as React.FunctionComponent<IRouteCommonProps>;
}