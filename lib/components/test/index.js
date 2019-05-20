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
import * as React from 'react';
import { slotInjectContainer, react2Vue } from '../../utils/SlotUtils';
var AppTest = /** @class */ (function (_super) {
    __extends(AppTest, _super);
    function AppTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            title: 'React Component Test',
            error: false
        };
        // @useSlots Name0: IReactComponent<any>;
        // @useSlots Name1: IReactComponent<any>;
        // @useSlots Name2: IReactComponent<any>;
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
        return null;
        // const { slots } = this.props;
        // const { Name0, Name1, Name2 } = this
        // console.log('React Component Test', this.props)
        // if(this.state.error) {
        //   return <span>getError</span>
        // }
        // return <div><Name0 text={this.state.title} onChange={this.onChange}/><Name1 /><Name2 />{this.props.children}</div>
    };
    AppTest = __decorate([
        slotInjectContainer
    ], AppTest);
    return AppTest;
}(React.Component));
export { AppTest };
export var ElAppTest = react2Vue(AppTest);
//# sourceMappingURL=index.js.map