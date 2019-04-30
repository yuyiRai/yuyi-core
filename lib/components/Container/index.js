"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var antd_1 = require("antd");
var antd_2 = require("antd");
var antd_3 = require("antd");
var antd_4 = require("antd");
var react_1 = __importDefault(require("react"));
var SubMenu = antd_3.Menu.SubMenu;
var Header = antd_4.Layout.Header, Content = antd_4.Layout.Content, Sider = antd_4.Layout.Sider;
function PageContainer(props) {
    return (react_1.default.createElement(antd_4.Layout, null,
        react_1.default.createElement(Header, { className: "header" },
            react_1.default.createElement("div", { className: "logo" }),
            react_1.default.createElement(antd_3.Menu, { theme: "dark", mode: "horizontal", defaultSelectedKeys: ['2'], style: { lineHeight: '64px' } },
                react_1.default.createElement(antd_3.Menu.Item, { key: "1" }, "nav 1"),
                react_1.default.createElement(antd_3.Menu.Item, { key: "2" }, "nav 2"),
                react_1.default.createElement(antd_3.Menu.Item, { key: "3" }, "nav 3"))),
        react_1.default.createElement(antd_4.Layout, null,
            react_1.default.createElement(Sider, { width: 200, style: { background: '#fff' } },
                react_1.default.createElement(antd_3.Menu, { mode: "inline", defaultSelectedKeys: ['1'], defaultOpenKeys: ['sub1'], style: { height: '100%', borderRight: 0 } },
                    react_1.default.createElement(SubMenu, { key: "sub1", title: react_1.default.createElement("span", null,
                            react_1.default.createElement(antd_1.Icon, { type: "user" }),
                            "subnav 1") },
                        react_1.default.createElement(antd_3.Menu.Item, { key: "1" }, "option1"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "2" }, "option2"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "3" }, "option3"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "4" }, "option4")),
                    react_1.default.createElement(SubMenu, { key: "sub2", title: react_1.default.createElement("span", null,
                            react_1.default.createElement(antd_1.Icon, { type: "laptop" }),
                            "subnav 2") },
                        react_1.default.createElement(antd_3.Menu.Item, { key: "5" }, "option5"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "6" }, "option6"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "7" }, "option7"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "8" }, "option8")),
                    react_1.default.createElement(SubMenu, { key: "sub3", title: react_1.default.createElement("span", null,
                            react_1.default.createElement(antd_1.Icon, { type: "notification" }),
                            "subnav 3") },
                        react_1.default.createElement(antd_3.Menu.Item, { key: "9" }, "option9"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "10" }, "option10"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "11" }, "option11"),
                        react_1.default.createElement(antd_3.Menu.Item, { key: "12" }, "option12")))),
            react_1.default.createElement(antd_4.Layout, { style: { padding: '0 24px 24px' } },
                react_1.default.createElement(antd_2.Breadcrumb, { style: { margin: '16px 0' } },
                    react_1.default.createElement(antd_2.Breadcrumb.Item, null, "Home"),
                    react_1.default.createElement(antd_2.Breadcrumb.Item, null, "List"),
                    react_1.default.createElement(antd_2.Breadcrumb.Item, null, "App")),
                react_1.default.createElement(Content, { style: {
                        background: '#fff', padding: 24, margin: 0, minHeight: 280,
                    } }, props.children)))));
}
exports.PageContainer = PageContainer;
