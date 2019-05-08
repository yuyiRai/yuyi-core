"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var antd_1 = require("antd");
require("rc-tween-one/dist/rc-tween-one.js");
var rc_tween_one_1 = require("rc-tween-one");
exports.TagGroup = function (props) {
    return (React.createElement(rc_tween_one_1.TweenOneGroup, { enter: {
            scale: 0.8, opacity: 0, type: 'from', duration: 100,
            onComplete: function (e) {
                e.target.setAttribute('style', '');
            },
        }, leave: { opacity: 0, width: 0, scale: 0, duration: 200 }, appear: false }, props.labelsConfig.map(function (v) {
        return React.createElement(antd_1.Tag, { key: v.label, color: "blue", closable: true, onClose: function (e) {
                e.preventDefault();
                e.stopPropagation();
                v.remove(props.onClose);
            } }, v.label);
    })));
};
