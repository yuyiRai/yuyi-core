/**
 * @module UtilClass
 */
import { Subscription } from 'rxjs/internal/Subscription';
import { share } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

type NextEvent<T> = (value: T) => void;
type ErrorEvent<T> = (error: any) => void;
type CompletedEvent<T> = () => void;

/**
 * 事件发射器
 * @noInheritDoc
 * 
 */
export class EventEmitter<T = any> extends Subject<T> {
  private sub: Subscription | null;
  private lastValue: T | null;
  constructor(next?: NextEvent<T>, error?: ErrorEvent<T>, completed?: CompletedEvent<T>) {
    super();
    this.pipe(share());
    if (next) {
      this.sub = this.subscribe(next, error, completed);
    }
  }

  /**
   * 发射值
   * @param value
   */
  public emit(value: T) {
    this.next(value);
    this.lastValue = value;
  }
  /**
   * 发射单一值
   * @param value
   */
  public once(value: T) {
    this.emit(value);
    this.dispose();
    this.lastValue = value;
  }
  public error(error: any) {
    this.error(error);
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
   * @param emit 条件obs，发射任意值即注销
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
}

export default EventEmitter