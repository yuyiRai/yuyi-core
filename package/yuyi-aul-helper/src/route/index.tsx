import * as React from 'react';
import { withRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { IRouteCommonProps, useRoute } from '../views/useRoute';
import { Routes } from './Routes';
import { StaticContext } from 'react-router';


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

export const RootRoute: React.ComponentClass<IRootRouteProps, any> = withRouter(((props: IRootRouteProps) => {
  const [routes] = React.useState(Routes)
  const { container: Container } = props
  return (
    <Container>
      <RoutesList routes={routes} location={props.location} />
    </Container>
  );
}) as any) as any;

export const RoutesList = React.memo((({ routes, location }: { routes: IRouteConfig[], location: any }) => {
  return <Switch location={location}>{
    routes.map(
      ({ component: Component, path, exact, children = [] }) => {
        // const routes = useRoutes(children)
        return (
          <Component key={path} path={path} exact={exact}>
            <RoutesList routes={children} />
          </Component>
        )
      }
    )
  }</Switch>
}) as React.FunctionComponent<any>)