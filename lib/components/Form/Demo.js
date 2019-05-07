"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var CommonForm_1 = require("./CommonForm");
var Form_1 = require("./Form");
var button_1 = __importDefault(require("antd/lib/button"));
var antd_1 = require("antd");
var voiceroid = ['1', '2', '3', '4', '5'];
// const voiceroid = ['yukari','maki','zunko','akane','aoi']
var props = {
    model: {
        name: 'yuyi',
        password: '123456', voiceroid: 'a,b',
        info: {
            birthday: '1996-06-30',
            voiceroid: __spread(voiceroid)
        },
    },
    config: [
        { label: '姓名', code: 'name', suffix: React.createElement(antd_1.Icon, { type: 'plus' }), required: function (form) { return form.showVoiceroid !== '1'; }, rule: 'commonCode' },
        { label: '密码', code: 'password' },
        { label: '生日', code: 'info.birthday', value: new Date(), type: "date", rule: 'futureDate' },
        { label: '年龄', code: 'info.birthday2', type: "number" },
        {
            label: '提交时间', code: 'info.submitTime', type: "dateToDate", rule: 'dateToDate30', disabled: function (form, itemConfig) {
                // console.log(form, itemConfig);
                return form.showVoiceroid !== '1';
            }
        },
        { label: 'A', code: 'showVoiceroid', type: "checkOne", value: '1' },
        { label: 'B', code: 'voiceroid', transformer: 'group', type: "search", options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }] },
        { label: 'B', code: 'info.voiceroid', type: "check", options: voiceroid, hidden: function (form) { return form.showVoiceroid !== '1'; } },
        { label: 'C', code: 'info.voiceroid2', type: "radio", options: voiceroid, hidden: function (form) { return form.showVoiceroid !== '1'; } },
        { label: '产品介绍', code: 'info.introduce', type: "textarea", options: voiceroid, hidden: function (form) { return form.showVoiceroid !== '1'; } },
    ]
};
exports.App = function () {
    var _a = __read(React.useState(0), 2), state = _a[0], setstate = _a[1];
    var _b = __read(React.useState(null), 2), store = _b[0], getStore = _b[1];
    return (React.createElement(CommonForm_1.CommonForm, { model: props.model, storeRef: getStore },
        React.createElement(For, { index: 'i', each: "name", of: [1, 2, 3] },
            React.createElement("span", { key: name }, name)),
        React.createElement(Form_1.FormGroup, { key: 0, config: props.config },
            React.createElement(button_1.default, { type: "primary", icon: "search" }, "Search"),
            React.createElement(button_1.default, { onClick: function () {
                    console.log(props);
                    props.config[6].options = __spread(props.config[6].options, ['qqq']);
                    props.config[7].options = __spread(props.config[7].options, ['qqq']);
                    // voiceroid.push('aaa')
                    setstate(state + 1);
                } }, "\u589E\u52A0\u9009\u9879"),
            React.createElement(button_1.default, { onClick: function () {
                    console.log(store);
                    props.config[0].rule = undefined;
                    props.config[2].rule = undefined;
                    // setstate(state+1)
                } }, "\u79FB\u9664\u751F\u65E5\u6821\u9A8C"),
            React.createElement(button_1.default, { onClick: function () {
                    store.validate();
                } }, "\u6821\u9A8C"),
            React.createElement(button_1.default, { onClick: function () {
                    props.model = {};
                    setstate(state + 1);
                } }, "\u8868\u5355\u91CD\u8F7D"))));
};
exports.default = exports.App;
