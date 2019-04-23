"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var FormPage_1 = __importDefault(require("./FormPage"));
var index_1 = __importDefault(require("../utils/index"));
var lodash_1 = require("lodash");
var _ = __importStar(require("lodash"));
require("./index");
// export * from './TablePage'
window._ = _;
function install(Vue) {
    // locale.use(opts.locale);
    // locale.i18n(opts.i18n);
    lodash_1.forEach(FormPage_1.default, function (component, key) {
        Vue.component(component.name || key, component);
    });
    // Vue.use(Loading.directive);
    // Vue.prototype.$ELEMENT = {
    //   size: opts.size || '',
    //   zIndex: opts.zIndex || 2000
    // };
    Vue.prototype.$utils = index_1.default;
    /**
     * @param { boolean | object } paramSource true为历史记录后退，false为不确认后退，对象为详细配置
     */
    Vue.prototype.$goBack = function (paramSource) {
        var _this = this;
        if (paramSource === void 0) { paramSource = true; }
        var _a = index_1.default.isObjectFilter(paramSource) || { confirm: paramSource }, confirm = _a.confirm, _b = _a.useBack, useBack = _b === void 0 ? false : _b, params = __rest(_a, ["confirm", "useBack"]);
        if (confirm === false) {
            return this.$utils.pathReturn(this, params, false, useBack);
        }
        this.$confirm(confirm === true ? '是否要离开当前页？' : confirm).then(function () {
            _this.$utils.pathReturn(_this, params, true, useBack);
        });
    };
    // Vue.prototype.$loading = Loading.service;
    // Vue.prototype.$msgbox = MessageBox;
    // Vue.prototype.$alert = MessageBox.alert;
    // Vue.prototype.$confirm = MessageBox.confirm;
    // Vue.prototype.$prompt = MessageBox.prompt;
    // Vue.prototype.$notify = Notification;
    // Vue.prototype.$message = Message;
}
exports.default = install;
;
//# sourceMappingURL=index.js.map