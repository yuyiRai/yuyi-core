import { autobind, readonly } from 'core-decorators';
import { action, computed, $get, $keys, observable, ObservableMap, toJS, $values } from './mobx.export';
import { Constant$, IKeyValueMap } from '../Constransts';
import { isNil, isNumber, isString, reduce } from '../LodashExtra';
import { CommonStore } from './CommonStore';
import { ForEachMacro } from '../Utils.tsmacro';

export type IKeyData<Key extends string> = IKeyValueMap<any> & {
  readonly [K in Key]-?: string;
}

export class RecordMapStore<
  DataKey extends string,
  SourceData extends IKeyData<DataKey>,
  TargetData extends IKeyData<DataKey> = SourceData,
> extends CommonStore {

  @observable
  public sourceMap: ObservableMap<string, SourceData> = observable.map({}, { deep: false })

  @observable
  @readonly
  protected readonly targetMap: ObservableMap<string, TargetData> = observable.map({}, { deep: false })

  @computed
  public get sourceData(): IKeyValueMap<SourceData> {
    // console.log('sourceData', this);

    // const c = toJS(this.sourceMap.toPOJO())
    // return forEach(c, (value, key) => {
    //   c[key] = toJS(value)
    // })
    // toJS(this.sourceMap.toPOJO())
    return reduce(this.keyList, (obj, key) => {
      const value = $get(this.sourceMap, key)
      return Constant$.OBJ_ASSIGN(obj, {
        [key]: toJS(value)
      });
    }, {})
  }

  public sourceDataSnapshot: IKeyValueMap<SourceData> = {};

  @computed.struct
  public get targetData(): IKeyValueMap<TargetData> {
    // console.log('targetData', this);
    return toJS(this.targetMap.toJSON())
  }

  @computed.struct
  public get sourceValueList() {
    // trace()
    return toJS($values(this.sourceMap))
  }

  @computed.struct
  public get keyList(): string[] {
    return $keys(this.sourceMap) as string[]
  }
  @computed.struct
  public get valueList(): ReadonlyArray<TargetData> {
    return toJS($values(this.targetMap))
  }

  @action
  public getSourceData(keyValue: string): SourceData {
    return this.sourceMap.get(keyValue)
  }

  @action reduce(callback: any, init: any) {
    return reduce(this.sourceData, action(callback), init);
  }

  @action
  public mapValueWithSource<VT = any>(valueKey: string, autoZip = false): IKeyValueMap<VT> {
    const obj = {}
    ForEachMacro(this.keyList, key => {
      const value = this.getSourceData(key)[valueKey];
      if ((autoZip && value) || autoZip) {
        obj[key] = value;
      }
    })
    return obj;
  }

  @action
  public mapValueWithTarget<VT = any>(valueKey: string, autoZip = false): IKeyValueMap<VT> {
    return reduce(this.keyList, (obj, key) => {
      const value = this.getTargetData(key)[valueKey]
      return autoZip && value ? obj : Constant$.OBJ_ASSIGN(obj, { [key]: value })
    }, {} as any);
  }

  @autobind
  // @readonly
  public getTargetData(keyValue: string): TargetData {
    return this.targetMap.get(keyValue) 
  }

  private getConfigKey(config: SourceData | TargetData): (SourceData | TargetData)[DataKey] {
    return config[this.keyProperty]
  }

  private setConfigKey(config: SourceData | TargetData, keyValue: string) {
    return config[this.keyProperty] = keyValue as (SourceData | TargetData)[DataKey]
  }

  @action.bound
  @readonly
  public setSourceData(sourceData: SourceData[] | IKeyValueMap<SourceData>) {
    // console.log('set', sourceData)
    this.mapToDiff(this.sourceMap,
      reduce(sourceData as any, (object, nextConfig: SourceData, key: string | number) => {
        if (isNumber(key) && isNil(this.getConfigKey(nextConfig))) {
          this.setConfigKey(nextConfig, (key + '') as SourceData[DataKey])
        }
        const keyValue = this.getConfigKey(nextConfig)
        if (isString(keyValue)) {
          const patch: { [key: string]: SourceData } = {}
          patch[keyValue] = nextConfig
          Constant$.OBJ_ASSIGN(object, patch)
        }
        return object
      }, {}),
      this.sourceDataSnapshot
    )
    // console.log(this.sourceMap)
  }


  @observable
  private transformer: IMapTransformer<DataKey, SourceData, TargetData> = {
    create(source) { return source; },
    update(newSource, prevTarget) { return Object.assign(prevTarget, newSource) }
  }
  constructor(private readonly keyProperty: DataKey, transformer: IMapTransformer<DataKey, SourceData, TargetData>) {
    super()
    Object.assign(this.transformer, transformer)
    this.registerDisposer(() => {
      // console.error('registerDisposer', this);
      ForEachMacro(this.keyList, key => {
        this.sourceMap.delete(key);
      })
      this.sourceMap.clear()
      this.targetMap.clear()
      this.transformer = null
      this.sourceDataSnapshot = {}
    })

    this.intercept(this.sourceMap, listener => {
      if (__DEV__) {
        console.error('this.sourceMap', listener.type, listener.name, listener.newValue)
      }
      if (listener.type === 'add') {
        this.targetMap.set(listener.name, this.transformer.create(listener.newValue))
      } else if (this.transformer.delete && listener.type === 'delete') {
        this.transformer.delete(this.getTargetData(listener.name), this.getSourceData(listener.name))
        this.targetMap.delete(listener.name)
      } else {
        this.transformer.update(listener.newValue, this.getTargetData(listener.name))
      }
      return listener
    })
  }
}

export interface IMapTransformer<DataKey extends string, SourceData extends IKeyData<DataKey>, TargetData extends IKeyData<DataKey> = SourceData> {
  create?(source: Readonly<SourceData>): TargetData;
  update?(newSource: Readonly<SourceData>, prevTarget: TargetData): TargetData;
  delete?(target: TargetData, source?: SourceData): void;
}
