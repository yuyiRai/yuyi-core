import * as INI from 'js-ini';
import { forEach, fromPairs, groupBy, keys, map, pick, reduce, toPairs, values } from 'lodash';
import { action, computed, observable, ObservableMap, ObservableSet, toJS } from 'mobx';
import { Utils } from 'yuyi-core-utils';

export class GroupStore {
  @observable.shallow
  public static map: ObservableMap<number, ObservableSet<AulObject>> = observable.map({}, { deep: false })

  @computed
  public static get view() {
    return toJS(this.map, { exportMapsAsObjects: true, detectCycles: true })
  }

  @action.bound
  public static moveGroup(source: number, target: number) {
    const sourceGroup = this.map.get(source)
    if (sourceGroup) {
      sourceGroup.forEach(value => {
        Utils.isNumber(target) ? value.base.set('group', target) : value.base.unset('group')
      })
      this.map.delete(source)
      // this.map.set(target, sourceGroup)
    }
  }

  @action.bound
  public static removeGroupOne(obj: AulObject, source?: number) {
    if (Utils.isNumber(source)) {
      const last = this.map.get(source)
      if (last) {
        last.delete(obj)
        if (last.size === 0) {
          this.map.delete(source)
        }
      }
    }
    return this.map
  }
  @action.bound

  public static setGroupOne(obj: AulObject, target: number) {
    this.map.set(target, (this.map.get(target) || observable.set([])).add(obj))
    return this.map
  }

  @action.bound
  public static updateGroupOne(obj: AulObject, target: number, source?: number) {
    this.removeGroupOne(obj, source)
    this.setGroupOne(obj, target)
    return this.map
  }
}
// GroupStore.map.observe(changes => {
//   if (changes.type === 'add') {
//     changes.newValue.intercept(handler => {
//       // handler.object
//       return handler;
//     })
//   }
// })

export type BaseConfigKey = 'group' | 'layer' | 'start' | 'end'
export class AulObjectBase {
  [key: string]: any;
  @observable.ref group?: number;
  @observable.ref layer: number = undefined as any;
  @observable.ref start: number = undefined as any;
  @observable.ref end: number = undefined as any;
  constructor(private _obj: any, private _ref: AulObject) {
    // this.listenGroup(_obj['group'])
    forEach(['group', 'layer', 'start', 'end'], (type: BaseConfigKey) => {
      if (Utils.isNumber(_obj[type])) {
        this.set(type, _obj[type])
      }
    })
  }

  // @action.bound
  // public listenGroup(lastGroup?: number) {
  //   if (Utils.isNumber(lastGroup))
  //     GroupStore.map.observe(listener => {
  //       if (listener.type === 'add') {
  //         this.group = listener.name
  //       } else if (listener.type === 'delete' && listener.name === lastGroup) {
  //         this.group = undefined
  //       }
  //     })
  // }

  @action.bound
  public set(type: BaseConfigKey, value: number) {
    if (type === 'group') {
      GroupStore.updateGroupOne(this._ref, value, this[type])
    }
    this[type] = value as any
  }

  @action.bound
  public unset(type: BaseConfigKey) {
    if (type === 'group') {
      GroupStore.removeGroupOne(this._ref, this[type])
    }
    this[type] = undefined as any
  }

  export(obj?: any) {
    const { group } = this;
    return { ...this._obj, ...obj, group }
  }
}

export interface IObject {
  idNum: string;
  base: AulObjectBase;
  children: IObject[];
}

export class AulObject implements IObject {
  @observable base: AulObjectBase = null as any;
  children: IObject[] = [] as any;
  constructor(public idNum: string) {
  }
  setBase(obj: any) {
    this.base = new AulObjectBase(obj, this)
  }
}

export class AulUtils {
  static objectToList(obj: any): IObject[] {
    const list = values(groupBy(toPairs(obj), ([key, obj]) => {
      return key.split('.')[0]
    }))

    return map(list, arr => {
      const base = new AulObject(arr[0][0] as any)
      return reduce<any[], AulObject>(arr, (res: AulObject, [key, obj]: [number, any]) => {
        if (/^([0-9]+)\.([0-9]+)$/.test(key + '')) {
          res.children.push(obj)
        } else {
          res.setBase(obj)
        }
        return res
      }, base)
    })
  }

  static listToMap(list: IObject[], targetMap = new Map<string, IObject>()) {
    return reduce(list, ((map, obj) => reduce(
      obj.children,
      (childMap, child, index) => childMap.set(`${obj.idNum}.${index}`, child),
      map.set(obj.idNum, obj.base.export())
    )), targetMap)
  }

  static listToObj(list: IObject[]) {
    return fromPairs(toPairs(this.listToMap(list)))
  }
  static listToString(list: IObject[], strict: boolean = true) {
    return strict ? reduce(
      toPairs(this.listToMap(list)),
      (str, [key, obj]) => str + INI.stringify({ [key]: pick(obj, ...(keys(obj).sort((a, b) => -1))) } as any, {}),
      ''
    ) : INI.stringify(this.listToObj(list))
  }
}


export class ExoUtils {
  @observable source: any;
  @computed get target(): IObject[] {
    return AulUtils.objectToList(toJS(this.source))
  };
  exedit: any;

  constructor(public sourceStr: string) {
    this.parse(sourceStr)
  }

  parse(source: string) {
    this.init(INI.parse(source))
  }

  init(obj: any) {
    const { exedit, ...source } = obj;
    this.source = source
    this.exedit = exedit
    console.log(this.output(), GroupStore, GroupStore.view)
  }

  output(target = this.target): string {
    const { exedit, source } = this;
    const valid = AulUtils.listToObj(target)
    const exeditStr = INI.stringify({ exedit }, { blankLine: false, spaceBefore: false, spaceAfter: false })
    console.log(this, source, valid, Utils.isEqual(source, valid))
    return exeditStr + AulUtils.listToString(target);
  }
}