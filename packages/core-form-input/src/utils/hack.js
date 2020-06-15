import get from 'lodash/get';
import set from 'lodash/set';
var explainGet = function (o, k, d) { return o[k] || d; };
var explainSet = function (o, k, v) { return o[k] = v; };
export function _hackRender(component, hackNode, isFunctional) {
    _hackFromVueComponent(component, 'render', function (render) {
        if (render instanceof Function) {
            if (isFunctional) {
                return function hackedFunctionalRender(h, ctx) {
                    var renderer = render(h, ctx);
                    return hackNode(renderer, ctx, h);
                };
            }
            return function hackedInstanceRender(h) {
                var renderer = render.call(this, h, this);
                return hackNode.call(this, renderer, this, h);
            };
        }
        return render;
    });
    return component;
}
export function _hackFromVueComponent(component, key, hack, getter, setter) {
    if (!getter && !setter && key.indexOf('.') > -1) {
        return _hackFromVueComponent(component, key, hack, get, set);
    }
    getter = getter || explainGet;
    setter = setter || explainSet;
    if (component) {
        var r = getter(component, key);
        if (r) {
            if (hack) {
                var hr = hack(r);
                hr && hr !== r && setter(component, key, hr || r);
            }
        }
        else if (component.mixins instanceof Array) {
            for (var _i = 0, _a = component.mixins; _i < _a.length; _i++) {
                var mixin = _a[_i];
                if (mixin && !!(r = _hackFromVueComponent(mixin, key, hack, getter, setter)))
                    return r;
            }
        }
        if (!r) {
            for (var _b = 0, _c = ['options']; _b < _c.length; _b++) {
                var skey = _c[_b];
                if (!!(r = _hackFromVueComponent(component[skey], key, hack, getter, setter))) {
                    return r;
                }
            }
        }
        return r;
    }
    invariant(false, '这看上去不像一个vue组件or组件options');
    return null;
}
export function _getFromVueComponent(component, key) {
    return _hackFromVueComponent(component, key);
}
//# sourceMappingURL=hack.js.map