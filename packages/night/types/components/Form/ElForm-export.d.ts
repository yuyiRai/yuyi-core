import * as React from 'react';
import { FormStore } from '../../stores/FormStore';
export declare class RItemGroup extends React.Component<any, any> {
    render(): JSX.Element;
}
export declare const ElItemGroup: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
export declare class RCommonForm extends React.Component<any, any> {
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
    store: FormStore;
    getStoreRef({ formStore }: {
        formStore: FormStore;
    }): void;
    render(): JSX.Element;
}
export declare const ElCommonForm2: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
//# sourceMappingURL=ElForm-export.d.ts.map