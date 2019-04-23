/* eslint-disable */
import { Observable } from 'rxjs';
import { share, filter } from 'rxjs/operators';
import { autobind } from 'core-decorators';

export default class EventEmitter extends Observable {
  constructor(next, error, completed) {
    super();
    this.source = new Observable((observer) => {
      this.observer = observer;
    }).pipe(share());
    if (next) {
      this.sub = this.source.subscribe(next, error, completed);
    }
  }
  /**
   * 发射值
   * @param value
   */
  emit(value = this.lastValue) {
    if (this.observer) {
      this.observer.next(value);
      this.lastValue = value;
    }
  }
  /**
   * 发射单一值
   * @param value
   */
  once(value) {
    this.emit(value);
    this.dispose();
    this.lastValue = value;
  }
  error(error) {
    if (this.observer) {
      this.observer.error(error);
    }
  }
  /**
   * 注销
   */
  dispose() {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    if (this.observer && !this.observer.closed) {
      this.observer.complete();
      this.observer = null;
    }
    if (this.source) {
      this.source = null;
    }
    // console.log(this.sub)
  }
  /**
   * 设置条件注销
   * @param emit 条件obs，发射任意值即注销
   */
  takeUntil(emit) {
    emit.subscribe(this.dispose);
    return this;
  }
  getLastValue() {
    return this.lastValue;
  }

  toPromise() {
    return new Promise(r => {
      const sub = this.subscribe(data => {
        r(data);
        sub.unsubscribe()
      })
    })
  }
}

export { EventEmitter }

export const onDestory = (before = () => { }) => {
  let emitter = new EventEmitter()
  const dispose = () => {
    emitter.dispose()
    emitter = null
  }
  emitter.subscribe(() => {
    before();
    dispose()
  })
  return [
    emitter,
    dispose
  ]
}

/**
 * 
 * @param {*} init 
 * @param {*} distory 
 */
export function SimpleMixin({ init, destory = (() => { }) }) {
  return ({
    data() {
      return { onDestory: null, }
    },
    created() {
      init ? init.call(this) : null;
      const [emitter] = new onDestory(() => destory.call(this))
      this.onDestory = emitter
    },
    beforeDestroy() {
      console.log("*****************************************", this)
      this.onDestory.emit(true);
      this.onDestory = null;
      for (let i in this) {
        if (this[i] instanceof EventEmitter) {
          this[i].dispose();
          delete this[i]
        }
      }
    },
  })
}