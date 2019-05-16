import { IReactComponent } from 'mobx-react';
import React from 'react';
import { FormStore } from './FormStore';
export declare class RItemGroup extends React.Component<any, any> {
    App: IReactComponent<any>;
    render(): JSX.Element;
}
export declare const ElItemGroup: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare class RCommonForm extends React.Component<any, any> {
    App: IReactComponent<any>;
    render(): JSX.Element;
}
export declare const ElCommonForm: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare class RCommonForm2 extends React.PureComponent<any, any> {
    state: {
        model: {};
        lastModel: {};
        lastConfig: {};
        config: any;
    };
    static getDerivedStateFromProps(nextProps: any, prevState: any): any;
    onChange(code: string, value: any): void;
    getStoreRef(store: FormStore): void;
    Inter: IReactComponent<any>;
    render(): JSX.Element;
}
export declare const ElCommonForm2: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
