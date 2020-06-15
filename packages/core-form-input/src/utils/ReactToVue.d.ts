import Vue, { CreateElement, VNode } from 'vue';
export declare function _getAllContext(instance: Vue): Record<string, any>;
export declare const _ContextProvider: import("vue/types/vue").ExtendedVue<Vue, unknown, unknown, unknown, {
    context: any;
}>;
export declare const _ContextCollectionWarp: import("vue/types/vue").ExtendedVue<Vue, unknown, unknown, {
    $allContext: Record<string, any>;
}, unknown>;
export declare function _hackedRenderWithContextProviders(vnodes: VNode | VNode[], context?: InstanceType<typeof _ContextCollectionWarp>, h?: CreateElement): VNode | VNode[];
export declare function react2Vue(reactComponent: any): new (...args: any[]) => import("vue/types/vue").CombinedVueInstance<{
    $allContext: Record<string, any>;
} & Vue, object, object, object, Record<never, any>>;
