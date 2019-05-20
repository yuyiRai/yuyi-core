import { lowerFirst, reduce } from 'lodash';
import { IKeyValueMap } from 'mobx';
import { IReactComponent } from 'mobx-react';
import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { VNode } from 'vue';
import Utils from '.';

const myErrorHandler = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  // console.log(error, componentStack)
};
const SlotErrorInfo = ({ componentStack, error }) => (
  <div>
    <p><strong>Oops! An error occured!</strong></p>
    <p>Here’s what we know…</p>
    <p><strong>Error:</strong> {error.toString()}</p>
    <p><strong>Stacktrace:</strong> {componentStack}</p>
  </div>
);

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
    // console.log('render source', h, this);
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
    return (
      <ErrorBoundary onError={myErrorHandler} FallbackComponent={SlotErrorInfo}>
        <span><SlotSource {...this.props.slot} /></span>
      </ErrorBoundary>
    );
  }
};

const getSlotFromVNode = (nodeFactory: IKeyValueMap<VNode[] | Function>): any => {
  return reduce<any, IKeyValueMap<React.FunctionComponent<ISlotSource>>>(nodeFactory,
    (map: any, target: VNode[] | Function, key: string) => {
      // debugger
      return Object.assign(map, {
        [key]: (props) => <SlotComponent slot={{ slotFactory: target, factoryProps: props }} />
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
      // console.log(Target.name, 'react2Vue', vueProps, this, children, slots)
      return h(ReactWrapper, {
        ref,
        props: {
          component: Target
        },
        attrs: {
          ...props,
          ...attrs,
          $scopedSlots: scopedSlots || (attrs?attrs.scopedSlots:undefined),
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
    // console.log('injectProps', nextProps, injectProps)
    if (true) {
      (Target as any).contextType = SlotContext
    }
    // debugger
    return (
      <ErrorBoundary onError={myErrorHandler} FallbackComponent={SlotErrorInfo}>
        <SlotContext.Provider value={injectProps}>
          <Target {...other}><span>{children}</span></Target>
        </SlotContext.Provider>
      </ErrorBoundary>
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
  Reflect.set(target.constructor.prototype, propertyName, function(props: any) {
    const { slots: { ...slots }, scopedSlots: { ...scopedSlots } } = React.useContext(SlotContext)
    const Renderer = slots[slotName] || scopedSlots[slotName] || value || (() => true ? <span></span> : <span>slots-{slotName}</span>)
    return <Renderer {...props} />
  })
  // console.error('renderer!', target.propertyName);
  // console.log('get defined', target[propertyName], Object.getOwnPropertyDescriptor(target, propertyName))
}
