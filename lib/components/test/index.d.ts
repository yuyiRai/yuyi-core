import * as React from 'react';
import { IReactComponent } from 'mobx-react';
export declare class AppTest extends React.Component<any, any> {
    state: any;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    Name0: IReactComponent<any>;
    Name1: IReactComponent<any>;
    Name2: IReactComponent<any>;
    onChange: (e: string) => void;
    render(): JSX.Element;
}
export declare const ElAppTest: {
    functional: boolean;
    render(h: any, vueProps: any): any;
};
