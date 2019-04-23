import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
export class EventEmitter extends Observable {
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
    emit(value) {
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
                sub.unsubscribe();
            });
        });
    }
}
//# sourceMappingURL=EventEmitter.js.map