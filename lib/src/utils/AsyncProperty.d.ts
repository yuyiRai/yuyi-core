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
    reset(nextDefaultValue: V, force: boolean): this;
    updateValue(nextValue: V): Promise<void>;
    registerGetter(getter: any): void;
    readonly valueGetter: ((param: {}) => void) & import("mobx").IAction;
    loadingStart(): void;
    loadingEnd(): void;
    isTypedValue(value: any): any;
}
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
