var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import * as React from 'react';
import { CommonForm } from './CommonForm';
import { FormGroup } from './Form';
import Button from 'antd/lib/button';
import { AMapService } from "../../stores";
AMapService.setKey("70a802cd733e9a9a96bedd0ae23f19a2");
var voiceroid = ['1', '2', '3', '4', '5'];
// const voiceroid = ['yukari','maki','zunko','akane','aoi']
var options = [
    { label: 'A', value: 'a', code: 'AAA' },
    { label: 'B', value: 'b', code: 'AAA' },
    { label: 'C', value: 'c', code: 'AAA' },
    { label: 'C1', value: 'c1', code: 'AAA' },
    { label: 'A1', value: 'a1', code: 'AAA' },
    { label: 'B1', value: 'b1', code: 'AAA' }
];
var treeOptions = [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                        value: 'xihu',
                        label: 'West Lake',
                        code: 752100,
                    }],
            }],
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                        code: 453400,
                    }],
            }],
    }];
var model = {
    name: 'yuyi',
    password: '123456', search2: 'a,b', search: 'b',
    info: {
        birthday: '1996-06-30',
        voiceroid: __spread(voiceroid),
        trree: 'zhejiang,hangzhou,xihu'
    },
    addressGroup: {
        address: '上海市'
    },
    info2: {
        trree: "xihu"
    },
    showVoiceroid: undefined
};
var amap = new AMapService();
var config = [
    { label: '姓名', code: 'name', required: function (form) { return form.showVoiceroid !== '1'; }, rule: 'commonCode' },
    { label: '密码', code: 'password' },
    { label: '生日', code: 'info.birthday', value: new Date(), type: "date", rule: 'futureDate' },
    { label: '年龄', code: 'info.birthday2', type: "number", computed: function (form) {
            // console.log('info.birthday' , )
            return new Date(form.info.birthday).getFullYear() + form.password;
        } },
    {
        label: '提交时间', code: 'info.submitTime', type: "dateToDate", rule: 'dateToDate30', disabled: function (form, itemConfig) {
            // console.log(form, itemConfig);
            return form.showVoiceroid !== '1';
        }
    },
    { label: 'A', code: 'showVoiceroid', type: "checkOne", value: '1' },
    { label: '单选', code: 'search', type: "select", multiple: true, options: options, nameCode: 'searchName' },
    { label: '多选', code: 'search2', type: "search", nameCode: 'search2Name', multiple: true,
        getOptionsLabel: function (_a) {
            var item = _a.item;
            return item.name + " " + ([item.address].join("/") ? "(" + [item.address].join("/") + ")" : "");
        },
        remoteMethod: function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var locationData, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!key) return [3 /*break*/, 4];
                            console.log(key);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, amap.getAutoComplete({ city: '全国', search: key })];
                        case 2:
                            locationData = _a.sent();
                            return [2 /*return*/, locationData.filter(function (item) { return item.location; }).map(function (locationData) {
                                    var name = locationData.name, id = locationData.id, district = locationData.district;
                                    return {
                                        label: name,
                                        value: name + "(" + district + ")",
                                        key: id,
                                        item: locationData
                                    };
                                })];
                        case 3:
                            e_1 = _a.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/, []];
                    }
                });
            });
        }
    },
    {
        label: '地址', code: 'addressGroup', type: 'group', col: 1, children: {
            trree3: { col: 1,
                label: '产品c2', code: 'trree3', transformer: 'path', type: "cascader", loadData: function (key, currentOptions) {
                    console.log('loadData', key, currentOptions);
                    return Utils.waitingPromise(1000, key ? options.map(function (opt) { return (__assign({}, opt, { value: [key.value, opt.value].join('.') })); }) : options);
                }
            },
            address: { col: 2,
                label: '地址查询', code: 'address', type: "search", nameCode: 'addressName',
                remoteMethod: function (key) {
                    return __awaiter(this, void 0, void 0, function () {
                        var locationData, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!key) return [3 /*break*/, 4];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, amap.getAutoComplete({ city: '全国', search: key })];
                                case 2:
                                    locationData = _a.sent();
                                    return [2 /*return*/, locationData.filter(function (item) { return item.location; }).map(function (locationData) {
                                            var name = locationData.name;
                                            return {
                                                label: name,
                                                value: name,
                                                item: locationData
                                            };
                                        })];
                                case 3:
                                    e_2 = _a.sent();
                                    return [2 /*return*/, []];
                                case 4: return [2 /*return*/, []];
                            }
                        });
                    });
                }
            }
        }
    },
    { label: 'B', code: 'info.voiceroid', type: "check", options: voiceroid, hidden: function (form) { return form.showVoiceroid !== '1'; } },
    { label: 'C', code: 'info.voiceroid2', type: "radio", options: voiceroid, hidden: function (form) { return form.showVoiceroid !== '1'; } },
    // { label: '产品介绍', code: 'info.introduce', type: "textarea", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
    { label: '产品c', code: 'info.trree', transformer: 'path', type: "cascader", options: treeOptions },
    { label: '产品c2', code: 'info2.trree', type: "selectTree", loadData: function (key, currentOptions) {
            console.log('loadData', key, options);
            return Utils.waitingPromise(1000, key ? treeOptions.map(function (opt) { return (__assign({}, opt, { value: [key.value, opt.value].join('.') })); }) : treeOptions);
        } }
];
var props = {
    model: model,
    config: config
};
export var App = function () {
    var _a = __read(React.useState(0), 2), state = _a[0], setstate = _a[1];
    var _b = __read(React.useState(null), 2), store = _b[0], getStore = _b[1];
    return (React.createElement(CommonForm, { model: props.model, storeRef: getStore },
        Array.from(([1, 2, 3]), function (name, i) { return React.createElement("span", { key: name }, name); }),
        React.createElement(FormGroup, { key: 0, config: props.config, disabled: true },
            React.createElement(Button, { type: "primary", icon: "search" }, "Search"),
            React.createElement(Button, { onClick: function () {
                    console.log(props, config);
                    // debugger
                    props.config[9].options = __spread(props.config[9].options, ['qqq']);
                    props.config[10].options = __spread(props.config[10].options, ['qqq']);
                    // voiceroid.push('aaa')
                    setstate(state + 1);
                } }, "\u589E\u52A0\u9009\u9879"),
            React.createElement(Button, { onClick: function () {
                    console.log(store);
                    props.config[0].rule = undefined;
                    props.config[2].rule = undefined;
                    // setstate(state+1)
                } }, "\u79FB\u9664\u751F\u65E5\u6821\u9A8C"),
            React.createElement(Button, { onClick: function () {
                    store.validate();
                    console.log(props, store.formSource);
                } }, "\u6821\u9A8C"),
            React.createElement(Button, { onClick: function () {
                    props.model = {};
                    setstate(state + 1);
                } }, "\u8868\u5355\u91CD\u8F7D"))));
};
export default App;
//# sourceMappingURL=Demo.js.map