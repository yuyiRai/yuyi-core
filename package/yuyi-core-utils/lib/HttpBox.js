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
/* eslint-disable */
import Utils from '.';
import includes from "lodash/includes";
import { autobind } from 'core-decorators';
var HttpBox = /** @class */ (function () {
    function HttpBox(service, cacheWhiteList, cacheKeyMap) {
        this._map = {};
        this.whiteList = ['support/findListByCodeType', 'branch/listSubBranches', 'branch/listTopBranches', 'support/findImageTypeList', 'support/findHospitalListByName'];
        this.useKey = {
            'branch/listSubBranches': 'selectTree',
            'branch/listTopBranches': 'selectTree'
        };
        this.service = service;
        this.whiteList = cacheWhiteList;
        this.useKey = cacheKeyMap;
    }
    HttpBox.prototype.getRes = function (param) {
        var _this = this;
        var isObjectFilter = Utils.isObjectFilter, createObjectKey = Utils.createObjectKey;
        // console.time(param.url)
        param.__res_key = [param.url, createObjectKey(__assign({}, isObjectFilter(param.params, param.data)))].join('');
        // console.timeEnd(param.url)
        // if('params' in param)
        //   param.params = Utils.zipEmptyData(param.params)
        // if('data' in param)
        //   param.data = Utils.zipEmptyData(param.data)
        return new Promise(function (resolve, reject) {
            if (_this.getCahce(param.__res_key)) {
                return resolve(_this.getCahce(param.__res_key));
            }
            _this.getReq(param, resolve, reject);
        });
    };
    HttpBox.prototype.getReq = function (param, resolve, reject) {
        Utils.simpleTimeBufferInput(param.__res_key, { param: param, resolve: resolve, reject: reject }, this.todo, 20);
    };
    HttpBox.prototype.setCahce = function (__res_key, value) {
        this._map[__res_key] = value;
    };
    HttpBox.prototype.getCahce = function (__res_key) {
        return this._map[__res_key];
    };
    HttpBox.prototype.todo = function (list) {
        var _this = this;
        var req = Utils.last(list).param;
        this.service(req).then(function (res) {
            var e_1, _a;
            if (includes(_this.whiteList, req.url) && _this.useKey[req.url] == req.useKey) {
                _this.setCahce(req.__res_key, res);
                setTimeout(_this.setCahce, 30 * 60 * 1000, req.__res_key, undefined);
            }
            try {
                for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                    var i = list_1_1.value;
                    i.resolve(res);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }).catch(function (e) {
            var e_2, _a;
            console.log(e, e.message, Utils.isNotEmptyValueFilter(e.message, e));
            try {
                for (var list_2 = __values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
                    var i = list_2_1.value;
                    i.reject(new Error(Utils.isNotEmptyValueFilter(e.message, e)));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (list_2_1 && !list_2_1.done && (_a = list_2.return)) _a.call(list_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HttpBox.prototype, "getRes", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], HttpBox.prototype, "getReq", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], HttpBox.prototype, "setCahce", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], HttpBox.prototype, "getCahce", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], HttpBox.prototype, "todo", null);
    return HttpBox;
}());
export { HttpBox };
//# sourceMappingURL=HttpBox.js.map