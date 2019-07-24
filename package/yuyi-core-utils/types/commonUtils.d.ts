/// <reference types="lodash" />
/**
 * @module CommonUtils
 */
import { values } from './LodashExtra';
import { EventEmitter } from './EventEmitter';
import { IFunction } from './TsUtils';
declare global {
    interface Object {
        values: typeof values;
    }
}
/**
 * @beta
 * @param bool
 * @param when
 * @param elseValue
 */
export declare function jsxIf(bool: any, when: any, elseValue?: any): any;
export declare const testEmitter: EventEmitter<any>;
export declare function argShifter(todoFunc: any, startIndex?: number): (...args: any[]) => any;
export declare function modelValidator<T>(fieldName: string, validator: RegExp | IFunction | T): (model: T) => any;
export declare function validateModelField(model: any, fieldName: any, validator: any): any;
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
//# sourceMappingURL=commonUtils.d.ts.map