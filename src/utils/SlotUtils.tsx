import React from 'react'
import { VNode } from 'vue';
import { IKeyValueMap } from 'mobx';
import { reduce, lowerFirst } from 'lodash';
import Utils from '.';
import { IReactComponent, inject, Provider } from 'mobx-react';
const { ReactWrapper, VueInReact } = require('vuera');

export const SlotUtils = () => ({
  getReactElementFromVNode,
  react2Vue,
  slotInject,
  slotInjectContainer,
  useSlots
});

const getReactElementFromVNode = (nodeFactory: IKeyValueMap<VNode[] | Function>): any => {
  return reduce<any, any>(nodeFactory, (map: any, target: VNode[] | Function, key: string) => {
    const SlotSource = VueInReact({
      functional: true,
      render(h: any, { props }: any) {
        // console.log('render source', key, props);
        const slot = Utils.isFunction(target) ? target(props) : target;
        return Utils.isArray(slot) && slot.length == 1 ? slot[0] : h('span', {}, slot);
      }
    });
    return Object.assign(map, {
      [key]: function SlotComponent(props: any) {
        // console.log('render', key, props);
        return <SlotSource {...props} />;
      }
    });
  }, {});
};

export const react2Vue = (Target: IReactComponent<any>) => {
  return {
    functional: true,
    render(h: any, vueProps: any) {
      const { ['default']: children, ...slots } = vueProps.slots();
      const { scopedSlots, props, attrs, ref } = vueProps.data;
      // console.log(Target.displayName || Target.name, vueProps, children, slots, scopedSlots)
      return h(ReactWrapper, {
        ref,
        props: {
          component: Target,
        },
        attrs: {
          ...props,
          ...attrs,
          $scopedSlots: scopedSlots,
          $commonSlots: () => slots
        },
        on: {
          'click': console.log
        }
      } as any, children);
    }
  };
};

export function slotInject<T extends IReactComponent<any>>(target: T) {
  return inject('slots', 'scopedSlots')(target) as T;
}
export function slotInjectContainer<T extends IReactComponent<any>>(target: T) {
  const Target = inject('slots', 'scopedSlots')(target);
  const injected = function (nextProps: any) {
    const { $commonSlots, $scopedSlots, ...other } = nextProps;
    const slots = $commonSlots();
    const injectProps = {
      slots: getReactElementFromVNode(slots),
      scopedSlots: getReactElementFromVNode($scopedSlots)
    };
    return <Provider {...injectProps}><Target {...other} /></Provider>;
  } as T;
  Object.defineProperty(injected, 'name', { value: Target.name, writable: false, configurable: false, enumerable: false });
  injected.displayName = Target.displayName;
  return injected;
}
export function useSlots(target: any, propertyName: string) {
  const desc = Object.getOwnPropertyDescriptor(target, propertyName) || {};
  const { value, get, set } = desc;
  const slotName = lowerFirst(propertyName);
  if (get || set) {
    console.error('is invalid property!!');
  }
  Object.defineProperty(target, propertyName, {
    get() {
      if (!this.props) {
        return value;
      }
      // console.error('get slot', propertyName, this)
      const { slots, scopedSlots } = this.props;
      return slots[slotName] || scopedSlots[slotName] || value || (() => <span>slots-{slotName}</span>);
    }
  });
  // console.log('get defined', target[propertyName], Object.getOwnPropertyDescriptor(target, propertyName))
}
