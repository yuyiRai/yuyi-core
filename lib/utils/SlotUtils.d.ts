import { IReactComponent } from 'mobx-react';
import React from 'react';
export declare const SlotUtils: () => {
    react2Vue: (Target: IReactComponent<any>) => {
        functional: boolean;
        render(h: any, vueProps: any): any;
    };
    slotInjectContainer: typeof slotInjectContainer;
    Slot: React.FunctionComponent<{
        [k: string]: any;
        name: string;
        slot?: IReactComponent<any>;
    }>;
};
export interface ISlotSource {
    factoryProps?: any;
    slotFactory: any;
}
export interface ISlotProps {
    slot: ISlotSource;
}
export declare class SlotComponent extends React.PureComponent<ISlotProps> {
    render(): JSX.Element;
}
export declare const react2Vue: (Target: IReactComponent<any>) => {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare const SlotContext: React.Context<{
    slots: any;
    scopedSlots: any;
}>;
export declare function slotInjectContainer<T extends IReactComponent<any>>(target: T): T;
export declare const Slot: React.FunctionComponent<{
    name: string;
    slot?: IReactComponent;
    [k: string]: any;
}>;
export declare const ScopedSlot: React.FunctionComponent<{
    name: string;
    [k: string]: any;
}>;
