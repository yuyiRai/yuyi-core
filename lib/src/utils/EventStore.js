"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = require("src/utils/EventEmitter");
const core_decorators_1 = require("core-decorators");
const operators_1 = require("rxjs/operators");
const lodash_1 = require("lodash");
const _1 = __importDefault(require("."));
;
// @staticImplements<IEventStoreStatic>()
class EventStore extends EventEmitter_1.EventEmitter {
    constructor(eventNames) {
        super();
        // public static injectedValidEventNames: string[];
        this.eventNames = [];
        this.eventNames = eventNames;
    }
    /**
     * 是否是合法事件名
     * @param {string} eventName
     */
    isValidEventName(eventName) {
        return this.eventNames.includes(eventName);
    }
    /**
     * 发送事件
     * @param {string} eventName 事件名
     * @param {string[]} args 参数
     */
    $emit(eventName, ...args) {
        console.log('log $emit', this.eventNames.includes(eventName), eventName, ...args);
        if (this.eventNames.includes(eventName)) {
            this.emit({
                type: eventName,
                args
            });
            return true;
        }
        return false;
    }
    /**
     * 监听事件
     * @param {string} eventName 事件名
     * @param {(...args, event) => void} callback 事件名
     */
    $on(eventName, callback) {
        if (this.eventNames.includes(eventName)) {
            this.pipe(operators_1.filter(({ type }) => type === eventName)).subscribe((e) => callback(...e.args, e));
            return true;
        }
        return false;
    }
}
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStore.prototype, "isValidEventName", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventStore.prototype, "$emit", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], EventStore.prototype, "$on", null);
exports.EventStore = EventStore;
const fake = { $emit() { }, $on() { } };
/**
 * @param { string[] } eventNames
 * @param { {[key: string]: Function} } extendTarget
 */
function EventStoreInject(eventNames, extendTarget) {
    const allowExtendKey = lodash_1.reduce(extendTarget, function (r, t, key) {
        return _1.default.isArray(t.injectedValidEventNames)
            ? lodash_1.assign(r, {
                [key]: lodash_1.filter(eventNames, function (eName) {
                    return t.injectedValidEventNames.includes(eName);
                })
            })
            : r;
    }, {});
    return function (target) {
        Object.defineProperty(target, 'injectedValidEventNames', {
            value: eventNames,
            enumerable: true,
            writable: false
        });
        Object.defineProperty(target.prototype, '__getEventListenersHooks', {
            value: function (validEventNames, allowExtendKey, force) {
                if (!this.$__event__store && !force) {
                    return fake;
                }
                if (force && !this.$__event__store) {
                    Object.defineProperty(this, '$__event__store', {
                        get() {
                            if (!this.$__event__store__core) {
                                Object.defineProperty(this, '$__event__store__core', {
                                    value: new EventStore(validEventNames),
                                    enumerable: false,
                                    configurable: true,
                                    writable: false
                                });
                                console.log(validEventNames, allowExtendKey);
                                lodash_1.forEach(allowExtendKey, (value, key) => {
                                    if (this[key] && this[key].$on) {
                                        lodash_1.forEach(value, name => {
                                            this[key].$on(name, (...args) => {
                                                console.log('on register', name, args);
                                                this.$emit(name, ...args);
                                            });
                                            // console.log(`this.${key}.$on('${name}', this.$emit.bind(this, '${name}'))`)
                                        });
                                    }
                                });
                            }
                            return this.$__event__store__core;
                        },
                        enumerable: false,
                        configurable: true
                    });
                }
                return this.$__event__store;
            },
            enumerable: true,
            writable: false
        });
        Object.defineProperty(target.prototype, '$on', {
            get() { return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey, true).$on; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(target.prototype, '$emit', {
            get() {
                return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey).$emit;
            },
            enumerable: true,
            configurable: true
        });
        return target;
    };
}
exports.EventStoreInject = EventStoreInject;
//# sourceMappingURL=EventStore.js.map