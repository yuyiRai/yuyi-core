"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SlotUtils_1 = require("../../utils/SlotUtils");
var Form_1 = require("./Form");
var CommonForm_1 = require("./CommonForm");
var react_1 = __importDefault(require("react"));
var core_decorators_1 = require("core-decorators");
var FormStore_1 = require("./FormStore");
var RItemGroup = /** @class */ (function (_super) {
    __extends(RItemGroup, _super);
    function RItemGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RItemGroup.prototype.render = function () {
        console.log('ElItemGroup', this);
        return react_1.default.createElement(Form_1.FormGroup, __assign({}, this.props, { config: this.props.config }));
    };
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], RItemGroup.prototype, "App", void 0);
    RItemGroup = __decorate([
        SlotUtils_1.slotInjectContainer
    ], RItemGroup);
    return RItemGroup;
}(react_1.default.Component));
exports.RItemGroup = RItemGroup;
exports.ElItemGroup = SlotUtils_1.react2Vue(RItemGroup);
var RCommonForm = /** @class */ (function (_super) {
    __extends(RCommonForm, _super);
    function RCommonForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RCommonForm.prototype.render = function () {
        console.log('ElCommonForm', this);
        return react_1.default.createElement(CommonForm_1.CommonForm, __assign({}, this.props, { model: this.props.model }));
    };
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], RCommonForm.prototype, "App", void 0);
    RCommonForm = __decorate([
        SlotUtils_1.slotInjectContainer
    ], RCommonForm);
    return RCommonForm;
}(react_1.default.Component));
exports.RCommonForm = RCommonForm;
exports.ElCommonForm = SlotUtils_1.react2Vue(RCommonForm);
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
            config: []
        };
        return _this;
    }
    // constructor(props: any) {
    //   super(props)
    //   logger.push('getDerivedStateFromProps chgange0');
    //   this.state = RCommonForm2.getDerivedStateFromProps(props, this.state)
    // }
    RCommonForm2.getDerivedStateFromProps = function (nextProps, prevState) {
        if (prevState.lastModel !== nextProps.model) {
            logger.push('getDerivedStateFromProps chgange1');
            prevState.model = Utils.cloneDeep(nextProps.model);
            prevState.lastModel = nextProps.model;
        }
        if (prevState.lastConfig !== nextProps.config) {
            logger.push('getDerivedStateFromProps chgange2');
            prevState.config = Utils.cloneDeep(nextProps.config);
            prevState.lastConfig = nextProps.config;
        }
        return prevState;
    };
    RCommonForm2.prototype.onChange = function (code, value) {
        console.log(code, value);
    };
    RCommonForm2.prototype.getStoreRef = function (store) {
        if (this.props.storeRef) {
            this.props.storeRef(store);
        }
    };
    RCommonForm2.prototype.render = function () {
        var model = this.state.model;
        var _a = this.props, children = _a.children, config = _a.config, other = __rest(_a, ["children", "config"]);
        console.log('ElCommonForm2', this);
        return (react_1.default.createElement(CommonForm_1.CommonForm, __assign({}, other, { model: model, onItemChange: this.onChange, storeRef: this.getStoreRef }),
            react_1.default.createElement(Form_1.FormGroup, { config: config }, children)));
    };
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], RCommonForm2.prototype, "App", void 0);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], RCommonForm2.prototype, "onChange", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [FormStore_1.FormStore]),
        __metadata("design:returntype", void 0)
    ], RCommonForm2.prototype, "getStoreRef", null);
    RCommonForm2 = __decorate([
        SlotUtils_1.slotInjectContainer
    ], RCommonForm2);
    return RCommonForm2;
}(react_1.default.PureComponent));
exports.RCommonForm2 = RCommonForm2;
exports.ElCommonForm2 = SlotUtils_1.react2Vue(RCommonForm2);
