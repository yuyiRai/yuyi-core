import { getDebugName } from 'mobx';
export declare class AsyncLoadProperty<V = any> {
    type: any;
    defaultValue: V;
    currentValue: V;
    lastParam: any;
    loading: boolean;
    isInited: boolean;
    getterFunc: Function;
    timeBuffer: number;
    emitter: any;
    constructor(type: any, getter: any, defaultValue?: V, timeBuffer?: number);
    getValue: (param: any) => V;
    reset(nextDefaultValue: V, force?: boolean): this;
    updateValue(nextValue: V): Promise<void>;
    registerGetter(getter: any): void;
    readonly valueGetter: ((param: unknown) => void) & import("mobx").IAction;
    loadingStart(): void;
    loadingEnd(): void;
    isTypedValue(value: any): any;
}
declare const asyncPropertyNameKey = "__$$$AsyncPropertyName";
declare const asyncPropertyName = "__$$$AsyncProperty";
export declare type AsyncProperty<V> = V & {
    [asyncPropertyNameKey]: string;
    [asyncPropertyName]: AsyncLoadProperty<V>;
};
export declare type AsyncComputedConfig<V> = {
    type: any;
    defaultValue: V;
    watcher: any;
    time: number;
};
/**
 * @return { PropertyDecorator }
 */
export declare function asyncComputed<V = any>({ type, defaultValue, watcher, time }: AsyncComputedConfig<V>): PropertyDecorator;
export declare class AsyncPropertyGetter {
    name: string;
    t: any;
    readonly tt: any;
    get(t: any, key: string): string;
}
export declare const AsyncPropertyDebugger: {
    AsyncPropertyGetter: typeof AsyncPropertyGetter;
    getDebugName: typeof getDebugName;
};
export {};
