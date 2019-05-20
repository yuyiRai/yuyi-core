var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
import { Utils } from '../../utils';
import { computed, observable, action, reaction, autorun } from 'mobx';
import { autobind } from 'core-decorators';
var ListStore = /** @class */ (function () {
    function ListStore() {
        var _this = this;
        this.list = observable.array([], { name: 'oringle list', deep: true });
        this.model = {};
        this.watch = function (model) {
            if (model === void 0) { model = _this.model; }
            return model[123];
        };
        Utils.observe(this.model, console.log);
        this.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        reaction(function () { return _this.list.length; }, function (length) {
            console.log('change', length);
        });
        Utils.observe(this.list, function (list) {
            console.log('change', list);
        });
        autorun(this.onAutoRun);
    }
    Object.defineProperty(ListStore.prototype, "displayList", {
        get: function () {
            var e_1, _a;
            var list = [];
            try {
                for (var _b = __values(this.list), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var i = _c.value;
                    list.push({ a: i });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListStore.prototype, "first", {
        get: function () {
            console.log('get first');
            return this.displayList[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListStore.prototype, "second", {
        get: function () {
            return this.displayList[1];
        },
        enumerable: true,
        configurable: true
    });
    ListStore.prototype.push = function () {
        var _a;
        var i = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            i[_i] = arguments[_i];
        }
        (_a = this.list).push.apply(_a, __spread(i.map(function (i) { return ({ i: i }); })));
    };
    ListStore.prototype.onAutoRun = function (r) {
        console.log('change', r, this.list);
    };
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ListStore.prototype, "list", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ListStore.prototype, "model", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ListStore.prototype, "displayList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ListStore.prototype, "first", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ListStore.prototype, "second", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ListStore.prototype, "push", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ListStore.prototype, "onAutoRun", null);
    return ListStore;
}());
export { ListStore };
window.AppStore = ListStore;
window.appstore = new ListStore();
describe('mobx-text', function () {
    it('array test', function () {
        var list = new ListStore();
        var i = list.first;
        var func = jest.fn(list.onAutoRun);
        console.log(i);
        list.push(11);
        expect(func).toBeCalled();
    });
});
//# sourceMappingURL=mobx.test.js.map