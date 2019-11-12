import { defaults } from 'lodash';
// import React from 'react'
// import MaBox from '@material-ui/core/Box/Box'
import Vue, { CreateElement, VNode } from 'vue';
import { _hackRender } from './hack';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// useMediaQuery

function _Mixins(...Ctors: any[]) {
  return Vue.extend({ mixins: Ctors });
}

export function _getAllContext(instance: Vue): Record<string, any> {
  const contextObject = {}
  let temp = instance.$parent;
  while (temp) {
    const { _provided: provide = temp.$options.provide } = temp as any
    if (provide) {
      const add = provide instanceof Function ? provide.call(temp) : provide
      defaults(contextObject, add)
    }
    if (temp.$parent && temp.$parent !== temp) {
      temp = temp.$parent
    } else
      break;
  }
  return contextObject
}

export const _ContextProvider = Vue.extend({
  props: {
    context: { type: Object, default() { return {} }}
  },
  provide() {
    return this.context
  },
  updated() {
    if (__DEV__) {
      console.log(this, 'ReactInVue')
    }
  },
  render(h) {
    return this.$slots.default as any
  }
})

export const _ContextCollectionWarp = Vue.extend({
  computed: {
    $allContext() {
      return _getAllContext(this)
    }
  }
})

export function _hackedRenderWithContextProviders(
  vnodes: VNode | VNode[],
  context?: InstanceType<typeof _ContextCollectionWarp>,
  h?: CreateElement
) {
  for (const vnode of (vnodes instanceof Array ? vnodes : [vnodes])) {
    if (vnode && vnode.componentOptions) {
      const { children = [] } = vnode.componentOptions || {}
      for (const i in children) {
        // 因为vue无法一个组件渲染多个节点，只能遍历children一个个包裹起来
        vnode!.componentOptions!.children![i] = h!(_ContextProvider, { props: { context: context!.$allContext } }, [children[i]])
      }
    }
  }
  return vnodes
}

export function react2Vue(reactComponent: any) {
  // const { ReactInVue } = require('vuera')
  return _hackRender<InstanceType<typeof _ContextCollectionWarp>>(
    _Mixins(
      // ReactInVue(
      //   reactComponent instanceof Object && reactComponent.default || reactComponent
      // ),
      _ContextCollectionWarp
    ),
    _hackedRenderWithContextProviders,
    false
  )
}

