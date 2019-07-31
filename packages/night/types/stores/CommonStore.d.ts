import { IArrayChange, IArraySplice, IArrayWillChange, IArrayWillSplice, IAutorunOptions, IComputedValue, IInterceptor, IKeyValueMap, IMapDidChange, IMapWillChange, IObjectDidChange, IObjectWillChange, IObservableArray, IObservableValue, IReactionDisposer, IReactionOptions, IReactionPublic, ISetDidChange, ISetWillChange, IValueDidChange, IValueWillChange, Lambda, ObservableMap, ObservableSet } from "mobx";
declare function exportWith(exportWith: <M extends object>(value: M[typeof key], key: keyof M, next: any, instance: M) => void): <M extends object>(instance: M) => ExportedFormModel<M>;
export declare const ExportUtils: {
    exportWith: typeof exportWith;
    export: <M extends object>(instance: M) => ExportedFormModel<M>;
    shadowExport: <M extends object>(instance: M) => ExportedFormModel<M>;
};
export declare type FlowFunction<This, R, Arg1, Arg2, Arg3, Arg4, Arg5> = (this: This, arg1?: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4, arg5?: Arg5) => IterableIterator<R>;
export declare abstract class CommonStore<M = any> {
    name: string | undefined;
    uuid: string;
    commonInstance: IKeyValueMap<{}>;
    protected readonly $storeKey: string;
    private destorySet;
    constructor();
    protected postInit(): void;
    private $eventList;
    private setEventList;
    private readonly $eventStore;
    $on(eventName: string, callback: Function, instance?: any): boolean;
    $emit(eventName: string, ...args: any[]): boolean;
    reaction<T>(source: (r: IReactionPublic) => T, callback: (arg: T, r: IReactionPublic) => void, options?: IReactionOptions): IReactionDisposer;
    onceReaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    autorun(view: (r: IReactionPublic) => any, opts?: IAutorunOptions): IReactionDisposer;
    observe<T>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): Lambda;
    observe<T>(observableArray: IObservableArray<T>, listener: (change: IArrayChange<T> | IArraySplice<T>) => void, fireImmediately?: boolean): Lambda;
    observe<V>(observableMap: ObservableSet<V>, listener: (change: ISetDidChange<V>) => void, fireImmediately?: boolean): Lambda;
    observe<K, V>(observableMap: ObservableMap<K, V>, listener: (change: IMapDidChange<K, V>) => void, fireImmediately?: boolean): Lambda;
    observe<K, V>(observableMap: ObservableMap<K, V>, property: K, listener: (change: IValueDidChange<V>) => void, fireImmediately?: boolean): Lambda;
    observe(object: Object, listener: (change: IObjectDidChange) => void, fireImmediately?: boolean): Lambda;
    observe<T, K extends keyof T>(object: T, property: K, listener: (change: IValueDidChange<T[K]>) => void, fireImmediately?: boolean): Lambda;
    protected registerDisposer<T extends Lambda | IReactionDisposer>(r: T): T;
    intercept<T>(value: IObservableValue<T>, handler: IInterceptor<IValueWillChange<T>>): Lambda;
    intercept<T>(observableArray: IObservableArray<T>, handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>): Lambda;
    intercept<K, V>(observableMap: ObservableMap<K, V>, handler: IInterceptor<IMapWillChange<K, V>>): Lambda;
    intercept<V>(observableMap: ObservableSet<V>, handler: IInterceptor<ISetWillChange<V>>): Lambda;
    intercept<K, V>(observableMap: ObservableMap<K, V>, property: K, handler: IInterceptor<IValueWillChange<V>>): Lambda;
    intercept(object: Object, handler: IInterceptor<IObjectWillChange>): Lambda;
    intercept<T extends Object, K extends keyof T>(object: T, property: K, handler: IInterceptor<IValueWillChange<any>>): Lambda;
    flow<R, Arg1, Arg2, Arg3, Arg4, Arg5>(generator: FlowFunction<this, R, Arg1, Arg2, Arg3, Arg4, Arg5>): FlowFunction<this, R, Arg1, Arg2, Arg3, Arg4, Arg5>;
    interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): Lambda | void;
    protected destoryFlag: boolean;
    destory(): this;
    protected cloneFormMapToObjWithKeys<T extends object>(map: ObservableMap<keyof T, T[keyof T]>, codes: string[]): T;
    protected mapToDiff<T extends object>(map: ObservableMap<any>, source: T, cahce?: T, deepClone?: boolean): ObservableMap<any, any>;
    objectToDiff(obj: any, source: any): any;
    registerKey(target: any, key: string, deep?: boolean): boolean;
    /**
     * 注册一个deep get属性
     * @param target 目标对象
     * @param key 属性键名
     * @param getter getter方法
     * @param isComputed 是否使用@computed，传递字符串可以作为computed的name
     */
    registerGet(target: any, key: string, getter: (resolver?: string, deepResolver?: string) => any, isComputed?: boolean | string): void;
    safeGet(path: string, defaultValue?: any): any;
    readonly propertyNameList: string[];
    export(): ExportedFormModel<M>;
    shadowExport(): ExportedFormModel<M>;
}
export declare type ExportedFormModel<T> = Partial<T> & {
    __isExportObject: true;
};
export {};
//# sourceMappingURL=CommonStore.d.ts.map