/**
 * @module CommonUtils
 */
import { cloneDeep, concat, escapeRegExp, forEach, last, reduce, stubArray, toArray, toString, values } from 'lodash';
import { IKeyValueMap } from 'mobx';
import { EventEmitter } from './EventEmitter';
import { HttpBox } from './HttpBox';
declare global {
    interface Object {
        values: typeof values;
    }
}
export declare function jsxIf(bool: any, when: any, elseValue?: any): any;
export declare const testEmitter: EventEmitter<any>;
export declare function stubFunction(...args: any[]): void;
export declare function stubObject(): {};
/**
 * cast computed
 * @param {*} functionOrValue
 * @param  {...any} computedArgs 计算用参数
 */
export declare function castComputed<T>(functionOrValue: T extends Function ? T : any, ...computedArgs: any[]): any;
export declare function castFunction(value: any): (...args: any[]) => any;
export declare function castString(value: any): string;
export declare function argShifter(todoFunc: any, startIndex?: number): (...args: any[]) => any;
export declare function modelValidator<T>(fieldName: any, validator: any): (model: T) => any;
export declare function getTestArray(length: number): any[];
export declare function arrayMap(array: any[], iteratee: any): any[];
export declare function arrayMap2(array: any[], iteratee: any): any[];
export declare function arrayMap3(array: any[], iteratee: any): any[];
export declare function arrayMapDive(array: any[], iteratee: any): any[];
export declare function arrayMapToKeysDive(array: any[], key: any): any[];
export declare function arrayForEachDive(array: any[], iteratee: any): void;
export declare function arrayPush(array: any[], values: any[]): any[];
export declare function arrayPushDive(arrayTarget: any[], array: any[]): void;
export declare function arrayFilter(array: any[], predicate: any): any[];
export declare function arrayFilterDive(array: any[], iteratee: any): any[];
export declare function validateModelField(model: any, fieldName: any, validator: any): any;
export declare function castArray(value: any, allowEmpty?: boolean): any[];
export declare function castObjectArray(objOrArr: any[], allowEmpty?: boolean): any[];
export declare function createGroupWith<T = any>(list: T[], keyOrWith: string | ((item: T) => string)): IKeyValueMap<T[]>;
export declare function getEventEmitter(): EventEmitter<any>;
export declare function waitingPromise<V = any>(time: number, emitValue?: any, isError?: boolean): Promise<V>;
/**
 * 组件返回
 * @param instance
 * @param params
 * @param isConfirm 是否是经过确认的离开
 */
export declare function pathReturn(instance: {
    $router: any;
    $route: any;
}, params: any, isConfirm: boolean, useBack: boolean): any;
export declare function isEqual<A = any, B = any>(valueA: A | any, valueB: B | any, noStrict?: boolean): boolean;
export { HttpBox, last, cloneDeep, toArray, stubArray, toString, reduce, forEach, concat, escapeRegExp };
