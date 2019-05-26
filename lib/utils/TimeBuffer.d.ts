import { EventEmitter } from './EventEmitter';
export declare const testGroup: {
    shareTest(...data: any[]): void;
};
export declare type CallbackFunction<V> = (args?: V[]) => void;
export declare type TimeBufferConfig<V> = [EventEmitter<V>, Promise<V[]>, number];
/**
 * 创建一个简单的时间缓冲Promise
 * @param { number } time 缓冲时间
 * @param { boolean } isDeepDiff
 * @param { function } callback
 * @param { EventEmitter } emitter
 */
export declare function simpleTimeBuffer<V = any>(time: number, isDeepDiff: boolean, callback: CallbackFunction<V>, emitter?: EventEmitter<V>): TimeBufferConfig<V>;
declare global {
    interface Window {
        ___timeBufferList: Map<any, any>;
        ___timeBufferValueMap: WeakMap<any, any>;
    }
}
/**
 *
 * @param {*} key 关键字类型
 * @param {*} value 值
 * @param {function} callback 回调
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
export declare function simpleTimeBufferInput<K extends object, V = any>(key: K, value: V, callback: CallbackFunction<V>, time: number, isDeepDiff?: boolean): Promise<any>;
/**
 *
 * @param {function} callback 回调
 * @param {*} instance
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
export declare function createSimpleTimeBufferInput<K extends object = Window, V = any>(callback: CallbackFunction<V>, instance: K, time: number, isDeepDiff?: boolean): (value: V) => Promise<any>;
/**
 *
 * @param { number } time
 */
export declare function timebuffer(time: number, mode?: string): (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare function logger<P extends Array<any> = any[]>(name?: string, time?: boolean): (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
declare const _default: {
    shareTest(...data: any[]): void;
    timebuffer: typeof timebuffer;
    logger: typeof logger;
    simpleTimeBuffer: typeof simpleTimeBuffer;
    simpleTimeBufferInput: typeof simpleTimeBufferInput;
    createSimpleTimeBufferInput: typeof createSimpleTimeBufferInput;
};
export default _default;
