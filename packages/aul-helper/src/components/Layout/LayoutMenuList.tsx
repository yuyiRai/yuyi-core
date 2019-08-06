import * as React from 'react';
import { Icon, Menu } from 'antd';
import { Utils } from '@yuyi/utils'
import { MenuProps, ClickParam } from 'antd/lib/menu';
import { Observer, useObserver, observer } from '@yuyi/night';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { IRouteConfig } from '../../route';
import { layoutStoreContext } from './LayoutStore';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import QueueAnim from 'rc-queue-anim';
import styled from 'styled-components';
import RcQueueAnim from 'rc-queue-anim';

interface IQueueAnimAntMenuProps extends MenuProps {
}

export const QueueAnimAntMenu: React.FunctionComponent<IQueueAnimAntMenuProps> =
  React.forwardRef<RcQueueAnim<IQueueAnimAntMenuProps>>(
    (props, ref) => {
      return <QueueAnim ref={ref} duration={1000} component={Menu} componentProps={props}>{props.children}</QueueAnim>;
    }
  ) as any;


export const LayoutMenuList: React.FunctionComponent<MenuProps> = (props) => {
  const store = React.useContext(layoutStoreContext);
  return useObserver(() => (
    <QueueAnimAntMenu theme='dark' mode="inline" >
      {store.menu.map((item, index) => <MenuChild key={index} {...{ item, index }} />)}
      {props.children}
    </QueueAnimAntMenu>
  ));
};

interface IMenuChildProps extends MenuItemProps {
  item: IRouteConfig;
  index: number;
  parentKey?: string;
}

export const AntMenuNavLink = styled(NavLink)`
  color: inherit;
  &.active {
    color: white;
  }
`
export const useAntMenuNavLink = (isSubmenu: boolean): [(param: ClickParam) => void, React.Ref<HTMLAnchorElement>] => {
  const [linkRef, innerRef] = React.useState(null)
  const ref: any = React.useRef()
  React.useEffect(() => {
    ref.current = linkRef
  })
  const click = React.useCallback((e: ClickParam) => {
    !isSubmenu && ref.current.click()
  }, [ref, isSubmenu])
  return [click as any, innerRef]
}

const MenuChild = React.forwardRef<typeof AntMenuNavLink, IMenuChildProps>(
  ({ item, index, parentKey = 'root', ...props }, ref) => {
    const { key = item.path, icon, path, mode, title, component, children, ...other } = item;
    const hasChildren = Utils.isArrayLike(item.children)
    const isSubmenu = hasChildren
    const [linkClick, innerRef] = useAntMenuNavLink(isSubmenu)
    const itemKey = parentKey ? `${parentKey}-item-${key}` : `item-${key}`
    const isActive = React.useMemo<NavLinkProps['isActive']>(() => ((match, location) => {
      // console.error(match, location, item);
      return match !== null && (
        (!hasChildren && match.url === location.pathname) || hasChildren
      );
    }), [hasChildren]);
    const context = useObserver(() => {
      const linkprops = {
        className: "nav-text"
      }
      return (
        <>
          <Observer>{() => <Icon type={icon || 'menu'} />}</Observer>
          <Observer>{() => (
            <span {...linkprops}>
              {isSubmenu ? title : <AntMenuNavLink
                innerRef={innerRef}
                {...other}
                activeClassName="active"
                isActive={isActive}
                to={path}>
                {title}
              </AntMenuNavLink>}
            </span>
          )}</Observer>
        </>
      )
    });
    return (
      isSubmenu ?
        <QueueAnim
          duration={1000}
          component={Menu.SubMenu}
          key={`${itemKey}-children`}
          componentProps={{
            title: context,
            onTitleClick: () => { },
            ...props
          }}>
          <MenuChild
            ref={ref as any}
            key={`${itemKey}-context`}
            item={{ ...item, children: null }}
            parentKey={itemKey}
            index={0} />
          {
            children.map(
              (item, index) =>
                <MenuChild
                  key={`${itemKey}-child-${index}`}
                  parentKey={itemKey}
                  {...{ item, index: index + 1 }}
                />
            )}
        </QueueAnim> :
        <Menu.Item
          {...props}
          key={itemKey}
          onClick={linkClick} >
          {context}
        </Menu.Item>
    );
  }
);
