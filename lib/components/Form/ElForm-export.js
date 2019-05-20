var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { react2Vue, slotInjectContainer, useSlots } from "../../utils/SlotUtils";
import { autobind } from 'core-decorators';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Vue from 'vue';
import { CommonForm } from './CommonForm';
import { FormGroup } from './Form';
import { FormStore } from './FormStore';
var GlobalStyle = createGlobalStyle(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-select-dropdown {\n    z-index: 2050 !important;\n  }\n"], ["\n  .ant-select-dropdown {\n    z-index: 2050 !important;\n  }\n"])));
var RItemGroup = /** @class */ (function (_super) {
    __extends(RItemGroup, _super);
    function RItemGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RItemGroup.prototype.render = function () {
        console.log('ElItemGroup', this);
        return React.createElement(FormGroup, __assign({}, this.props, { config: this.props.config }));
    };
    __decorate([
        useSlots,
        __metadata("design:type", Object)
    ], RItemGroup.prototype, "App", void 0);
    RItemGroup = __decorate([
        slotInjectContainer
    ], RItemGroup);
    return RItemGroup;
}(React.Component));
export { RItemGroup };
export var ElItemGroup = react2Vue(RItemGroup);
var RCommonForm = /** @class */ (function (_super) {
    __extends(RCommonForm, _super);
    function RCommonForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RCommonForm.prototype.render = function () {
        console.log('ElCommonForm', this);
        return React.createElement(CommonForm, __assign({}, this.props, { model: this.props.model }));
    };
    __decorate([
        useSlots,
        __metadata("design:type", Object)
    ], RCommonForm.prototype, "App", void 0);
    RCommonForm = __decorate([
        slotInjectContainer
    ], RCommonForm);
    return RCommonForm;
}(React.Component));
export { RCommonForm };
export var ElCommonForm = react2Vue(RCommonForm);
window.logger = [];
var logger = window.logger;
var RCommonForm2 = /** @class */ (function (_super) {
    __extends(RCommonForm2, _super);
    function RCommonForm2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            model: {},
            lastModel: {},
            lastConfig: {},
            config: null
        };
        return _this;
    }
    // constructor(props: any) {
    //   super(props)
    //   logger.push('getDerivedStateFromProps chgange0');
    //   this.state = RCommonForm2.getDerivedStateFromProps(props, this.state)
    // }
    RCommonForm2.getDerivedStateFromProps = function (nextProps, prevState) {
        var update = false;
        // debugger
        if (prevState.lastModel !== nextProps.model) {
            logger.push('getDerivedStateFromProps chgange1');
            prevState.model = Utils.cloneDeep(nextProps.model);
            prevState.lastModel = nextProps.model;
            update = true;
        }
        if (prevState.lastConfig !== nextProps.config) {
            logger.push('getDerivedStateFromProps chgange2');
            // if(!prevState.config)
            prevState.config = Utils.cloneDeep(nextProps.config);
            prevState.lastConfig = nextProps.config;
            update = true;
        }
        return update ? prevState : null;
    };
    RCommonForm2.prototype.onChange = function (code, value) {
        Vue.prototype.$set(this.props.model, code, value);
        console.log('onChange', code, value, this);
    };
    RCommonForm2.prototype.getStoreRef = function (store) {
        if (this.props.storeRef) {
            this.props.storeRef(store);
        }
        this.store = store;
    };
    RCommonForm2.prototype.render = function () {
        var Inter = this.Inter;
        var _a = this.state, model = _a.model, config = _a.config;
        var _b = this.props, children = _b.children, a = _b.config, slots = _b.slots, scopedSlots = _b.scopedSlots, other = __rest(_b, ["children", "config", "slots", "scopedSlots"]);
        console.log('ElCommonForm2', this.context, Inter);
        return (React.createElement("span", null,
            React.createElement(GlobalStyle, null),
            Utils.isNotEmptyArray(config) &&
                React.createElement(CommonForm, __assign({}, other, { model: model, onItemChange: this.onChange, storeRef: this.getStoreRef }),
                    React.createElement(FormGroup, { config: config }, children))));
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], RCommonForm2.prototype, "onChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [FormStore]),
        __metadata("design:returntype", void 0)
    ], RCommonForm2.prototype, "getStoreRef", null);
    __decorate([
        useSlots,
        __metadata("design:type", Object)
    ], RCommonForm2.prototype, "Inter", void 0);
    RCommonForm2 = __decorate([
        slotInjectContainer
    ], RCommonForm2);
    return RCommonForm2;
}(React.PureComponent));
export { RCommonForm2 };
export var ElCommonForm2 = react2Vue(RCommonForm2);
var templateObject_1;
//# sourceMappingURL=ElForm-export.js.map