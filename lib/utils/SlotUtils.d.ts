import React from 'react';
import { IReactComponent } from 'mobx-react';
export declare const SlotUtils: () => {
    react2Vue: (Target: IReactComponent<any>) => {
        functional: boolean;
        render(h: any, vueProps: any): any;
    };
    slotInjectContainer: typeof slotInjectContainer;
    useSlots: typeof useSlots;
};
export interface ISlotSource {
    factoryProps?: any;
    slotFactory: any;
}
export interface ISlotProps {
    slot: ISlotSource;
}
export declare class SlotComponent extends React.Component<ISlotProps> {
    render(): JSX.Element;
}
export declare const react2Vue: (Target: IReactComponent<any>) => {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare const SlotContext: React.Context<{
    slots: {};
    scopedSlots: {};
}>;
export declare function slotInjectContainer<T extends IReactComponent<any>>(target: T): T;
export declare function useSlots(target: any, propertyName: string): void;
