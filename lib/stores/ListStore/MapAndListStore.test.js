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
import { Utils } from "../../utils";
import { autorun, observable, reaction } from "mobx";
import { createTransformer } from "mobx-utils";
import { KeyDataMapStore } from "./MapAndListStore";
console.info = function () { };
/*
      store 保存了我们的领域对象: boxes 和 arrows
    */
var store = observable({
    boxes: [],
    arrows: [],
    selection: null
});
/**
    每次更改会把 store 序列化成 json 并将其添加到状态列表中
  */
var states = [];
var serializeState = createTransformer(function (store) { return ({
    boxes: store.boxes.map(serializeBox),
    arrows: store.arrows.map(serializeArrow),
    selection: store.selection ? store.selection.id : null
}); });
var serializeBox = createTransformer(function (box) { return (__assign({}, box)); });
var serializeArrow = createTransformer(function (arrow) { return ({
    id: arrow.id,
    to: arrow.to.id,
    from: arrow.from.id
}); });
autorun(function () {
    states.push(serializeState(store));
});
function test(transformer) {
    var _this = this;
    describe("simple test", function () {
        var map = new KeyDataMapStore('code', transformer);
        var object = map.sourceData;
        var view = observable({
            get name() {
                return map.targetData.name;
            },
            get pwd() {
                return map.targetData.password;
            }
        });
        var onNameChange, onPasswordChange, keysChange, sourceValuesChange;
        reaction(function () { return view.name; }, function (obj) {
            onNameChange(obj);
        });
        reaction(function () { return view.pwd; }, function (obj) {
            onPasswordChange(obj);
        });
        reaction(function () { return map.keyList; }, function (obj) {
            keysChange(obj);
        });
        reaction(function () { return map.valueList; }, function (obj) {
            sourceValuesChange(obj);
        });
        beforeEach(function () {
            onNameChange = jest.fn(function (obj) { return console.log(obj); });
            onPasswordChange = jest.fn(function (obj) { return console.log(obj); });
            keysChange = jest.fn(function (obj) { return console.log(obj); });
            sourceValuesChange = jest.fn(function (obj) { return console.log(obj); });
        });
        it("init data", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                map.setSourceData([{ code: "name" }, { code: "password" }]);
                expect(object).not.toBe(map.sourceData);
                expect(onNameChange).toBeCalledTimes(1);
                expect(onPasswordChange).toBeCalledTimes(1);
                expect(keysChange).toBeCalledTimes(1);
                expect(sourceValuesChange).toBeCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it("init equals to last data", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                object = map.sourceData;
                map.setSourceData([{ code: "name" }, { code: "password" }]);
                // expect(object).toBe(map.sourceData);
                expect(onNameChange).toBeCalledTimes(0);
                expect(onPasswordChange).toBeCalledTimes(0);
                expect(keysChange).toBeCalledTimes(0);
                expect(sourceValuesChange).toBeCalledTimes(0);
                return [2 /*return*/];
            });
        }); });
        it("init diff (only password) to last data", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                map.setSourceData([{ code: "name" }]);
                expect(object).not.toBe(map.sourceData);
                expect(onNameChange).toBeCalledTimes(0);
                expect(onPasswordChange).toBeCalledTimes(1);
                expect(keysChange).toBeCalledTimes(1);
                expect(sourceValuesChange).toBeCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it("with", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store.boxes.push({ a: 1 });
                        store.boxes.push({ b: 2 }, { c: 3 });
                        return [4 /*yield*/, Utils.waitingPromise(10)];
                    case 1:
                        _a.sent();
                        expect(states[1].boxes[0]).toBe(states[2].boxes[0]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
test({
    create: function (source) {
        return { code: source.code };
    },
    update: function (_a, target) {
        var code = _a.code;
        ;
        return __assign({}, target, { codeName: code });
    },
    delete: function (target, source) {
        console.log(target, source);
    }
});
// test({
//   create(source: IFormItemConstructor) {
//     return new ItemConfig(source, {});
//   },
//   update(source, target) {;
//     return target.setConfig(source);
//   },
//   delete(target, source) {
//     console.info(target, source);
//   }
// } as IMapTransformer<'code', IFormItemConstructor, ItemConfig>)
//# sourceMappingURL=MapAndListStore.test.js.map