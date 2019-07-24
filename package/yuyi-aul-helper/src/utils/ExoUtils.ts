import * as INI from 'js-ini';
import { chunk, forEach, fromPairs, groupBy, keys, map, pick, reduce, toPairs, values } from 'lodash';
import { getSnapshot, Store } from 'mmlpx';
import { action, computed, observable, ObservableMap, ObservableSet, toJS } from 'mobx';
import { Utils } from 'yuyi-core-utils/src/Utils';


export class GroupStore {
  @observable.shallow
  public static map: ObservableMap<number, ObservableSet<AulObject>> = observable.map({}, { deep: false })

  @computed
  public static get view() {
    return toJS(this.map, { exportMapsAsObjects: true, detectCycles: true })
  }

  @action
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

  @action
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
  @action

  public static setGroupOne(obj: AulObject, target: number) {
    this.map.set(target, (this.map.get(target) || observable.set([])).add(obj))
    return this.map
  }

  @action
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
    AulUtils.fixed(_obj)
  }

  // @action
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

  @action
  public set(type: BaseConfigKey, value: number) {
    if (type === 'group') {
      GroupStore.updateGroupOne(this._ref, value, this[type])
    }
    this[type] = value as any
  }

  @action
  public unset(type: BaseConfigKey) {
    if (type === 'group') {
      GroupStore.removeGroupOne(this._ref, this[type])
    }
    this[type] = undefined as any
  }

  public export(obj?: any) {
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
  setBase(obj: any = {}) {
    this.base = new AulObjectBase(obj, this)
  }
  export() {
    return { base: this.exportBase(), children: this.children }
  }
  exportBase() {
    return this.base ? this.base.export({}) : {}
  }
}


export class AulUtils {
  static objectToList(obj: any): AulObject[] {
    const list = values(groupBy(toPairs(obj), ([key, obj]) => {
      AulUtils.fixed(obj)
      return key.split('.')[0]
    }))
    return map(list, arr => {
      const base = new AulObject(Utils.isStringFilter(arr[0][0], '').split('.')[0] as any)
      return reduce<any[], AulObject>(arr, (res: AulObject, [key, obj]: [number, any]) => {
        if (/^(([0-9]+)|vo)\.([0-9]+)$/.test(key + '')) {
          res.children.push(obj)
        } else {
          res.setBase(obj)
        }
        return res
      }, base)
    })
  }

  static fixed<T>(_obj: T): T {
    if ('length' in _obj) {
      (_obj as any)._length = (_obj as any).length
      delete _obj['length']
    }
    return _obj
  }

  static listToMap(list: AulObject[], targetMap = new Map<string, IObject>()) {
    return reduce(list, ((map, obj) => reduce(
      obj.children,
      (childMap, child, index) => childMap.set(`${obj.idNum}.${index}`, child),
      map.set(obj.idNum, obj.exportBase())
    )), targetMap)
  }

  static listToObj(list: AulObject[]) {
    return fromPairs(toPairs(this.listToMap(list)))
  }
  static listToString(list: AulObject[], strict: boolean = true) {
    return strict ? reduce(
      toPairs(this.listToMap(list)),
      (str, [key, obj]) => str + INI.stringify({ [key]: pick(obj, ...(keys(obj).sort((a, b) => -1))) } as any, {}),
      ''
    ) : INI.stringify(this.listToObj(list))
  }

  /**
   * 文本编码
   * 
   * @param str string to encode to string
   * @returns hex string
   */
  public static encode(str: string): string {
    if (str === "")
      return "";
    var hexCharCode = [];
    for (var i = 0; i < str.length; i++) {
      const hex = str.charCodeAt(i).toString(16)
      hexCharCode.push(map(chunk(hex, 2).sort(() => -1), i => i.join('')).join(''));
    }
    var string = hexCharCode.join("");
    while (string.length < 4096) {
      string += "0";
    }
    return string
  }

  /**
   * 文本解码
   * 
   * @param str string to decode to string
   * @returns string
   */
  public static decode(str: string): string {
    return map(chunk(str, 4), (([a, b, c, d]) => {
      const hex = parseInt(`0x${c || 0}${d || 0}${a || 0}${b || 0}`)
      return hex === 0x0000 || !Utils.isNumber(hex) ? '' : String.fromCharCode(hex)
    })).join('')
  }
}

@Store('Exoutils')
export class ExoUtils {
  public sourceStr: string = ''
  @observable source: any;
  @computed get target(): AulObject[] {
    return AulUtils.objectToList(this.source)
  };

  @computed.struct get targetNative(): any[] {
    return this.target.map(row => row.export())
  }
  exedit: any;

  readFile(sourceStr: string) {
    this.sourceStr = sourceStr
    this.parse(sourceStr)
  }

  parse(source: string) {
    this.init(INI.parse(source))
  }

  init(obj: any) {
    const { exedit, ...source } = obj;
    this.source = forEach(source, (value) => AulUtils.fixed(value))
    if (exedit) {
      const { length = 0, ...other } = exedit
      this.exedit = { _length: length, ...other }
    } else {
      this.exedit = null
    }
    console.log(this.output(), GroupStore, GroupStore.view)
  }

  output(target = this.target): string {
    const { exedit, source } = this;
    const valid = AulUtils.listToObj(target)
    const exeditStr = exedit ? INI.stringify({ exedit }, { blankLine: false, spaceBefore: false, spaceAfter: false }) : ''
    console.log(this, source, valid, Utils.isEqual(source, valid))
    return exeditStr + AulUtils.listToString(target);
  }

  @action
  public snap() {
    return getSnapshot()
  }
}


declare global {
  interface Window {
    AulUtils: AulUtils
  }
}

window.AulUtils = AulUtils