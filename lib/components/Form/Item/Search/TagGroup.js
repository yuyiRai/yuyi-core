import * as React from 'react';
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css.js";
import 'antd/lib/tag/style/css';
import 'rc-tween-one/dist/rc-tween-one.js';
import { TweenOneGroup } from 'rc-tween-one';
export var TagGroup = function (props) {
    return (React.createElement(TweenOneGroup, { enter: __$hoisted_o0, leave: __$hoisted_o1, appear: false }, props.labelsConfig.map(function (v) {
        return React.createElement(Tag, { key: v.label, color: "blue", closable: true, onClose: function (e) {
                e.preventDefault();
                e.stopPropagation();
                v.remove(props.onClose);
            } }, v.label);
    })));
};
var __$hoisted_o0 = {
    scale: 0.8, opacity: 0, type: 'from', duration: 100,
    onComplete: function (e) {
        e.target.setAttribute('style', '');
    },
};
var __$hoisted_o1 = { opacity: 0, width: 0, scale: 0, duration: 200 };
//# sourceMappingURL=TagGroup.js.map