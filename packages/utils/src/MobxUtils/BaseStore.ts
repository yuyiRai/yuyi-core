import { nonenumerable } from 'core-decorators';
import { IReactionDisposer, Lambda } from "mobx";
import { isFunction, keys } from '../LodashExtra';
import { EventStore } from './EventStore';
import { action, computed, observable, ObservableSet, reaction, runInAction } from "./mobx.export";

export abstract class BaseStore<EventKeys extends string = string> {
  @nonenumerable
  @observable
  private destorySet: ObservableSet<IReactionDisposer | Lambda>;
  @observable
  public commonInstance: IKeyValueMap<{}>;
  constructor() {
    this.destorySet = observable.set<IReactionDisposer | Lambda>();
    this.commonInstance = {};
    // console.error('CommonStore constructor', this.$storeKey);
    let temp: EventStore<EventKeys>;
    this.setEventList();
    this.registerDisposer(reaction(() => this.$eventStore, (store: EventStore<EventKeys>) => {
      temp = store;
    }, { fireImmediately: true }));
    // let c = onBecomeUnobserved(this, '$eventStore', (...args: any[]) => {
    //   this.$eventStore.dispose()
    //   this.$eventStore.unsubscribe()
    //   if (temp) {
    //     temp.dispose()
    //     temp.unsubscribe()
    //     temp = null
    //   }
    //   c()
    // })
    this.registerDisposer((...args: any[]) => {
      this.$eventStore.dispose();
      if (temp) {
        temp.dispose();
        temp.unsubscribe();
        temp = null;
      }
      this.setEventList(null);
      // c()
    });
  }
  @nonenumerable
  @observable
  private $eventList: string[];

  @action
  private setEventList(list: string[] = ['*']) {
    this.$eventList = list;
  }

  @nonenumerable
  @computed
  private get $eventStore() {
    return this.$eventList && new EventStore<EventKeys>(this.$eventList, this);
  }
  
  @action.bound
  public $on(eventName: EventKeys, callback: Function, instance?: any) {
    return this.$eventStore.$on(eventName, callback, instance);
  }
  @action.bound
  public $emit(eventName: EventKeys, ...args: any[]) {
    return this.$eventStore.$emit(eventName, ...args);
  }
  protected destoryFlag = false;
  @nonenumerable
  @action('commonStore-registerDisposer-hooks')
  protected registerDisposer<T extends Lambda | IReactionDisposer>(r: T): T {
    this.destorySet.add(action('commonStore-registerDisposer', r));
    return action('commonStore-nativeClear', () => {
      if (!this.destoryFlag) {
        this.destorySet.delete(r);
      }
      // console.error('$registerDisposer');
      r();
      r = null;
    }) as any;
  }
  public get propertyNameList() {
    try {
      return keys(this);
    }
    catch (e) {
      // console.log(e);
      return [];
    }
  }
  @action('commonStore-destory')
  public destory() {
    if (!this.destoryFlag) {
      this.destoryFlag = true;
      // console.error(`@${this.$storeKey}.destory(@${this.uuid})`, this.propertyNameList);
      for (const destory of this.destorySet) {
        destory();
      }
      this.destorySet.clear();
      this.destorySet = null;
      let keyList = [];
      for (const key of this.propertyNameList) {
        // console.error((this as any).code, key, this[key], Object.getOwnPropertyDescriptor(this, key));
        if (this[key] && isFunction(this[key] && this[key].destory)) {
          this[key].destory();
          keyList.push(key);
        }
      }
      for (const key in this.commonInstance) {
        this.commonInstance[key] = null;
      }
      this.commonInstance = null;
      setTimeout((instance: this) => runInAction('destory', () => {
        for (const key of keyList) {
          instance[key] = null;
        }
        keyList = null;
        instance = null;
        // Object.freeze(this)
      }), 0, this);
    }
    return this;
  }
}
