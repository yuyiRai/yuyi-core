import { values } from 'lodash';
import { EventEmitter } from './EventEmitter';
import { HttpBox } from './HttpBox';
import { IKeyValueMap } from 'mobx';
declare global {
    interface Object {
        values: typeof values;
    }
}
export declare function jsxIf(bool: any, when: any, elseValue?: any): any;
declare const _default: {
    jsxIf: typeof jsxIf;
    stubArray: () => any[];
    stubFunction(...args: any[]): void;
    stubObject(): {};
    /**
     * cast computed
     * @param {*} functionOrValue
     * @param  {...any} computedArgs 计算用参数
     */
    castComputed<T>(functionOrValue: T extends Function ? T : any, ...computedArgs: any[]): any;
    castFunction(value: any): (...args: any[]) => any;
    castString(value: any): string;
    argShifter(todoFunc: any, startIndex?: number): (...args: any[]) => any;
    modelValidator<T>(fieldName: any, validator: any): (model: T) => any;
    getTestArray(length: number): any[];
    arrayMap(array: any[], iteratee: any): any[];
    arrayMap2(array: any[], iteratee: any): any[];
    arrayMap3(array: any[], iteratee: any): any[];
    arrayMapDive(array: any[], iteratee: any): any[];
    arrayMapToKeysDive(array: any[], key: any): any[];
    arrayForEachDive(array: any[], iteratee: any): void;
    arrayPush(array: any[], values: any[]): any[];
    arrayPushDive(arrayTarget: any[], array: any[]): void;
    arrayFilter(array: any[], predicate: any): any[];
    arrayFilterDive(array: any[], iteratee: any): any[];
    validateModelField(model: any, fieldName: any, validator: any): any;
    castArray(value: any, allowEmpty?: boolean): any[];
    castObjectArray(objOrArr: any[], allowEmpty?: boolean): any[];
    createGroupWith<T = any>(list: T[], keyOrWith: string | ((item: T) => string)): IKeyValueMap<T[]>;
    getEventEmitter(): EventEmitter<any>;
    waitingPromise<V = any>(time: number, emitValue?: any, isError?: boolean): Promise<V>;
    /**
     * 组件返回
     * @param { { $router: any, $route: any } } instance
     * @param {*} params
     * @param { boolean } isConfirm 是否是经过确认的离开
     */
    pathReturn(instance: any, params: any, isConfirm: any, useBack: any): any;
    HttpBox: typeof HttpBox;
    testEmitter: EventEmitter<any>;
    last: <T>(array: ArrayLike<T>) => T;
    cloneDeep: <T>(value: T) => T;
    toArray: {
        <T>(value: ArrayLike<T> | import("lodash").Dictionary<T> | import("lodash").NumericDictionary<T>): T[];
        <T>(value: T): T[keyof T][];
        (): any[];
    };
    toString: (value: any) => string;
    isEqual<A = any, B = any>(valueA: any, valueB: any, noStrict?: boolean): boolean;
    reduce: {
        <T, TResult>(collection: T[], callback: import("lodash").MemoListIterator<T, TResult, T[]>, accumulator: TResult): TResult;
        <T, TResult>(collection: ArrayLike<T>, callback: import("lodash").MemoListIterator<T, TResult, ArrayLike<T>>, accumulator: TResult): TResult;
        <T extends object, TResult>(collection: T, callback: import("lodash").MemoObjectIterator<T[keyof T], TResult, T>, accumulator: TResult): TResult;
        <T>(collection: T[], callback: import("lodash").MemoListIterator<T, T, T[]>): T;
        <T>(collection: ArrayLike<T>, callback: import("lodash").MemoListIterator<T, T, ArrayLike<T>>): T;
        <T extends object>(collection: T, callback: import("lodash").MemoObjectIterator<T[keyof T], T[keyof T], T>): T[keyof T];
    };
    forEach: {
        <T>(collection: T[], iteratee?: import("lodash").ArrayIterator<T, any>): T[];
        (collection: string, iteratee?: import("lodash").StringIterator<any>): string;
        <T>(collection: ArrayLike<T>, iteratee?: import("lodash").ListIterator<T, any>): ArrayLike<T>;
        <T extends object>(collection: T, iteratee?: import("lodash").ObjectIterator<T, any>): T;
        <T, TArray extends T[]>(collection: TArray & T[], iteratee?: import("lodash").ArrayIterator<T, any>): TArray;
        <TString extends string>(collection: TString, iteratee?: import("lodash").StringIterator<any>): TString;
        <T, TList extends ArrayLike<T>>(collection: TList & ArrayLike<T>, iteratee?: import("lodash").ListIterator<T, any>): TList;
        <T extends object>(collection: T, iteratee?: import("lodash").ObjectIterator<T, any>): T;
    };
    concat: <T>(array: import("lodash").Many<T>, ...values: import("lodash").Many<T>[]) => T[];
    escapeRegExp: (string?: string) => string;
};
export default _default;
