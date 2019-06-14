import { AppBar, Container, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Breadcrumb, Icon, Layout, Menu } from 'antd';
import { LayoutProps, SiderProps } from 'antd/lib/layout';
import { MenuProps } from 'antd/lib/menu';
import { Observer, useComputed, useLocalStore, useObserver } from 'mobx-react-lite';
import * as React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { createStore, LayoutChildren, LayoutStore, layoutStoreContext, LayoutProvider } from './Layout/LayoutStore';
import { IRouteConfig } from '../route';
import { Link, NavLink } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;

export type PropsType<T> = T extends React.ComponentClass<infer P, any> ? P : any;

export interface ILayoutProps extends LayoutProps {
  store?: LayoutStore;
  footer?: any;
  head?: any;
  children?: LayoutChildren
}



const PreLayout = ({ collapsed, ...props }: any) => <Layout {...props} />
export const MainLayout = styled(PreLayout).attrs((attrs) => {
  console.log(attrs)
  return attrs
})`
  & > .layout-main {
    margin-left: ${(props) => props.collapsed ? 80 : 200}px;
    transition-duration: 0.2s;
    & .layout-main-header {
      padding: 0;
      & .header-collapse-toggle-button {
        margin-left: ${props => props.theme.spacing(2)}px;
      }
    }
    & .ant-layout-content {
      margin: ${props => props.theme.spacing(0, 5, 0, 10)};
      overflow: initial;
    }
    & .layout-content {
      background: white;
      padding: ${props => props.theme.spacing(3, 2)};
      margin: ${props => props.theme.spacing(3, 1)};
    }
  }
  
  & .nav-text {
    display: inline;
  }
`

export const LayoutBreadcrumbs = withRouter((props) => {
  props.history.listen(console.log)
  console.log(props)
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>User</Breadcrumb.Item>
      <Breadcrumb.Item>Bill</Breadcrumb.Item>
    </Breadcrumb>
  )
})

export const LayoutContainer: React.FunctionComponent<ILayoutProps> = (props) => {
  return (
    <LayoutProvider>{
      (store: LayoutStore) => (
        <MainLayout collapsed={store.collapsed}>
          <LayoutSide />
          <LayoutMain className='layout-main'>
            <LayoutHeader>{''}</LayoutHeader>
            <Content>
              <LayoutBreadcrumbs />
              <Container maxWidth='lg' fixed>
                <Paper className='layout-content'>
                  {props.children}
                </Paper>
              </Container>
            </Content>
            <Footer style={{ textAlign: 'center' }}>{props.footer}</Footer>
          </LayoutMain>
        </MainLayout>
      )
    }</LayoutProvider>
  )
};

export const LayoutHeader: React.FunctionComponent<LayoutProps> = (props) => {
  const store = React.useContext(layoutStoreContext)
  return (
    <Header className='layout-main-header'>
      <AppBar position='static'>
        <Toolbar title="">
          <Typography>
            <Observer>{() => (
              <IconButton onClick={store.toggleCollapsed} color='inherit' className='header-collapse-toggle-button'>
                <Icon type={store.collapsed ? 'menu-unfold' : 'menu-fold'} />
              </IconButton>
            )}</Observer>
            {props.children}
          </Typography>
        </Toolbar>
      </AppBar>
    </Header>
  )
}

export const LayoutMain: React.FunctionComponent<LayoutProps> = (props) => {
  const store = React.useContext(layoutStoreContext)
  return useObserver(() => (
    <Layout {...props} style={{ marginLeft: store.collapsed ? 80 : 200 }}>
      <Observer>{() => props.children as any}</Observer>
    </Layout>
  ))
}

const { SubMenu } = Menu;

export const LayoutSide: React.FunctionComponent<SiderProps> = (props) => {
  const store = React.useContext(layoutStoreContext)
  return (
    <Observer>{() => (
      <Sider
        collapsible
        collapsed={store.collapsed}
        breakpoint='sm'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        onCollapse={store.toggleCollapsed}
      >
        <div>

        </div>
        <LayoutMenuList>
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Option 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </LayoutMenuList>
        {props.children}
      </Sider>
    )}</Observer>
  )
}


function mapToMenuChild(item: IRouteConfig, index: number) {
  return (
    <Menu.Item key={index}>
      <Observer>{()=><Icon type={item.key || item.icon} />}</Observer>
      <Observer>{()=><NavLink to={item.path} className="nav-text">{item.title}</NavLink>}</Observer>
    </Menu.Item>
  )
}

export const LayoutMenuList: React.FunctionComponent<MenuProps> = (props) => {
  const store = React.useContext(layoutStoreContext)
  return useObserver(() => (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
      {store.menu.map(mapToMenuChild)}
      {props.children}
    </Menu>
  ))
}

export default Layout; 