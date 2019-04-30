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
var react_dom_1 = __importDefault(require("react-dom"));
// import './demo/index.css';
// import App from './demo/App';
var serviceWorker = __importStar(require("./demo/serviceWorker"));
var Demo_1 = require("./components/Form/Demo");
var react_hot_loader_1 = require("react-hot-loader");
var index_1 = require("./components/Container/index");
exports.demo = function () {
    var container = document.getElementById('root');
    if (container) {
        // ReactDOM.render(<App />, document.getElementById('root'));
        react_dom_1.default.render(react_1.default.createElement(react_hot_loader_1.AppContainer, null,
            react_1.default.createElement(index_1.PageContainer, null,
                react_1.default.createElement(Demo_1.App, null))), container);
        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.unregister();
    }
};
