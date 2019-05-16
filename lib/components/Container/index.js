import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css.js";
import Breadcrumb from "antd/lib/breadcrumb";
import "antd/lib/breadcrumb/style/css.js";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css.js";
import Layout from "antd/lib/layout";
import "antd/lib/layout/style/css.js";
import React from 'react';
var SubMenu = Menu.SubMenu;
var Header = Layout.Header, Content = Layout.Content, Sider = Layout.Sider;
export function PageContainer(props) {
    return (React.createElement(Layout, null,
        React.createElement(Header, { className: "header" },
            React.createElement("div", { className: "logo" }),
            React.createElement(Menu, { theme: "dark", mode: "horizontal", defaultSelectedKeys: ['2'], style: __$hoisted_o0 },
                React.createElement(Menu.Item, { key: "1" }, "nav 1"),
                React.createElement(Menu.Item, { key: "2" }, "nav 2"),
                React.createElement(Menu.Item, { key: "3" }, "nav 3"))),
        React.createElement(Layout, null,
            React.createElement(Sider, { width: 200, style: __$hoisted_o1 },
                React.createElement(Menu, { mode: "inline", defaultSelectedKeys: ['1'], defaultOpenKeys: ['sub1'], style: __$hoisted_o2 },
                    React.createElement(SubMenu, { key: "sub1", title: React.createElement("span", null,
                            React.createElement(Icon, { type: "user" }),
                            "subnav 1") },
                        React.createElement(Menu.Item, { key: "1" }, "option1"),
                        React.createElement(Menu.Item, { key: "2" }, "option2"),
                        React.createElement(Menu.Item, { key: "3" }, "option3"),
                        React.createElement(Menu.Item, { key: "4" }, "option4")),
                    React.createElement(SubMenu, { key: "sub2", title: React.createElement("span", null,
                            React.createElement(Icon, { type: "laptop" }),
                            "subnav 2") },
                        React.createElement(Menu.Item, { key: "5" }, "option5"),
                        React.createElement(Menu.Item, { key: "6" }, "option6"),
                        React.createElement(Menu.Item, { key: "7" }, "option7"),
                        React.createElement(Menu.Item, { key: "8" }, "option8")),
                    React.createElement(SubMenu, { key: "sub3", title: React.createElement("span", null,
                            React.createElement(Icon, { type: "notification" }),
                            "subnav 3") },
                        React.createElement(Menu.Item, { key: "9" }, "option9"),
                        React.createElement(Menu.Item, { key: "10" }, "option10"),
                        React.createElement(Menu.Item, { key: "11" }, "option11"),
                        React.createElement(Menu.Item, { key: "12" }, "option12")))),
            React.createElement(Layout, { style: __$hoisted_o3 },
                React.createElement(Breadcrumb, { style: __$hoisted_o4 },
                    React.createElement(Breadcrumb.Item, null, "Home"),
                    React.createElement(Breadcrumb.Item, null, "List"),
                    React.createElement(Breadcrumb.Item, null, "App")),
                React.createElement(Content, { style: __$hoisted_o5 }, props.children)))));
}
var __$hoisted_o0 = { lineHeight: '64px' };
var __$hoisted_o1 = { background: '#fff' };
var __$hoisted_o2 = { height: '100%', borderRight: 0 };
var __$hoisted_o3 = { padding: '0 24px 24px' };
var __$hoisted_o4 = { margin: '16px 0' };
var __$hoisted_o5 = {
    background: '#fff', padding: 24, margin: 0, minHeight: 280,
};
//# sourceMappingURL=index.js.map