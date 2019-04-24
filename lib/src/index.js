"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./stores"));
__export(require("./utils"));
__export(require("./components"));
var vue_1 = __importDefault(require("vue"));
var VuePlugin = require('vuera').VuePlugin;
vue_1.default.use(VuePlugin);
//# sourceMappingURL=index.js.map