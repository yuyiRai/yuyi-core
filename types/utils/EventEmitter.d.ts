import { Observable } from 'rxjs/internal/Observable';
export declare type NextEvent<T> = (value: T) => void;
export declare type ErrorEvent<T> = (error: any) => void;
export declare type CompletedEvent<T> = () => void;
export declare class EventEmitter<T = any> extends Observable<T> {
    private observer;
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
    getLastValue(): T;
    toPromise(): Promise<{}>;
}
