import { __decorate, __metadata } from "tslib";
import { __decorate_all } from "@yuyi919/ts-transformer-awesome/tslib-extra";
import { observable, computed, action, autorun } from 'mobx';
import autobind from "core-decorators/es/autobind";
import readonly from "core-decorators/es/readonly";
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this._$$app = 0;
        this.app3 = '';
        autorun(function () { console.log(_this._$$app); });
    }
    Object.defineProperty(App.prototype, "app2", {
        get: function () { return this._$$app + 2; },
        enumerable: true,
        configurable: true
    });
    // @autobind
    App.prototype.setApp = function (v) { this._$$app = v; };
    App.prototype.setApp2 = function (v) { };
    App = __decorate([
        __decorate_all({ _$$app: [[observable, readonly]], app3: [[observable.ref]], app2: [[computed], 0], setApp: [[action], 0], setApp2: [[action], 0] }),
        __metadata("design:paramtypes", [])
    ], App);
    return App;
}());
export { App };
Object.defineProperty(App, 'app', {});
var TApp = /** @class */ (function () {
    function TApp() {
        this.app = 0;
    }
    TApp = __decorate([
        __decorate_all({ app: [[observable]] })
    ], TApp);
    return TApp;
}());
export { TApp };
export function ccc() {
    var App2 = /** @class */ (function () {
        function App2() {
            this.app = '';
            this.app3 = '';
        }
        Object.defineProperty(App2.prototype, "app2", {
            get: function () { return this.app + 2; },
            enumerable: true,
            configurable: true
        });
        App2.prototype.setApp = function () { this.app = ''; };
        App2 = __decorate([
            __decorate_all({ app: [[observable]], app3: [[observable.ref]], app2: [[computed], 0], setApp: [[action], 0] })
        ], App2);
        return App2;
    }());
    return App2;
}
var app = new App();
app.setApp(2);
console.log(app.app2);
//# sourceMappingURL=index.js.map