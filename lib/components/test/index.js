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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var SlotUtils_1 = require("../../utils/SlotUtils");
var AppTest = /** @class */ (function (_super) {
    __extends(AppTest, _super);
    function AppTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            title: 'React Component Test',
            error: false
        };
        _this.onChange = function (e) {
            console.log(e);
            _this.setState({ title: e });
        };
        return _this;
    }
    AppTest.prototype.componentDidCatch = function (error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({ error: true });
    };
    AppTest.prototype.render = function () {
        // const { slots } = this.props;
        var _a = this, Name0 = _a.Name0, Name1 = _a.Name1, Name2 = _a.Name2;
        console.log('React Component Test', this.props);
        if (this.state.error) {
            return React.createElement("span", null, "getError");
        }
        return React.createElement("div", null,
            React.createElement(Name0, { text: this.state.title, onChange: this.onChange }),
            React.createElement(Name1, null),
            React.createElement(Name2, null),
            this.props.children);
    };
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], AppTest.prototype, "Name0", void 0);
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], AppTest.prototype, "Name1", void 0);
    __decorate([
        SlotUtils_1.useSlots,
        __metadata("design:type", Object)
    ], AppTest.prototype, "Name2", void 0);
    AppTest = __decorate([
        SlotUtils_1.slotInjectContainer
    ], AppTest);
    return AppTest;
}(React.Component));
exports.AppTest = AppTest;
exports.ElAppTest = SlotUtils_1.react2Vue(AppTest);
