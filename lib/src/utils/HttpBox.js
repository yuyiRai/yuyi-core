"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const core_decorators_1 = require("core-decorators");
class HttpBox {
    constructor(service, cacheWhiteList, cacheKeyMap) {
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
    getRes(param) {
        const { isObjectFilter, createObjectKey } = _1.default;
        // console.time(param.url)
        param.__res_key = [param.url, createObjectKey(Object.assign({}, isObjectFilter(param.params, param.data)))].join('');
        // console.timeEnd(param.url)
        // if('params' in param)
        //   param.params = Utils.zipEmptyData(param.params)
        // if('data' in param)
        //   param.data = Utils.zipEmptyData(param.data)
        return new Promise((resolve, reject) => {
            if (this.getCahce(param.__res_key)) {
                return resolve(this.getCahce(param.__res_key));
            }
            this.getReq(param, resolve, reject);
        });
    }
    getReq(param, resolve, reject) {
        _1.default.simpleTimeBufferInput(param.__res_key, { param, resolve, reject }, this.todo, 20);
    }
    setCahce(__res_key, value) {
        this._map[__res_key] = value;
    }
    getCahce(__res_key) {
        return this._map[__res_key];
    }
    todo(list) {
        const { param: req } = _1.default.last(list);
        this.service(req).then((res) => {
            if (this.whiteList.includes(req.url) && this.useKey[req.url] == req.useKey) {
                this.setCahce(req.__res_key, res);
                setTimeout(this.setCahce, 30 * 60 * 1000, req.__res_key, undefined);
            }
            for (const i of list) {
                i.resolve(res);
            }
        }).catch(function (e) {
            console.log(e, e.message, _1.default.isNotEmptyValueFilter(e.message, e));
            for (const i of list) {
                i.reject(new Error(_1.default.isNotEmptyValueFilter(e.message, e)));
            }
        });
    }
}
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HttpBox.prototype, "getRes", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], HttpBox.prototype, "getReq", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HttpBox.prototype, "setCahce", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HttpBox.prototype, "getCahce", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HttpBox.prototype, "todo", null);
exports.HttpBox = HttpBox;
//# sourceMappingURL=HttpBox.js.map