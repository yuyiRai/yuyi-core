import { EventEmitter } from "../utils";
import { IKeyValueMap } from "mobx";
export declare type IEventEmitter = typeof EventEmitter;
export interface IEventStoreBase {
    $emit?(eventName: string, ...args: any[]): boolean;
    $on?(eventName: string, ...args: any[]): boolean;
}
export declare class EventStoreProvider {
    $emit?(eventName: string, ...args: any[]): boolean;
    $on?(eventName: string, ...args: any[]): boolean;
}
export interface IEventStore extends IEventStoreBase, EventEmitter<any> {
    eventNames: string[];
    isValidEventName(eventName: string): boolean;
}
export declare class EventStore extends EventEmitter<any> implements IEventStore {
    eventNames: string[];
    instance: any;
    private eventMap;
    constructor(eventNames: string[], instance: any);
    /**
     * 是否是合法事件名
     * @param {string} eventName
     */
    isValidEventName(eventName: string): boolean;
    /**
     * 发送事件
     * @param {string} eventName 事件名
     * @param {string[]} args 参数
     */
    $emit(eventName: string, ...args: any[]): boolean;
    /**
     * 监听事件
     * @param {string} eventName 事件名
     * @param {(...args, event) => void} callback 事件名
     */
    $on(eventName: string, callback: Function, instance?: any): boolean;
}
export interface InjectedClass extends IEventStoreBase {
    __getEventListenersHooks?: (validEventNames: string[], allowExtendKey: IKeyValueMap, force?: boolean) => any;
}
export interface InjectedClassStatic<T> {
    new (...args: any[]): T & InjectedClass;
    injectedValidEventNames?: string[];
}
/**
 * @param { string[] } eventNames
 * @param { {[key: string]: Function} } extendTarget
 */
export declare function EventStoreInject<V = any>(eventNames: string[], extendTarget?: any): <S extends InjectedClassStatic<V & ThisType<V>>>(target: S) => S;
//# sourceMappingURL=EventStore.d.ts.map