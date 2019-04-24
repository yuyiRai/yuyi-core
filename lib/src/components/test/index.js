"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class AppTest extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            title: 'React Component Test'
        };
    }
    render() {
        return React.createElement("p", null, this.state.title);
    }
}
exports.AppTest = AppTest;
//# sourceMappingURL=index.js.map