import { autobind, nonenumerable } from 'core-decorators';
import { flow, IArrayChange, IArraySplice, IArrayWillChange, IArrayWillSplice, IAutorunOptions, IComputedValue, IInterceptor, IMapDidChange, IMapWillChange, intercept, IObjectDidChange, IObjectWillChange, IObservableArray, IObservableValue, IReactionDisposer, IReactionOptions, IReactionPublic, ISetDidChange, ISetWillChange, isObservableProp, IValueDidChange, IValueWillChange, Lambda } from "mobx";
import { uuid } from '../CustomUtils';
import { cloneDeep, difference, forEach, get, isEqual, isFunction, isNil, isObject, keys, set, stubFunction, unset } from '../LodashExtra';
import { expect$ } from '../TypeLib';
import { action, autorun, computed, observable, ObservableMap, ObservableSet, observe, reaction, toJS } from "./mobx.export";
import { BaseStore } from './BaseStore';


function exportWith(exportWith: <M extends object>(value: M[typeof key], key: keyof M, next: any, instance: M) => void) {
  return function <M extends object>(instance: M): ExportedFormModel<M> {
    const model: any = {}
    for (const key in instance) {
      exportWith(instance[key], key, model, instance)
    }
    model.__isExportObject = true;
    return model;
  }
}
export const ExportUtils = {
  exportWith,
  export: exportWith(function (value, key, next) {
    next[key] = cloneDeep(toJS(value))
  }),
  shadowExport: exportWith(function (value, key, next) {
    if (isObject(value)) {
      next[key] = {}
    } else if (isFunction(value)) {
      // if (key === 'setOptions'){
      //   debugger
      // }
      next[key] = stubFunction;
    }
  })
}
export type FlowFunction<This, R, Arg1, Arg2, Arg3, Arg4, Arg5> = (this: This, arg1?: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4, arg5?: Arg5) => IterableIterator<R>


export abstract class CommonStore<StoreModel = any, EventKeys extends string = string> extends BaseStore<EventKeys> {
  public name: string | undefined;
  public uuid: string = uuid()


  @nonenumerable
  protected get $storeKey() {
    return this.name || this.constructor.name
  }

  constructor() {
    super()
    this.postInit()
  }

  @action
  protected postInit() {
  }

  @nonenumerable
  @action('commonStore-reaction-hooks')
  public reaction<T>(source: (r: IReactionPublic) => T, callback: (arg: T, r: IReactionPublic) => void, options?: IReactionOptions): IReactionDisposer {
    return this.registerDisposer(reaction(source, callback, options))
  }

  @nonenumerable
  @action('commonStore-onceReaction-hooks')
  public onceReaction<T>(source: (r: IReactionPublic) => T, callback: (arg: T, r: IReactionPublic) => void, options?: IReactionOptions): void {
    const a = this.reaction(source, (arg: any, r: IReactionPublic) => {
      callback(arg, r);
      a();
    }, options);
  }

  @nonenumerable
  @action('commonStore-autorun-hooks')
  public autorun(view: (r: IReactionPublic) => any, opts?: IAutorunOptions): IReactionDisposer {
    return this.registerDisposer(autorun(view, opts));
  };
  observe<T>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): Lambda;
  observe<T>(observableArray: IObservableArray<T>, listener: (change: IArrayChange<T> | IArraySplice<T>) => void, fireImmediately?: boolean): Lambda;
  observe<V>(observableMap: ObservableSet<V>, listener: (change: ISetDidChange<V>) => void, fireImmediately?: boolean): Lambda;
  observe<K, V>(observableMap: ObservableMap<K, V>, listener: (change: IMapDidChange<K, V>) => void, fireImmediately?: boolean): Lambda;
  observe<K, V>(observableMap: ObservableMap<K, V>, property: K, listener: (change: IValueDidChange<V>) => void, fireImmediately?: boolean): Lambda;
  observe(object: Object, listener: (change: IObjectDidChange) => void, fireImmediately?: boolean): Lambda;
  observe<T, K extends keyof T>(object: T, property: K, listener: (change: IValueDidChange<T[K]>) => void, fireImmediately?: boolean): Lambda;

  @nonenumerable
  @action('commonStore-observe-hooks')
  public observe(a: any, b: any, c?: any, d?: any): Lambda {
    return this.registerDisposer(observe(a, b, c, d))
  }


  intercept<T>(value: IObservableValue<T>, handler: IInterceptor<IValueWillChange<T>>): Lambda;
  intercept<T>(observableArray: IObservableArray<T>, handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>): Lambda;
  intercept<K, V>(observableMap: ObservableMap<K, V>, handler: IInterceptor<IMapWillChange<K, V>>): Lambda;
  intercept<V>(observableMap: ObservableSet<V>, handler: IInterceptor<ISetWillChange<V>>): Lambda;
  intercept<K, V>(observableMap: ObservableMap<K, V>, property: K, handler: IInterceptor<IValueWillChange<V>>): Lambda;
  intercept(object: Object, handler: IInterceptor<IObjectWillChange>): Lambda;
  intercept<T extends Object, K extends keyof T>(object: T, property: K, handler: IInterceptor<IValueWillChange<any>>): Lambda;

  @nonenumerable
  @action('commonStore-intercept-hooks')
  public intercept(a: any, b: any, c?: any, ): Lambda {
    return this.registerDisposer(intercept(a, b, c));
  }

  @nonenumerable
  @action('commonStore-flow-hooks')
  public flow<R, Arg1, Arg2, Arg3, Arg4, Arg5>(
    generator: FlowFunction<this, R, Arg1, Arg2, Arg3, Arg4, Arg5>
  ): FlowFunction<this, R, Arg1, Arg2, Arg3, Arg4, Arg5> {
    return flow(generator as any) as any
  }

  @nonenumerable
  @action('commonStore-interceptProperty-hooks')
  public interceptProperty(object: any, property: string, handler: IInterceptor<IValueWillChange<any>>): Lambda | void {
    if (isObservableProp(object, property)) {
      return this.registerDisposer(intercept(object, property, handler));
    }
  }




  protected cloneFormMapToObjWithKeys<T extends object>(map: ObservableMap<keyof T, T[keyof T]>, codes: string[]): T {
    const tmp: T = {} as T
    for (const code of codes) {
      this.registerGet(tmp, code, (resolver, deepResolver) => {
        const base = map.get(resolver as keyof T)
        return deepResolver ? get(base, deepResolver) : base
      }, false)
    }
    return tmp
  }

  @action
  protected mapToDiff<T extends object>(map: ObservableMap<any>, source: T, cahce?: T, deepClone?: boolean) {
    // console.log('map', source)
    let useCahce = isObject(cahce)
    const push = difference(keys(source), Array.from(map.keys()));
    forEach(map.toJSON(), (value, key) => {
      if (isNil(source[key]) && map.has(key)) {
        // console.log('delete Key', key);
        map.delete(key)
        if (useCahce) {
          unset(cahce, key)
        }
      } else if (useCahce && !isEqual(cahce[key], source[key])) {
        // console.log('update Key', key, source[key], map.get(key));
        // debugger
        cahce[key] = cloneDeep(toJS(source[key]))
        map.set(key, source[key]);
      } else if (!useCahce && !isEqual(source[key], value)) {
        // console.log('update Key', key, source[key], map.get(key));
        map.set(key, source[key]);
      }
    });
    // console.log('map push', source)
    forEach(push, key => {
      if (useCahce) {
        cahce[key] = cloneDeep(toJS(source[key]))
        // console.log('useCahce', source[key], cahce[key])
      }
      map.set(key, source[key]);
      // console.log('add Key', key);
    });
    return map;
  }

  @action
  public objectToDiff(obj: any, source: any) {
    const push = difference(keys(source), keys(obj));
    forEach(obj, (value, key) => {
      if (isNil(source[key]))
        delete obj[key];
      else if (!isEqual(source[key], value)) {
        obj[key] = source[key];
      }
    });
    forEach(push, key => {
      obj[key] = source[key];
    });
    return obj;
  }

  @action
  public registerKey(target: any, key: string, deep: boolean = false) {
    if (!isNil(key)) {
      const keyDeep = key.split('.');
      // const coreKey = `$$core_${keyDeep[0]}`;
      const resolver = keyDeep[0]
      const defaultV = get(target, resolver, null);
      const d = (deep ? observable : observable.ref);
      d(target, resolver, { value: defaultV, enumerable: false, configurable: true });
      return true
    }
    return false
    // computed.struct(target, keyDeep[0], {
    //   get() { return get(this, coreKey) },
    //   set(value) { set(this, coreKey, value) }
    // })
    // console.log('registerKey', target, key);
  }

  /**
   * 注册一个deep get属性
   * @param target 目标对象
   * @param key 属性键名
   * @param getter getter方法
   * @param isComputed 是否使用@computed，传递字符串可以作为computed的name
   */
  @action
  public registerGet(target: any, key: string, getter: (resolver?: string, deepResolver?: string) => any, isComputed: boolean | string = true) {
    const keyDeep = key.split('.');
    const resolver = keyDeep.shift()
    const caller = isComputed ? computed({ name: expect$.isString.filter(isComputed) }) : Object.defineProperty
    // 嵌套路径单独处理
    if (keyDeep.length > 0) {
      const deepResolver = keyDeep.pop() // 弹出路径最深处的字段
      const deepBaseResolver = keyDeep.concat([resolver]).join('.') // 连接之前的路径字符串
      const deepTarget = expect$.isObject.filter(get(target, deepBaseResolver)) || {};
      caller(deepTarget, deepResolver, { get: () => getter(deepBaseResolver, deepResolver), enumerable: false, configurable: true });
      set(target, deepBaseResolver, deepTarget)
    } else {
      caller(target, resolver, { get: () => getter(resolver), enumerable: false, configurable: true });
    }
    // computed.struct(target, keyDeep[0], {
    //   get() { return get(this, coreKey) },
    //   set(value) { set(this, coreKey, value) }
    // })
    // console.log('registerKey', target, key);
  }

  @autobind public safeGet(path: string, defaultValue?: any) {
    return get(this, path, defaultValue);
  }



  public export(): ExportedFormModel<StoreModel> {
    return ExportUtils.export(this) as any
  }
  public shadowExport(): ExportedFormModel<StoreModel> {
    return ExportUtils.shadowExport(this) as any
  }
}

export type ExportedFormModel<T> = Partial<T> & {
  __isExportObject: true
}
