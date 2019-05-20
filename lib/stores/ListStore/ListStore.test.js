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
var _this = this;
import { List } from "./ListStore";
import { Utils } from "../../utils";
describe("mobx array-test", function () {
    var list = new List([], null, true);
    beforeEach(function (fn) {
        // console.log('each')
        // list = new List([], null, true)
        list.registerOnArrayChange(jest.fn());
        fn();
    });
    it("push", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("push start");
            expect(list.watcherLength).toBe(0);
            list.push({ i: 0 });
            expect(list.watcherLength).toBe(1);
            list.push({ i: 1 });
            expect(list.onArrayChange).toBeCalledTimes(2);
            expect(list.watcherLength).toBe(2);
            return [2 /*return*/];
        });
    }); });
    it("set", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("set start");
            expect(list.watcherLength).toBe(2);
            list.set(3, { i: 0 });
            expect(list.watcherLength).toBe(4);
            expect(list.onArrayChange).toBeCalledTimes(1);
            return [2 /*return*/];
        });
    }); });
    it("pop", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // console.log("set start");
            expect(list.watcherLength).toBe(4);
            list.pop();
            expect(list.watcherLength).toBe(3);
            expect(list.onArrayChange).toBeCalledTimes(1);
            return [2 /*return*/];
        });
    }); });
    it("set by immer mode", function () { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            expect(list.watcherLength).toBe(3);
            r = list.set(2, function (i) {
                return Object.assign({}, i, { i: 2 });
            });
            expect(list.watcherLength).toBe(3);
            expect(list.onArrayChange).toBeCalledTimes(1);
            expect(r).toEqual({ i: 2 });
            return [2 /*return*/];
        });
    }); });
    it("get, inner set(not reaction)", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            list.getOriginal(3, { i: 0 }).i = 3;
            expect(list.onArrayChange).toBeCalledTimes(0);
            expect(list.watcherLength).toBe(3);
            return [2 /*return*/];
        });
    }); });
    it("get, inner set(has reaction)", function () { return __awaiter(_this, void 0, void 0, function () {
        var first, last;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    first = list.first;
                    last = list.last;
                    list.getOriginal(3, { i: 0 }, true).i = 3;
                    return [4 /*yield*/, Utils.waitingPromise(0, 0)];
                case 1:
                    _a.sent();
                    expect(list.watcherLength).toBe(4);
                    expect(list.onArrayChange).toBeCalledTimes(2);
                    expect(list.first).toBe(first);
                    expect(list.last).not.toBe(last);
                    // console.log(list.first, list.last);
                    return [2 /*return*/];
            }
        });
    }); });
    it("get, equals", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("set equals");
            expect(list.first).toBe(list.first);
            return [2 /*return*/];
        });
    }); });
    it("all test", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            list.push({ b: { a: 1 } });
            list.set(4, function (item) {
                item.b.a = 5;
                return item;
            });
            list.set(10, { i: 10 });
            expect(list.transformList.length).toMatchInlineSnapshot("11");
            list.pop();
            expect(list.transformList.length).toMatchInlineSnapshot("10");
            list.pop();
            list.set(5, { i: 5 });
            expect(list.getOriginalValue(2)).toMatchInlineSnapshot("\n      Object {\n        \"i\": 2,\n      }\n    ");
            expect(list.watcherLength).toMatchInlineSnapshot("9");
            expect(list.transformList.length).toMatchInlineSnapshot("9");
            expect(list.transformList).toMatchInlineSnapshot("\n      Array [\n        Object {\n          \"i\": 0,\n        },\n        Object {\n          \"i\": 1,\n        },\n        Object {\n          \"i\": 2,\n        },\n        Object {\n          \"i\": 3,\n        },\n        Object {\n          \"b\": Object {\n            \"a\": 5,\n          },\n        },\n        Object {\n          \"i\": 5,\n        },\n        undefined,\n        undefined,\n        undefined,\n      ]\n    ");
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=ListStore.test.js.map