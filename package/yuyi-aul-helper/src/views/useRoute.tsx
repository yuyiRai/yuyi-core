import React from 'react';
import Loadable from 'react-loadable';
import { Route, RouteProps, Switch } from 'react-router-dom';

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
    loading: () => <span></span>
  });
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
