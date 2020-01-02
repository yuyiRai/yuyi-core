import { autobind } from 'core-decorators';
import produce, { Draft } from 'immer';
import { createTransformer, ITransformer } from 'mobx-utils';
import { isEqual } from '../LodashExtra';
import { createSimpleTimeBufferInput } from '../TimeBuffer';
import { expect$ } from '../TypeLib';
import { CommonStore } from './CommonStore';
import { action, computed, $get as get, observable, $set as set, toJS } from './mobx.export';
import { IObservableArray, IReactionDisposer, Lambda } from 'mobx';

export class List<T = any, TT = T> extends CommonStore<any, List.EventKeys> {
  @observable.shallow
  private originalList: IObservableArray<T>;

  @observable
  public transformList: IObservableArray<TT> = observable.array([], { name: 'transform list', deep: true });

  @observable
  private customTransformer: ITransformer<T, TT>;

  private keyList = []
  @observable.ref private strict = false
  constructor(list?: T[], transformer?: ITransformer<T, TT>, strict: boolean = true) {
    super()
    this.strict = strict
    this.setList(list)
    this.setTransformer(transformer)
    this.setWatcher()
  }
  @action
  public setList(list?: T[]) {
    this.originalList = observable.array<T>(expect$.isArray.filter(list) || [], { name: 'original list', deep: true })
  }

  /**
   * 当数组成员变更
   * @param response 
   */
  @autobind
  @action
  public onChangeResponse([orginItem, index]: [T, number]): boolean {
    // console.log('onChangeResponse', index)
    if (!isEqual(this.lastSnapshots[index], orginItem, true)) {
      this.$emit('array-changed', index, orginItem, this.lastSnapshots[index]);
      // console.error('array-changed')
      set(this.transformList, index, expect$.isNil(orginItem) ? undefined : this.customTransformer(orginItem))
      this.lastSnapshots[index] = this.getOriginalValue(index)
      return true
    }
    return false
  }

  @observable.ref 
  private watcherList: (IReactionDisposer | Lambda)[] = []

  @computed.struct 
  public get watcherLength() {
    return this.watcherList.length
  }

  @observable.ref lastSnapshots: T[] = []
  @action
  public setWatcher() {
    return this.reaction(() => this.originalList.length, length => {
      // console.log('this.originalList.length', length)
      /**
       * 保持数组长度和监听器数组一致
       */
      while (this.watcherList.length > length) {
        this.watcherList.pop()()
        this.keyList.pop()
        this.transformList.pop()
      }

      /**
       * 扩展监听器
       */
      while (this.watcherList.length < length) {
        const index = this.watcherList.length
        /**
         * 根据严格模式判断是否使用时间缓冲流
         */
        const callback = this.strict 
        ? (i: T) => this.onChangeResponse([i, index])
        : this.keyList.push({ index: this.keyList.length }) > -1 
            && createSimpleTimeBufferInput((resList: T[]) => {
              return this.onChangeResponse([resList[resList.length - 1], index])
            }, this.keyList[this.watcherList.length], 0, false)
        // 绑定缓冲流需要一个keyList作为识别标志

        // console.log('push reaction', index, length)
        this.watcherList.push(this.reaction(
          () => toJS(get(this.originalList, index)),
          callback, 
          { fireImmediately: true }
        ))
      }
    }, { fireImmediately: true });
  }

  @action
  public setTransformer(transformer?: ITransformer<T, TT>) {
    this.customTransformer = createTransformer(expect$.isFunction.filter(transformer) || ((i: T) => i) as any)
  }

  @computed.struct
  public get first() {
    return get(this.transformList, 0);
  }
  @computed.struct
  public get last() {
    return get(this.transformList, this.transformList.length-1);
  }
  @action
  public push(...i: T[]) {
    this.originalList.push(...i);
  }
  @action
  public pop() {
    return this.originalList.pop();
  }

  @action
  public set<D = Draft<T>>(index: number, i: T | ((i: D) => D)): T | false {
    const item = this.getOriginal(index)
    if (expect$.isFunction(i)) {
      return this.update(index, i)
    } else if (!isEqual(item, i, true)) {
      set(this.originalList, index, i);
      return this.getOriginal(index)
    }
    return false;
  }
  @action update<D = Draft<T>>(index: number, i: (i: D) => D): T | false {
    const item = this.getOriginal(index)
    const value: { item: T } = { item: toJS(item) }
    const { item: nextItem } = produce(value, (value: { item: D }) => {
      value.item = i(value.item)
    })
    if (item !== nextItem) {
      set<T>(this.originalList, index, nextItem)
      return this.getOriginal(index)
    }
    return false
  }

  /**
   * 取对应下标值（观察者下）
   * @param index 
   */
  public get(index: number): TT | null | undefined;
  /**
   * 取对应下标值（观察者下）
   * @param index 
   * @param defaultValue 为null|undefined时提供默认值
   * @param originalDefaultType 提供的默认值是否为原始类型
   */
  public get(index: number, defaultValue?: T | TT, originalDefaultType?: boolean): TT;

  @action
  public get(index: number, defaultValue?: T | TT, originalDefaultType: boolean = true): TT {
    const transValue = get(this.transformList, index)
    if (expect$.isNil(transValue) && !expect$.isNil(defaultValue)) {
      return originalDefaultType ? this.customTransformer(defaultValue as T) : (defaultValue as TT)
    }
    return transValue
  }

  /**
   * 取对应下标值（纯净值）
   * @param index 
   */
  public getValue(index: number, defaultValue?: TT, originalDefaultType: boolean = true): TT {
    return toJS(this.get(index, defaultValue, originalDefaultType))
  }

  /**
   * 取对应下标值（观察者下）
   * @param index 
   */
  public getOriginal(index: number): T | null | undefined;
  /**
   * 取对应下标值（观察者下）
   * @param index 
   * @param defaultValue 为null|undefined时提供默认值
   * @param autobind 是否在无值时自动使用默认值初始化下标
   */
  public getOriginal(index: number, defaultValue?: T, autobind?: boolean): T;
  @action
  public getOriginal(index: number, defaultValue?: T, autobind: boolean = false): T {
    const getter = get(this.originalList, index)
    if (expect$.isNil(getter) && !expect$.isNil(defaultValue)) {
      if (autobind) {
        this.set(index, defaultValue)
        return this.getOriginal(index)
      }
      return defaultValue
    }
    return getter
  }

  /**
   * 取得指定下标值（纯净值）
   * @param index 
   * @param defaultValue 为null|undefined时提供默认值
   */
  public getOriginalValue(index: number, defaultValue?: T): T {
    return toJS(this.getOriginal(index, defaultValue))
  }
  
}

export namespace List {
  export type EventKeys = 'array-changed'
}
