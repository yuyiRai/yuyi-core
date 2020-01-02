import { action, autorun, computed, has, IReactionOptions, isObservable, observable, reaction, set } from 'mobx';
import { ITransformer } from 'mobx-utils';
import { expect$ } from '../TypeLib';
import { BaseStore } from "./BaseStore";
import { createTransformer } from './mobx.export';

const tmpTransformerWeak = new WeakMap()
function setterWithGetter<K, V>(map: Map<K, V>, key: K, value: V) {
  return map.get(key) || (map.set(key, value) && value)
}

function cloneDeep<T extends IKeyValueMap<any>>(values: T): T {
  if (values instanceof Object) {
    var r = values instanceof Array ? [] : {}, key: string, value: any;
    var tmp: any;
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
  constructor() {
    super()
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
  public autorun(callbackfn: (form: T) => any) {
    return this.registerDisposer(autorun(() => {
      callbackfn(this.data);
    }));
  }

  @action.bound
  public nextData(next: T) {
    var { result, isDecetePath } = patchUpdate(this.data, next);
    // console.log('isDecetePath', isDecetePath)
    this.data = safeObservable(result);
  }
}

function patchUpdate<T>(data: T, next: T, parentKey?: string) {
  if (expect$.isObject(next) && expect$.isObject(data)) {
    let isDeteced = false;
    let isDecetePath = false;
    for (const key of Object.keys(next)) {
      const deepKey = parentKey ? parentKey + '.' + key : key;
      const { result, isDeteced: childIsDeteced, isDecetePath: childIsDetecedPath } = patchUpdate(data[key], next[key], deepKey);
      if (!has(data, key)) {
        set(data, key, result);
        isDeteced = true;
        isDecetePath = true;
        console.error('add field', key)
      } else if (result !== data[key]) {
        data[key] = result;
      }
      if (childIsDetecedPath)
        isDecetePath = true;
      // if (childIsDeteced) 
      //   isDeteced = true
    }
    return { result: isDeteced ? safeObservable({ ...data }) : data, isDeteced, isDecetePath };
  } else {
    return { result: safeObservable(next), isDeteced: false, isDecetePath: false };
  }
}

function safeObservable(obj: any) {
  return obj instanceof Object && !isObservable(obj) ? observable.object(obj) : obj;
}
