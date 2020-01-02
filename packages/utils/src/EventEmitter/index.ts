/**
 * @module UtilClass
 */
import { PartialObserver } from 'rxjs';
import { Observable } from 'rxjs/internal/observable';
import { Subject } from 'rxjs/internal/Subject';
// @ts-ignore
import { Subscription } from 'rxjs/internal/Subscription';
import { share } from 'rxjs/operators';
import { Constant$ } from '../Constransts';

export type Subscription = InstanceType<typeof Subscription>;
// export { Subscription } from 'rxjs/internal/Subscription';

export namespace Observable$$ {
  export function subscribe$$<T>(source: Observable<T>, observer?: PartialObserver<T>): Subscription;
  export function subscribe$$<T>(source: Observable<T>, next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
  export function subscribe$$<T>(source: Observable<T>, ...observer: any[]) {
    return source.subscribe(...observer)
  }
  export function unsubscribe$$(source: Subscription) {
    source.unsubscribe()
  }
}

const { subscribe$$, unsubscribe$$ } = Observable$$
const { CREATE_PROMISE } = Constant$

/**
 * @internal
 */
type NextEvent<EventType> = (value: EventType) => void;
/**
 * @internal
 */
type ErrorEvent<EventType> = (error: any) => void;
/**
 * @internal
 */
type CompletedEvent<EventType> = () => void;

/**
 * 事件发射器
 * 
 * 订阅事件 见{@link rxjs#Subscribable}.subscribe()
 *
 * 发射事件 见{@link EventEmitter.emit | emit()}
 *
 * 销毁 见{@link EventEmitter.dispose | dispose()}
 * 
 * @typeParam EventType - 事件类型
 * @beta 1.2.2
 * @noInheritDoc
 */
export class EventEmitter<EventType = any> extends Subject<EventType> {
  private sub: Subscription | null;
  private lastValue: EventType | null;

  /**
   * 实例化EventEmitter
   * @param next 订阅事件方法
   * @param error 订阅错误事件方法
   * @param complete 订阅completed事件方法
   */
  constructor(next?: NextEvent<EventType>, error?: ErrorEvent<EventType>, complete?: CompletedEvent<EventType>) {
    super();
    this.pipe(share());
    if (next) {
      this.sub = this.subscribe({
        next,
        error,
        complete
      });
    }
  }
  // /** 
  //  * {@inheritDoc (EventEmitter:class).constructor}
  //  */
  // public subscribe(observer?: PartialObserver<EventType>): Subscription;
  // public subscribe(next: null, error: null, complete: () => void): Subscription;
  // public subscribe(next: null, error: (error: any) => void, complete?: () => void): Subscription;
  // public subscribe(next?: (value: EventType) => void, error?: (error: any) => void, complete?: () => void): Subscription;


  /**
   * 发射值
   * @param value
   */
  public emit(value: EventType) {
    this.next(value);
    this.lastValue = value;
  }
  /**
   * 发射一个事件后立即销毁监听器
   * @param value
   */
  public once(value: EventType) {
    this.emit(value);
    this.dispose();
    this.lastValue = value;
  }

  /**
   * 注销
   */
  public dispose() {
    var _this = this;
    if (_this.sub && !_this.sub.closed) {
      _this.sub.unsubscribe();
      _this.sub = null;
    }
    if (!_this.closed) {
      _this.complete();
    }
  }
  /**
   * 设置条件注销
   * @param emit 条件observable，发射任意值即注销
   */
  public takeUntil(emit: Observable<any>) {
    emit.subscribe(this.dispose);
    return this;
  }

  /**
   * 取得最后发射的值
   */
  public getLastValue() {
    return this.lastValue;
  }

  /**
   * 转化成标准Promise
   */
  public toPromise() {
    return CREATE_PROMISE(r => {
      const sub = subscribe$$(this, data => {
        r(data);
        unsubscribe$$(sub)
      })
    })
  }
  static create() {
    return new EventEmitter()
  }
  static is(target: any): target is EventEmitter {
    return target instanceof EventEmitter
  }
}

export const getEventEmitter = EventEmitter.create
