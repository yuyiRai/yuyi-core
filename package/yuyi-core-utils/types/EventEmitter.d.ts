import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
declare type NextEvent<T> = (value: T) => void;
declare type ErrorEvent<T> = (error: any) => void;
declare type CompletedEvent<T> = () => void;
/**
 * @noInheritDoc
 */
export declare class EventEmitter<T = any> extends Subject<T> {
    private sub;
    private lastValue;
    constructor(next?: NextEvent<T>, error?: ErrorEvent<T>, completed?: CompletedEvent<T>);
    /**
     * 发射值
     * @param value
     */
    emit(value: T): void;
    /**
     * 发射单一值
     * @param value
     */
    once(value: T): void;
    error(error: any): void;
    /**
     * 注销
     */
    dispose(): void;
    /**
     * 设置条件注销
     * @param emit 条件obs，发射任意值即注销
     */
    takeUntil(emit: Observable<any>): this;
    /**
     * 取得最后发射的值
     */
    getLastValue(): T;
    /**
     * 转化成标准Promise
     */
    toPromise(): Promise<unknown>;
}
export default EventEmitter;
