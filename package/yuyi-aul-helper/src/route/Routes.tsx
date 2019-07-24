import * as React from 'react';
import { DragUpload, ExaManagerRoute, Index, DemoRoute } from '../views';
import { IRouteConfig } from './index';

export const Routes: IRouteConfig[] = [
  {
    title: 'index',
    path: '/',
    exact: true,
    component: Index
  },
  {
    title: 'ExaManager',
    path: '/app',
    component: ExaManagerRoute,
    children: [
      {
        title: 'DragUpload',
        path: '/app/upload',
        component: DragUpload
      }
    ]
  },
  {
    title: 'Demo',
    path: '/demo',
    component: DemoRoute
  },
  {
    title: 'DragUpload',
    path: '/app2/upload',
    component: DragUpload
  }
];
export const AppRoutesContext = React.createContext(Routes);
