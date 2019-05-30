import { EventStoreProvider } from '@/stores/EventStore';
import { IArrayChange, IArraySplice, IArrayWillChange, IArrayWillSplice, IAutorunOptions, IComputedValue, IInterceptor, IMapDidChange, IMapWillChange, IObjectDidChange, IObjectWillChange, IObservableArray, IObservableValue, IReactionDisposer, IReactionOptions, IReactionPublic, ISetDidChange, ISetWillChange, IValueDidChange, IValueWillChange, Lambda, ObservableMap, ObservableSet } from "mobx";
export declare const ExportUtils: {
    export: <M extends object>(object: M) => ExportedFormModel<M>;
};
export declare abstract class CommonStore<M extends CommonStore = any> extends EventStoreProvider {
    private destorySet;
    reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): IReactionDisposer;
    onceReaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    autorun(view: (r: IReactionPublic) => any, opts?: IAutorunOptions): void;
    observe<T>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): Lambda;
    observe<T>(observableArray: IObservableArray<T>, listener: (change: IArrayChange<T> | IArraySplice<T>) => void, fireImmediately?: boolean): Lambda;
    observe<V>(observableMap: ObservableSet<V>, listener: (change: ISetDidChange<V>) => void, fireImmediately?: boolean): Lambda;
    observe<K, V>(observableMap: ObservableMap<K, V>, listener: (change: IMapDidChange<K, V>) => void, fireImmediately?: boolean): Lambda;
    observe<K, V>(observableMap: ObservableMap<K, V>, property: K, listener: (change: IValueDidChange<V>) => void, fireImmediately?: boolean): Lambda;
    observe(object: Object, listener: (change: IObjectDidChange) => void, fireImmediately?: boolean): Lambda;
    observe<T, K extends keyof T>(object: T, property: K, listener: (change: IValueDidChange<T[K]>) => void, fireImmediately?: boolean): Lambda;
    private registerDisposer;
    intercept<T>(value: IObservableValue<T>, handler: IInterceptor<IValueWillChange<T>>): void;
    intercept<T>(observableArray: IObservableArray<T>, handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>): void;
    intercept<K, V>(observableMap: ObservableMap<K, V>, handler: IInterceptor<IMapWillChange<K, V>>): void;
    intercept<V>(observableMap: ObservableSet<V>, handler: IInterceptor<ISetWillChange<V>>): void;
    intercept<K, V>(observableMap: ObservableMap<K, V>, property: K, handler: IInterceptor<IValueWillChange<V>>): void;
    intercept(object: Object, handler: IInterceptor<IObjectWillChange>): void;
    intercept<T extends Object, K extends keyof T>(object: T, property: K, handler: IInterceptor<IValueWillChange<any>>): void;
    interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): void;
    destory(): this;
    protected mapToDiff<T extends object>(map: ObservableMap<any>, source: T, cahce?: T, deepClone?: boolean): ObservableMap<any, any>;
    objectToDiff(obj: any, source: any): any;
    registerKey(target: any, key: string, deep?: boolean): boolean;
    registerGet(target: any, key: string, getter: any): void;
    safeGet(path: string, defaultValue?: any): any;
    readonly propertyNameList: string[];
    export(): ExportedFormModel<M>;
}
export declare type ExportedFormModel<T> = Partial<T> & {
    __isExportObject: true;
};
