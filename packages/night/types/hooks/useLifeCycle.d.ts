import { IKeyValueMap } from 'mobx';
import { IDisposer } from 'mobx-utils';
import * as React from 'react';
import { HashItemList } from './HashItemList';
export declare const RefMap: WeakMap<object, any>;
declare global {
    interface Window {
        RefMap: WeakMap<any, any>;
    }
}
export declare type SafeRef<T> = {
    value: T;
    lastValue: T;
};
/**
 * 安全useCallback
 */
export declare type SafeCallbackFactory<Store> = <Params extends HashItemList = HashItemList>(callback: ((This: Store, ...p: Params) => void), deps?: Params) => (() => void);
export declare function useForceUpdate(): () => void;
/**
 * aaaa
 */
export declare type UseSafeRefReturns<T> = [React.MutableRefObject<SafeRef<T>>, React.Dispatch<T>, SafeCallbackFactory<T>];
/**
 * 使用安全的Ref
 * @param initValue 初始化值Or初始化函数
 * @param initParamaters 初始化函数参数
 * @returns
 */
export declare function useSafeRef<T = any, P = any>(initValue?: T | ((initParamaters?: P) => T), initParamaters?: P): UseSafeRefReturns<T>;
export declare type UseRefCallbackReturns<T> = [T, (next: T) => IDisposer, SafeCallbackFactory<T>];
/**
 *
 */
export declare function useRefCallback<T>(): UseRefCallbackReturns<T>;
declare type SafeStoreOptions<T> = {
    storeRef?: UseRefCallbackReturns<T>[1];
};
declare type SafeStoreUtils<T> = {
    useCallback?: UseRefCallbackReturns<T>[2];
    useObserver<R>(fn: (store: T) => R, deps?: any[], useName?: string): R;
    useComputedChild?: (fn: (store: T) => any, deps?: any[]) => any;
};
export declare type UseSafeStoreProviderReturns<T> = [SafeStoreUtils<T>, UseSafeRefReturns<T>[0]];
export declare function useSafeStoreProvider<T extends IKeyValueMap = IKeyValueMap, P = any>(initValue: T | ((initParamaters?: P) => T), initParamaters?: P, options?: SafeStoreOptions<T>): UseSafeStoreProviderReturns<T>;
export declare function useUnmount(componentWillUnmount: () => void, deps?: readonly any[]): void;
export declare function useMountHooks<Args extends HashItemList>(mountedWithUnmount: (...args: Args) => (...args: Args) => void, deps?: Args): void;
declare type DiffCreaterHandler<T> = (nextValue: T) => any;
declare type UseDiffProp<T> = {
    last: T;
    differ: DiffCreaterHandler<T>;
};
export declare function usePropDiffer<T>(isEquals?: ((a: any, b: any) => boolean) | boolean): UseDiffProp<T>;
declare type componentWillReciveProps<T> = (nextValue: T, lastValue: T) => void | (() => any);
export declare function usePropsRecive<T = any, D extends [T, ...any[]] = [T]>(componentWillReciveProps: componentWillReciveProps<D[0]>, nextValueAndDeps: D): void;
export declare function usePropsReciveSync<T = any>(componentNextPropsRecive: componentWillReciveProps<T>, nextValue: T): void | (() => any);
export {};
//# sourceMappingURL=useLifeCycle.d.ts.map