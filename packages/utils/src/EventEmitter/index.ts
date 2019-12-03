/**
 * @module UtilClass
 */
import { Subscription } from 'rxjs/internal/Subscription';
import { share } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';


export { Subscription } from 'rxjs/internal/Subscription';
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
  public constructor(next?: NextEvent<EventType>, error?: ErrorEvent<EventType>, complete?: CompletedEvent<EventType>) {
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
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    if (!this.closed) {
      this.complete();
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
    return new Promise(r => {
      const sub = this.subscribe(data => {
        r(data);
        sub.unsubscribe()
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
