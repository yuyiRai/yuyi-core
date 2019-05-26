var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
import AMapJS from 'amap-js';
import { EventEmitter } from 'events';
import { Utils } from '../utils/Utils';
import { autobind } from 'core-decorators';
// import { Debounce } from 'lodash-decorators';
export var onMapDisposed = new EventEmitter();
var AMapService = /** @class */ (function () {
    function AMapService() {
        var _this = this;
        this.mapLoading = false;
        /**
         * 插件集合
         */
        this.plugin = {
            'ToolBar': function (map) {
                AMapService.AMap('ToolBar').then(function (ToolBar) {
                    console.log(ToolBar);
                    var toolbar = new ToolBar();
                    map.addControl(toolbar);
                });
            },
            /**
             * 自动搜索补全地名
             * @return 返回一个promise
             */
            'Autocomplete': function (map, city, search) {
                if (city === void 0) { city = '全国'; }
                return _this.getAutoComplete({ map: map, city: city, search: search });
            },
            'Geolocation': function (map) {
            }
        };
        this.getAutoComplete = Utils.createSimpleTimeBufferInput(function (res) {
            console.log(res, _this);
            return _this.autocomplete(res[res.length - 1]);
        }, this, 200, true);
        // this.key = new Date().getTime()
        // if (!(window.mapEmitter instanceof EventEmitter)) {
        //     window.mapEmitter = new EventEmitter()
        // }
    }
    AMapService.setKey = function (key) {
        this.key = key;
    };
    AMapService.AMap = function (key) {
        if (key === void 0) { key = 'Map'; }
        return __awaiter(this, void 0, void 0, function () {
            var aMapJSAPILoader, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!AMapService.amap) return [3 /*break*/, 2];
                        aMapJSAPILoader = new AMapJS.AMapJSAPILoader({ key: AMapService.key });
                        _a = AMapService;
                        return [4 /*yield*/, aMapJSAPILoader.load()];
                    case 1:
                        _a.amap = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!AMapService.amap[key]) {
                            AMapService.amap.plugin("AMap." + key);
                        }
                        return [2 /*return*/, AMapService.amap[key]];
                }
            });
        });
    };
    /**
     * @return 插件名字集合
     */
    AMapService.prototype.pluginNames = function () {
        return Object.keys(this.plugin);
    };
    AMapService.prototype.autocomplete = function (_a) {
        var _this = this;
        var map = _a.map, city = _a.city, search = _a.search;
        var autoOptions = {
            //city 限定城市，默认全国
            city: city
            // input: 'searchMapContainer'
        };
        if (search == undefined) {
            return Promise.reject('搜索地点关键字为空');
        }
        console.info('搜索关键字', search);
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var autoComplete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mapLoading = true;
                        return [4 /*yield*/, AMapService.AMap('Autocomplete')];
                    case 1:
                        autoComplete = new (_a.sent())(autoOptions);
                        autoComplete.search(search, function (status, result) {
                            // 搜索成功时，result即是对应的匹配数据
                            var tips = (result || []).tips;
                            console.log('search result', status, result);
                            if (status == 'no_data' || !(tips instanceof Array) || tips.length == 0) {
                                reject("\u627E\u4E0D\u5230\u5173\u952E\u5B57\u5730\u70B9: " + search);
                            }
                            else {
                                console.info('搜索到关键字', search, tips);
                                resolve(tips);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); }).finally(function () {
            _this.mapLoading = false;
        });
    };
    /**
     *
     * @param { number } zoom 地图缩放率
     */
    AMapService.prototype.onMapLoad = function (zoom) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AMapService.AMap()];
                    case 1: return [2 /*return*/, new (_a.sent())('map-container', {
                            resizeEnable: true, viewMode: '3D',
                            zoom: zoom
                        })];
                }
            });
        });
    };
    AMapService.prototype.getMap = function () {
        return AMapService.AMap();
    };
    AMapService.prototype.dispose = function () {
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AMapService.prototype, "autocomplete", null);
    return AMapService;
}());
export { AMapService };
window.AMapService = AMapService;
//# sourceMappingURL=AMap.js.map