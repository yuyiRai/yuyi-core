"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __importDefault(require("vue"));
var install_1 = __importDefault(require("./install"));
var demo_1 = require("./demo");
__export(require("./stores"));
__export(require("./utils"));
__export(require("./components"));
// import 'element-theme-default/lib/message.css';
var VuePlugin = require('vuera').VuePlugin;
vue_1.default.use(VuePlugin);
exports.default = install_1.default;
demo_1.demo();
