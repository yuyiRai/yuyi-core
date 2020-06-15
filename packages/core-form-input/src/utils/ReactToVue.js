import { defaults } from 'lodash';
// import React from 'react'
// import MaBox from '@material-ui/core/Box/Box'
import Vue from 'vue';
import { _hackRender } from './hack';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// useMediaQuery
function _Mixins() {
    var Ctors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ctors[_i] = arguments[_i];
    }
    return Vue.extend({ mixins: Ctors });
}
export function _getAllContext(instance) {
    var contextObject = {};
    var temp = instance.$parent;
    while (temp) {
        var _a = temp._provided, provide = _a === void 0 ? temp.$options.provide : _a;
        if (provide) {
            var add = provide instanceof Function ? provide.call(temp) : provide;
            defaults(contextObject, add);
        }
        if (temp.$parent && temp.$parent !== temp) {
            temp = temp.$parent;
        }
        else
            break;
    }
    return contextObject;
}
export var _ContextProvider = Vue.extend({
    props: {
        context: { type: Object, default: function () { return {}; } }
    },
    provide: function () {
        return this.context;
    },
    updated: function () {
        if (__DEV__) {
            console.log(this, 'ReactInVue');
        }
    },
    render: function (h) {
        return this.$slots.default;
    }
});
export var _ContextCollectionWarp = Vue.extend({
    computed: {
        $allContext: function () {
            return _getAllContext(this);
        }
    }
});
export function _hackedRenderWithContextProviders(vnodes, context, h) {
    for (var _i = 0, _a = (vnodes instanceof Array ? vnodes : [vnodes]); _i < _a.length; _i++) {
        var vnode = _a[_i];
        if (vnode && vnode.componentOptions) {
            var _b = (vnode.componentOptions || {}).children, children = _b === void 0 ? [] : _b;
            for (var i in children) {
                // 因为vue无法一个组件渲染多个节点，只能遍历children一个个包裹起来
                vnode.componentOptions.children[i] = h(_ContextProvider, { props: { context: context.$allContext } }, [children[i]]);
            }
        }
    }
    return vnodes;
}
export function react2Vue(reactComponent) {
    // const { ReactInVue } = require('vuera')
    return _hackRender(_Mixins(
    // ReactInVue(
    //   reactComponent instanceof Object && reactComponent.default || reactComponent
    // ),
    _ContextCollectionWarp), _hackedRenderWithContextProviders, false);
}
//# sourceMappingURL=ReactToVue.js.map