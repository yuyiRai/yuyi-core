import * as React from 'react';
import { StaticContext, __RouterContext } from 'react-router';
import { RouteComponentProps, Switch } from 'react-router-dom';
import { IRouteCommonProps, useRoute } from '../views/useRoute';
import { Routes } from './Routes';
import { useLocalStore, useObserver } from '@yuyi/night';
import { observable } from 'mobx';


export interface IRouteConfig extends IRouteCommonProps {
  key?: string;
  title: string;
  icon?: any;
  path: string;
  component: ReturnType<typeof useRoute>;
  children?: IRouteConfig[];
}

export interface IRootRouteProps extends Pick<RouteComponentProps<any, StaticContext, any>, any> {
  container: any;
}

export function useRouter() {
  return React.useContext(__RouterContext)
}
export type RouterContext = React.ContextType<typeof __RouterContext>

export const RootRoute: React.SFC<IRootRouteProps> = ((props: IRootRouteProps) => {
  const routes = useLocalStore(() => observable.box(Routes, { name: 'Routes' }), [])
  const context = useRouter()
  const { container: Container } = props
  return useObserver(() => (
    <Container>
      <RoutesList location={context.location} routes={routes.get()}/>
    </Container>
  ));
}) as any;

export const RoutesList = React.memo((({ routes, location }: { routes: IRouteConfig[]; location: RouterContext['location'] }) => {
  return <Switch location={location}>{
    routes.map(
      ({ component: Component, path, exact, children = [] }) => {
        // const routes = useRoutes(children)
        return (
          location.pathname === path && <Component key={path} path={path} exact={exact}>
            <RoutesList routes={children} />
          </Component>
        )
      }
    )
  }</Switch>
}) as React.FunctionComponent<any>)