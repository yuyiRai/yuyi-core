import React from 'react'
import { VNode } from 'vue';
import { IKeyValueMap } from 'mobx';
import { reduce, lowerFirst } from 'lodash';
import Utils from '.';
import { IReactComponent } from 'mobx-react';
const { ReactWrapper, VueInReact } = require('vuera');

export const SlotUtils = () => ({
  react2Vue,
  slotInjectContainer,
  useSlots
});

export interface ISlotSource {
  factoryProps?: any, 
  slotFactory: any
}
const SlotSourceBase = {
  props: ['factoryProps', 'slotFactory'],
  render(h: any) {
    console.log('render source', h, this);
    const slot = Utils.isFunction(this.slotFactory) ? this.slotFactory(this.factoryProps) : this.slotFactory;
    // debugger
    return h('span', {}, slot)
  }
}
const SlotSource: React.FunctionComponent<ISlotSource> = VueInReact(SlotSourceBase);

export interface ISlotProps {
  slot: ISlotSource
}
export class SlotComponent extends React.Component<ISlotProps> {
  render() {
    return <span><SlotSource {...this.props.slot} /></span>;
  }
};

const getSlotFromVNode = (nodeFactory: IKeyValueMap<VNode[] | Function>): any => {
  return reduce<any, IKeyValueMap<React.FunctionComponent<ISlotSource>>>(nodeFactory, 
    (map: any, target: VNode[] | Function, key: string) => {
    // debugger
    return Object.assign(map, {
      [key]: (props) => <SlotComponent slot={{slotFactory: target, factoryProps: props}} />
    });
  }, {});
}

export const react2Vue = (Target: IReactComponent<any>) => {
  return {
    functional: true,
    render(h: any, vueProps: any) {
      const { ['default']: children, ...slots } = vueProps.slots();
      const { scopedSlots, props, attrs, ref } = vueProps.data;
      // console.log(Target.displayName || Target.name, vueProps, children, slots, scopedSlots)
      // const { inter } = getSlotFromVNode(slots)
      // debugger
      console.log(Target.name, 'react2Vue', vueProps, this, children, slots)
      return h(ReactWrapper, {
        ref,
        props: {
          component: Target
        },
        attrs: {
          ...props,
          ...attrs,
          $scopedSlots: scopedSlots || attrs.scopedSlots,
          $commonSlots: () => getSlotFromVNode(slots)
        },
        on: {
          'onClick': console.log
        }
      } as any, children);
    }
  };
};

export const SlotContext = React.createContext({ slots: {}, scopedSlots: {} });
export function slotInjectContainer<T extends IReactComponent<any>>(target: T) {
  const Target = target;
  const injected = function (nextProps: any) {
    const { $commonSlots, $scopedSlots, children, ...other } = nextProps;
    const slots = $commonSlots();
    const injectProps = {
      slots,
      scopedSlots: getSlotFromVNode($scopedSlots)
    };
    // debugger
    return (
      <SlotContext.Provider value={injectProps}>
        <Target {...other}><span>{children}</span></Target>
      </SlotContext.Provider>
    );
  } as T;
  Object.defineProperty(injected, 'name', { value: target.name, writable: false, configurable: false, enumerable: false });
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
      const { slots: { ...slots }, scopedSlots: { ...scopedSlots } } = this.props;
      // console.error('get slot', propertyName, this, slots[slotName], scopedSlots[slotName])
      return slots[slotName] || scopedSlots[slotName] || value || (() => true?null:<span>slots-{slotName}</span>);
    }
  });
  // console.log('get defined', target[propertyName], Object.getOwnPropertyDescriptor(target, propertyName))
}
