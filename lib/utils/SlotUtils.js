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
import React from 'react';
import reduce from "lodash/reduce";
import lowerFirst from "lodash/lowerFirst";
import Utils from '.';
import { inject, Provider } from 'mobx-react';
var _a = require('vuera'), ReactWrapper = _a.ReactWrapper, VueInReact = _a.VueInReact;
export var SlotUtils = function () { return ({
    react2Vue: react2Vue,
    slotInject: slotInject,
    slotInjectContainer: slotInjectContainer,
    useSlots: useSlots
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
        return React.createElement("span", null,
            React.createElement(SlotSource, __assign({}, this.props.slot)));
    };
    return SlotComponent;
}(React.Component));
export { SlotComponent };
;
var getSlotFromVNode = function (nodeFactory) {
    return reduce(nodeFactory, function (map, target, key) {
        var _a;
        // debugger
        return Object.assign(map, (_a = {},
            _a[key] = function (props) { return React.createElement(SlotComponent, { slot: { slotFactory: target, factoryProps: props } }); },
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
            console.log(Target.name, 'react2Vue', vueProps, this, children, slots);
            return h(ReactWrapper, {
                ref: ref,
                props: {
                    component: Target
                },
                attrs: __assign({}, props, attrs, { $scopedSlots: scopedSlots, $commonSlots: function () { return getSlotFromVNode(slots); } }),
                on: {
                    'onClick': console.log
                }
            }, children);
        }
    };
};
export function slotInject(target) {
    return inject('slots', 'scopedSlots')(target);
}
export var SlotContext = React.createContext({ slots: {}, scopedSlots: {} });
export function slotInjectContainer(target) {
    var Target = inject('slots', 'scopedSlots')(target);
    var injected = function (nextProps) {
        var $commonSlots = nextProps.$commonSlots, $scopedSlots = nextProps.$scopedSlots, children = nextProps.children, other = __rest(nextProps, ["$commonSlots", "$scopedSlots", "children"]);
        var slots = $commonSlots();
        var injectProps = {
            slots: slots,
            scopedSlots: getSlotFromVNode($scopedSlots)
        };
        // debugger
        return React.createElement(Provider, __assign({}, injectProps),
            React.createElement(Target, __assign({}, other),
                React.createElement("span", null, children)));
    };
    Object.defineProperty(injected, 'name', { value: target.name, writable: false, configurable: false, enumerable: false });
    injected.displayName = Target.displayName;
    return injected;
}
export function useSlots(target, propertyName) {
    var desc = Object.getOwnPropertyDescriptor(target, propertyName) || {};
    var value = desc.value, get = desc.get, set = desc.set;
    var slotName = lowerFirst(propertyName);
    if (get || set) {
        console.error('is invalid property!!');
    }
    Object.defineProperty(target, propertyName, {
        get: function () {
            if (!this.props) {
                return value;
            }
            var _a = this.props, slots = __rest(_a.slots, []), scopedSlots = __rest(_a.scopedSlots, []);
            // console.error('get slot', propertyName, this, slots[slotName], scopedSlots[slotName])
            return slots[slotName] || scopedSlots[slotName] || value || (function () { return React.createElement("span", null,
                "slots-",
                slotName); });
        }
    });
    // console.log('get defined', target[propertyName], Object.getOwnPropertyDescriptor(target, propertyName))
}
//# sourceMappingURL=SlotUtils.js.map