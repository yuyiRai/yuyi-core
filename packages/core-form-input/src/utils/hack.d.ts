import Vue, { CreateElement, VNode, RenderContext } from 'vue';
export declare function _hackRender<Instance extends Vue, Functional extends boolean = false>(component: {
    new (...args: any[]): Instance;
}, hackNode: (vnodes: VNode | VNode[], context?: Functional extends false ? Instance : RenderContext, h?: CreateElement) => VNode | VNode[], isFunctional?: Functional): typeof component;
export declare function _hackFromVueComponent(component: any, key: string, hack?: (v: any) => any, getter?: any, setter?: any): any;
export declare function _getFromVueComponent(component: any, key: string): any;
