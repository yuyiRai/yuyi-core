import { VNode } from 'vue';
import { IKeyValueMap } from 'mobx';
import { IReactComponent } from 'mobx-react';
export declare const SlotUtils: () => {
    getReactElementFromVNode: (nodeFactory: IKeyValueMap<Function | VNode[]>) => any;
    react2Vue: (Target: IReactComponent<any>) => {
        functional: boolean;
        render(h: any, vueProps: any): any;
    };
    slotInject: typeof slotInject;
    slotInjectContainer: typeof slotInjectContainer;
    useSlots: typeof useSlots;
};
export declare const VueProvider: {
    template: string;
    name: string;
    props: string[];
    inject: {
        a: {
            default: number;
        };
    };
    provide(): {
        a: {
            provide: number;
        };
    };
};
export declare const react2Vue: (Target: IReactComponent<any>) => {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare function slotInject<T extends IReactComponent<any>>(target: T): T;
export declare function slotInjectContainer<T extends IReactComponent<any>>(target: T): T;
export declare function useSlots(target: any, propertyName: string): void;
