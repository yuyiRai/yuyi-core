import { action, autorun, computed, has, IReactionOptions, isObservable, observable, reaction, set, IReactionDisposer } from 'mobx';
import { ITransformer } from 'mobx-utils';
import { expect$ } from '../TypeLib';
import { BaseStore } from "./BaseStore";
import { createTransformer } from './mobx.export';
import { stubObjectReturn, isObject, isArray } from '../LodashExtra';
import { convertArr2Map, getSafeMapOptions } from '../OptionsUtils';
import { Constant$, IKeyValueMap } from '../Constransts';

export const tmpTransformerWeak = new WeakMap()
function setterWithGetter<K, V>(map: Map<K, V>, key: K, value: V) {
  return map.get(key) || (map.set(key, value) && value)
}

function cloneDeep<T extends IKeyValueMap<any>>(values: T): T {
  if (values instanceof Object) {
    var r = values instanceof Array ? [] : {}, key: string, value: any;
    var tmp: Map<any, any>;
    for ([key, value] of Object.entries(values)) {
      r[key] = value instanceof Object ? (
        // @ts-ignore
        tmp = tmp || setterWithGetter(tmpTransformerWeak, values, new Map()),
        setterWithGetter(tmp, key, createTransformer(cloneDeep))(value)
      ) : value
    }
    return r as any
  }
  return values
}

export const cloneTransform = createTransformer(cloneDeep)

export class AutoRunClass<T = any, TrackType = T> extends BaseStore {
  constructor(public initData: T = {} as T) {
    super()
    this.nextData(initData)
    this.init()
  }

  private inited = false
  public init(transformer?: ITransformer<T, TrackType>) {
    const track = this.updateTack
    this.transformer = transformer || cloneTransform as ITransformer<T, TrackType>
    if (!this.inited) {
      autorun(() => {
        this.data && track.push(this.transformer(this.data) as any)
      })
      this.inited = true
    }
  }

  @observable.ref
  private transformer: ITransformer<T, TrackType>;

  @observable
  private data: T;

  @computed.struct
  public get pureData(): T {
    return this.serialize()
  };


  @action.bound
  getTrack(offset: number = 0, latest: boolean = true) {
    return this.updateTack && this.updateTack[latest ? (this.updateTack.length - 1 - offset) : offset]
  }

  @observable.shallow
  private updateTack: TrackType[] = observable.array([], { deep: false });
  
  serialize() {
    return cloneTransform(this.data)
  }
  serializeTrack(): TrackType[] {
    return this.updateTack.slice(0)
  }

  @action.bound
  public reaction<R>(reactionCallback: (form: T) => R, callbackfn: (reactionValue: R, form: T) => any, options?: IReactionOptions) {
    reactionCallback = createTransformer(reactionCallback)
    return this.registerDisposer(
      reaction<R>(() => {
        return reactionCallback(this.data);
      }, reactionValue => {
        callbackfn(reactionValue, this.data);
      }, options)
    );
  }


  @action.bound
  public autorun(callbackfn: (form: T) => any, options?: Pick<IReactionOptions, 'fireImmediately'>) {
    const { fireImmediately } = options || { fireImmediately: false }
    if (fireImmediately !== true) {
      let handle: IReactionDisposer = this.reaction(stubObjectReturn, () => {
        handle && handle()
        handle = autorun(() => {
          callbackfn(this.data);
        })
      })
      return () => {
        handle && handle()
      }
    }
    return this.registerDisposer(autorun(() => {
      callbackfn(this.data);
    }));
  }

  @action.bound
  public nextData(next: T) {
    var { result } = deepPatchUpdate(this.data, next, { has, set });
    // console.log('isDecetePath', isDecetePath)
    this.data = safeObservable(result);
  }
}

export interface PathUpdateOptions {
  has?(target: any, key: string): boolean;
  set?(target: any, key: string, value: any): any;
  keys?: typeof Object['keys'];
  filterCodes?: string[] | IKeyValueMap<boolean, string>;
}
export interface DeepPathUpdateOptions extends PathUpdateOptions {
  deep?: number;
}
export interface PathUpdateResult<T> {
  result: T;
  isDeteced: boolean;
  isDiff: boolean;
  decetePath?: Record<string, boolean>;
}

const defaultOptions = {
  has(target: any, key: string) {
    return key in target
  },
  set(target: any, key: string, value: any) {
    return (target[key] = value);
  },
}

export function patchUpdate<T>(data: T, next: T, options?: PathUpdateOptions): PathUpdateResult<T> {
  return deepPatchUpdate(data, next, Object.assign(options || {}, {
    deep: 1
  }))
}

export function deepPatchUpdate<T>(data: T, next: T, options?: DeepPathUpdateOptions): PathUpdateResult<T>;
export function deepPatchUpdate<T>(data: T, next: T, options?: DeepPathUpdateOptions, parentKey?: string, currentDeep: number = 0): PathUpdateResult<T> {
  options = options || {}
  options.deep = expect$.isNumber.filter(options.deep, 10);
  if (currentDeep < options.deep && expect$.isObject(next) && expect$.isObject(data)) {
    let decetePath: Record<string, boolean> = {};
    let isDeteced = false;
    let isDiff = false
    options.filterCodes = getSafeMapOptions(options.filterCodes)
    const { filterCodes, has, keys = Constant$.OBJ_KEYS, set } = Constant$.OBJ_ASSIGN(defaultOptions, options)
    const objKeys = keys(next);
    objKeys.forEach(key => {
      const deepKey = parentKey ? parentKey + '.' + key : key;
      if (!filterCodes || filterCodes[deepKey]) {
        // @ts-ignore
        const { result, ...other } = deepPatchUpdate<any>(data[key], next[key], options, deepKey, currentDeep + 1);
        if (!has(data, key)) {
          set(data, key, result);
          decetePath[key] = isDeteced = true;
          isDiff = true
          if (__DEV__) {
            console.error('add field', key);
          }
        } else if (result !== data[key]) {
          set(data, key, result);
          isDiff = true
        }
        if (other.decetePath)
          Object.assign(decetePath, other.decetePath);
      } else {
        data[key] = next[key]
      }
    })
    return { result: isDeteced ? { ...data } : data, isDiff, isDeteced, decetePath };
  }
  return { result: next, isDeteced: false, isDiff: true };
}

function safeObservable(obj: any) {
  return obj instanceof Object && !isObservable(obj) ? observable.object(obj) : obj;
}
