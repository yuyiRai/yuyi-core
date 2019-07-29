import { AppBar, Box, Container, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Breadcrumb, Icon, Layout } from 'antd';
import { BreadcrumbProps } from 'antd/lib/breadcrumb';
import { LayoutProps, SiderProps } from 'antd/lib/layout';
import { Observer, observer, useAsObservableSource, useObserver } from '@yuyi/night';
import { TweenOneGroup } from 'rc-tween-one';
import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from '../../route';
import { LayoutMenuList } from './LayoutMenuList';
import { LayoutChildren, LayoutStore, layoutStoreContext, useLayoutProvider } from './LayoutStore';
const { Header, Content, Footer, Sider } = Layout;
export type PropsType<T> = T extends React.ComponentClass<infer P, any> ? P : any;

export interface ILayoutProps extends LayoutProps {
  store?: LayoutStore;
  footer?: any;
  head?: any;
  children?: LayoutChildren
}

export const useMainLayout = makeStyles((theme: any) => ({
  layout: {
    marginLeft: (props: any) => `${props.collapsed ? 80 : 200}px`,
    transitionDuration: '0.2s',
    '&:hover': {
      color: 'blue'
    },
    '& $layout-main': {
      color: 'red !important'
    }
  },
  'layout-main': {
    border: '20px'
  },
  'layout-main-header': {
    padding: 0,
    '& .header-collapse-toggle-button': {
      marginLeft: `${theme.spacing(2)}px`
    }
  }
}), { name: 'app' })

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

export const LayoutBreadcrumbs: React.SFC<BreadcrumbProps> = (props) => {
  const { location, ...other } = useRouter()
  console.log(location, other)
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>User</Breadcrumb.Item>
      <Breadcrumb.Item>Bill</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export const LayoutContainer: React.SFC<ILayoutProps> = observer((props) => {
  const [isInit, init] = React.useState(false)
  const { location } = useRouter()
  const classes = useMainLayout(props)
  const store = useAsObservableSource(location)
  // trace()
  const content = React.useMemo(() => (
    <TweenOneGroup enter={{
        translateX: '-100vw', opacity: 0, type: 'from', duration: 500, delay: isInit ? 300 : 0, top: 0,
        onComplete: (e) => {
          e.target.setAttribute('style', '');
          if (!isInit)
            init(true)
        },
      }} leave={{
        opacity: 0, translateX: '100vw', top: 0, duration: 500
      }} appear={true}
    >
      <Box key={store.pathname} >
        <Paper className='layout-content' >
          { props.children }
        </Paper>
      </Box>
    </TweenOneGroup>
    // eslint-disable-next-line
  ), [store.pathname, props.children])
  return useLayoutProvider((store: LayoutStore) => (
    <MainLayout collapsed={store.collapsed}>
      <LayoutSide />
      <LayoutMain className='layout-main'>
        <LayoutHeader>{''}</LayoutHeader>
        <Content style={{ minHeight: '50vh' }}>
          <LayoutBreadcrumbs />
          <Container maxWidth='lg' fixed>
            {content}
          </Container>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{props.footer}</Footer>
      </LayoutMain>
    </MainLayout>
  ))
});

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
        <LayoutMenuList />
        {props.children}
      </Sider>
    )}</Observer>
  )
}

export default Layout; 