"use strict";
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
var react_1 = __importDefault(require("react"));
var UploadMessage_1 = __importStar(require("./UploadMessage"));
exports.UploadMessage = UploadMessage_1.default;
exports.UploadProgressStore = UploadMessage_1.UploadProgressStore;
var utils_1 = __importDefault(require("../../utils"));
function showUploadMessage(instance, file, store) {
    return utils_1.default.$notify({
        duration: 0,
        position: 'bottom-left',
        title: "\u4E0A\u4F20\u4E2D",
        type: 'success',
        msg: function (index) { return react_1.default.createElement(UploadMessage_1.default, { key: index, file: file, store: store }); }
    }, instance);
}
exports.showUploadMessage = showUploadMessage;
//# sourceMappingURL=index.js.map