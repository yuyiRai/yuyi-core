var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import lowerFirst from "lodash/lowerFirst";
import reduce from "lodash/reduce";
import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import Utils from '.';
var myErrorHandler = function (error, componentStack) {
    // Do something with the error
    // E.g. log to an error logging client here
    // console.log(error, componentStack)
};
var SlotErrorInfo = function (_a) {
    var componentStack = _a.componentStack, error = _a.error;
    return (React.createElement("div", null,
        React.createElement("p", null,
            React.createElement("strong", null, "Oops! An error occured!")),
        React.createElement("p", null, "Here\u2019s what we know\u2026"),
        React.createElement("p", null,
            React.createElement("strong", null, "Error:"),
            " ",
            error.toString()),
        React.createElement("p", null,
            React.createElement("strong", null, "Stacktrace:"),
            " ",
            componentStack)));
};
var _a = require('vuera'), ReactWrapper = _a.ReactWrapper, VueInReact = _a.VueInReact;
export var SlotUtils = function () { return ({
    react2Vue: react2Vue,
    slotInjectContainer: slotInjectContainer,
    Slot: Slot
}); };
var SlotSourceBase = {
    props: ['factoryProps', 'slotFactory'],
    render: function (h) {
        // console.log('render source', h, this);
        var slot = Utils.isFunction(this.slotFactory) ? this.slotFactory(this.factoryProps) : this.slotFactory;
        // debugger
        return h('span', {}, slot);
    }
};
var SlotSource = VueInReact(SlotSourceBase);
var SlotComponent = /** @class */ (function (_super) {
    __extends(SlotComponent, _super);
    function SlotComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlotComponent.prototype.render = function () {
        return (React.createElement(ErrorBoundary, { onError: myErrorHandler, FallbackComponent: SlotErrorInfo },
            React.createElement("span", null,
                React.createElement(SlotSource, __assign({}, this.props.slot)))));
    };
    return SlotComponent;
}(React.PureComponent));
export { SlotComponent };
;
var getSlotFromVNode = function (nodeFactory) {
    return reduce(nodeFactory, function (map, target, key) {
        var _a;
        // debugger
        return Object.assign(map, (_a = {},
            _a[key] = function (props) {
                return React.createElement(SlotComponent, { slot: { slotFactory: target, factoryProps: props } });
            },
            _a));
    }, {});
};
export var react2Vue = function (Target) {
    return {
        functional: true,
        render: function (h, vueProps) {
            var _a = vueProps.slots(), children = _a["default"], slots = __rest(_a, ['default']);
            var _b = vueProps.data, scopedSlots = _b.scopedSlots, props = _b.props, attrs = _b.attrs, ref = _b.ref;
            // console.log(Target.displayName || Target.name, vueProps, children, slots, scopedSlots)
            // const { inter } = getSlotFromVNode(slots)
            // debugger
            // console.log(Target.name, 'react2Vue', vueProps, this, children, slots)
            return h(ReactWrapper, {
                ref: ref,
                props: {
                    component: Target
                },
                attrs: __assign({}, props, attrs, { $scopedSlots: scopedSlots || (attrs ? attrs.scopedSlots : undefined), $commonSlots: function () { return getSlotFromVNode(slots); } }),
                on: {
                    'onClick': console.log
                }
            }, children);
        }
    };
};
export var SlotContext = React.createContext({ slots: null, scopedSlots: null });
export function slotInjectContainer(target) {
    var Target = target;
    var injected = function (nextProps) {
        var $commonSlots = nextProps.$commonSlots, $scopedSlots = nextProps.$scopedSlots, children = nextProps.children, other = __rest(nextProps, ["$commonSlots", "$scopedSlots", "children"]);
        var slots = $commonSlots();
        var injectProps = {
            slots: slots,
            scopedSlots: getSlotFromVNode($scopedSlots)
        };
        // console.log('injectProps', nextProps, injectProps)
        if (true) {
            Target.contextType = SlotContext;
        }
        // debugger
        return (React.createElement(ErrorBoundary, { onError: myErrorHandler, FallbackComponent: SlotErrorInfo },
            React.createElement(SlotContext.Provider, { value: injectProps },
                React.createElement(Target, __assign({}, other),
                    React.createElement("span", null, children)))));
    };
    Object.defineProperty(injected, 'name', { value: target.name, writable: false, configurable: false, enumerable: false });
    injected.displayName = Target.displayName;
    return injected;
}
export var Slot = React.memo(function (_a) {
    var propertyName = _a.name, slot = _a.slot, other = __rest(_a, ["name", "slot"]);
    var slotName = lowerFirst(propertyName);
    var _b = React.useContext(SlotContext), _c = _b.slots, slots = _c === void 0 ? {} : _c, _d = _b.scopedSlots, scopedSlots = _d === void 0 ? {} : _d;
    var Renderer = slots[slotName] || scopedSlots[slotName] || slot || (function () { return true ? React.createElement("span", null) : React.createElement("span", null,
        "slots-",
        slotName); });
    return React.createElement(Renderer, __assign({}, other));
});
export var ScopedSlot = React.memo(function (_a) {
    var propertyName = _a.name, other = __rest(_a, ["name"]);
    var slotName = lowerFirst(propertyName);
    var _b = propertyName, slotComponent = React.useContext(SlotContext).scopedSlots[_b];
    var Renderer = slotComponent || (function () { return true ? React.createElement("span", null) : React.createElement("span", null,
        "slots-",
        slotName); });
    return Renderer(other);
});
//# sourceMappingURL=SlotUtils.js.map