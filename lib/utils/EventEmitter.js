"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var EventEmitter = /** @class */ (function (_super) {
    __extends(EventEmitter, _super);
    function EventEmitter(next, error, completed) {
        var _this = _super.call(this) || this;
        _this.source = new rxjs_1.Observable(function (observer) {
            _this.observer = observer;
        }).pipe(operators_1.share());
        if (next) {
            _this.sub = _this.source.subscribe(next, error, completed);
        }
        return _this;
    }
    /**
     * 发射值
     * @param value
     */
    EventEmitter.prototype.emit = function (value) {
        if (this.observer) {
            this.observer.next(value);
            this.lastValue = value;
        }
    };
    /**
     * 发射单一值
     * @param value
     */
    EventEmitter.prototype.once = function (value) {
        this.emit(value);
        this.dispose();
        this.lastValue = value;
    };
    EventEmitter.prototype.error = function (error) {
        if (this.observer) {
            this.observer.error(error);
        }
    };
    /**
     * 注销
     */
    EventEmitter.prototype.dispose = function () {
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
    };
    /**
     * 设置条件注销
     * @param emit 条件obs，发射任意值即注销
     */
    EventEmitter.prototype.takeUntil = function (emit) {
        emit.subscribe(this.dispose);
        return this;
    };
    EventEmitter.prototype.getLastValue = function () {
        return this.lastValue;
    };
    EventEmitter.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (r) {
            var sub = _this.subscribe(function (data) {
                r(data);
                sub.unsubscribe();
            });
        });
    };
    return EventEmitter;
}(rxjs_1.Observable));
exports.EventEmitter = EventEmitter;
