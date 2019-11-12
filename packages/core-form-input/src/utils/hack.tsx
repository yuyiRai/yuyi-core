import get from 'lodash/get'
import set from 'lodash/set'
import Vue, { CreateElement, VNode, RenderContext } from 'vue'

const explainGet = (o: any, k: any, d: any) => o[k] || d
const explainSet = (o: any, k: any, v: any) => o[k] = v

export function _hackRender<
  Instance extends Vue,
  Functional extends boolean = false
>(
  component: { new(...args: any[]): Instance },
  hackNode: (
    vnodes: VNode | VNode[],
    context?: Functional extends false ? Instance : RenderContext,
    h?: CreateElement
  ) => VNode | VNode[],
  isFunctional?: Functional
): typeof component {
  _hackFromVueComponent(component, 'render', render => {
    if (render instanceof Function) {
      if (isFunctional) {
        return function hackedFunctionalRender(h: CreateElement, ctx: any) {
          const renderer = render(h, ctx)
          return hackNode(renderer, ctx, h)
        }
      }
      return function hackedInstanceRender(this: Vue, h: CreateElement) {
        const renderer = render.call(this, h, this)
        return hackNode.call(this, renderer, this as any, h)
      }
    }
    return render
  })
  return component
}

export function _hackFromVueComponent(
  component: any,
  key: string,
  hack?: (v: any) => any,
  getter?: any,
  setter?: any
): any {
  if (!getter && !setter && key.indexOf('.') > -1) {
    return _hackFromVueComponent(component, key, hack, get, set)
  }
  getter = getter || explainGet
  setter = setter || explainSet
  if (component) {
    let r = getter(component, key);
    if (r) {
      if (hack) {
        const hr = hack(r)
        hr && hr !== r && setter(component, key, hr || r)
      }
    } else if (component.mixins instanceof Array) {
      for (const mixin of component.mixins) {
        if (mixin && !!(r = _hackFromVueComponent(mixin, key, hack, getter, setter)))
          return r;
      }
    }
    if (!r) {
      for (const skey of ['options']) {
        if (!!(r = _hackFromVueComponent(component[skey], key, hack, getter, setter))) {
          return r
        }
      }
    }
    return r;
  }
  invariant(false, '这看上去不像一个vue组件or组件options')
  return null;
}
export function _getFromVueComponent(component: any, key: string) {
  return _hackFromVueComponent(component, key)
}
