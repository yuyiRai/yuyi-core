"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var lodash_1 = require("lodash");
var _1 = __importDefault(require("."));
var mobx_react_1 = require("mobx-react");
var _a = require('vuera'), ReactWrapper = _a.ReactWrapper, VueInReact = _a.VueInReact;
exports.SlotUtils = function () { return ({
    getReactElementFromVNode: getReactElementFromVNode,
    react2Vue: exports.react2Vue,
    slotInject: slotInject,
    slotInjectContainer: slotInjectContainer,
    useSlots: useSlots
}); };
var getReactElementFromVNode = function (nodeFactory) {
    return lodash_1.reduce(nodeFactory, function (map, target, key) {
        var _a;
        var SlotSource = VueInReact({
            functional: true,
            render: function (h, _a) {
                var props = _a.props;
                // console.log('render source', key, props);
                var slot = _1.default.isFunction(target) ? target(props) : target;
                return _1.default.isArray(slot) && slot.length == 1 ? slot[0] : h('span', {}, slot);
            }
        });
        return Object.assign(map, (_a = {},
            _a[key] = function SlotComponent(props) {
                // console.log('render', key, props);
                return react_1.default.createElement(SlotSource, __assign({}, props));
            },
            _a));
    }, {});
};
exports.react2Vue = function (Target) {
    return {
        functional: true,
        render: function (h, vueProps) {
            var _a = vueProps.slots(), children = _a["default"], slots = __rest(_a, ['default']);
            var _b = vueProps.data, scopedSlots = _b.scopedSlots, props = _b.props, attrs = _b.attrs, ref = _b.ref;
            // console.log(Target.displayName || Target.name, vueProps, children, slots, scopedSlots)
            return h(ReactWrapper, {
                ref: ref,
                props: {
                    component: Target,
                },
                attrs: __assign({}, props, attrs, { $scopedSlots: scopedSlots, $commonSlots: function () { return slots; } }),
                on: {
                    'click': console.log
                }
            }, children);
        }
    };
};
function slotInject(target) {
    return mobx_react_1.inject('slots', 'scopedSlots')(target);
}
exports.slotInject = slotInject;
function slotInjectContainer(target) {
    var Target = mobx_react_1.inject('slots', 'scopedSlots')(target);
    var injected = function (nextProps) {
        var $commonSlots = nextProps.$commonSlots, $scopedSlots = nextProps.$scopedSlots, other = __rest(nextProps, ["$commonSlots", "$scopedSlots"]);
        var slots = $commonSlots();
        var injectProps = {
            slots: getReactElementFromVNode(slots),
            scopedSlots: getReactElementFromVNode($scopedSlots)
        };
        return react_1.default.createElement(mobx_react_1.Provider, __assign({}, injectProps),
            react_1.default.createElement(Target, __assign({}, other)));
    };
    Object.defineProperty(injected, 'name', { value: Target.name, writable: false, configurable: false, enumerable: false });
    injected.displayName = Target.displayName;
    return injected;
}
exports.slotInjectContainer = slotInjectContainer;
function useSlots(target, propertyName) {
    var desc = Object.getOwnPropertyDescriptor(target, propertyName) || {};
    var value = desc.value, get = desc.get, set = desc.set;
    var slotName = lodash_1.lowerFirst(propertyName);
    if (get || set) {
        console.error('is invalid property!!');
    }
    Object.defineProperty(target, propertyName, {
        get: function () {
            if (!this.props) {
                return value;
            }
            // console.error('get slot', propertyName, this)
            var _a = this.props, slots = _a.slots, scopedSlots = _a.scopedSlots;
            return slots[slotName] || scopedSlots[slotName] || value || (function () { return react_1.default.createElement("span", null,
                "slots-",
                slotName); });
        }
    });
    // console.log('get defined', target[propertyName], Object.getOwnPropertyDescriptor(target, propertyName))
}
exports.useSlots = useSlots;
