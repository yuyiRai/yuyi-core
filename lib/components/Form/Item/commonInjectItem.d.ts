import { IReactComponent, IWrappedComponent } from 'mobx-react';
export declare function commonInjectItem(target: string, ...stores: string[]): <T extends IReactComponent>(target: T) => T & (T extends IReactComponent<infer P> ? IWrappedComponent<P> : never);
export declare function commonInjectItem<T extends IReactComponent>(target: T): T & (T extends IReactComponent<infer P> ? IWrappedComponent<P> : never);
