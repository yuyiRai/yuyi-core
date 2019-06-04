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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { Observer, useAsObservableSource } from "mobx-react-lite";
import * as React from 'react';
import 'antd/lib/input/style/css';
export function useOptionsStore(itemConfig, transformer) {
    // reaction(()=>itemConfig.options, console.log)
    return useAsObservableSource(itemConfig.useOptionsStore(transformer));
}
export function useSearchStore(itemConfig, transformer) {
    // reaction(()=>itemConfig.options, console.log)
    return useAsObservableSource(itemConfig.useSearchStore(transformer));
}
export function useItemConfig(itemConfig) {
    // reaction(()=>itemConfig.options, console.log)
    return useAsObservableSource(itemConfig);
}
export function useOptionsStoreProps(itemConfig, Component) {
    var _a = __read(React.useState(itemConfig.useOptionsStore()), 1), store = _a[0];
    // reaction(()=>itemConfig.options, console.log)
    return ((function (props) {
        return React.createElement(Observer, { render: function () { return React.createElement(Component, __assign({}, props, { options: store.displayOptions })); } });
    }));
}
//# sourceMappingURL=index.js.map