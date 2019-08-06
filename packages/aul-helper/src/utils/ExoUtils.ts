import * as INI from 'js-ini';
import { chunk, forEach, fromPairs, groupBy, keys, map, pick, reduce, toPairs, values } from 'lodash';
import { getSnapshot, Store } from 'mmlpx';
import { action, computed, observable, toJS } from 'mobx';
import { Utils } from '@yuyi/utils';
import { AulObject, IObject, GroupStore } from './AulObject';

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
          res.appenConfig(obj)
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
      obj._children,
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
      (str, [key, obj]) => str + INI.stringify({
        [key]: pick(obj, ...(Object.keys(obj).filter(key => obj[key] !== null).sort((a, b) => -1)))
      } as any, {}),
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
      let hex = str.charCodeAt(i).toString(16)
      // console.error(i, str.charAt(i), hex)
      const ch = chunk(hex, 2).sort(() => -1)
      if (ch.length === 1) {
        if (ch[0].length === 1) {
          ch[0].unshift("0")
        }
        ch.push(["00"])
      }
      hexCharCode.push(map(ch, i => i.join('')).join(''));
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
    let times = 0
    return map(chunk(str, 4), (([a, b, c, d]) => {
      const hex = parseInt(`0x${c || 0}${d || 0}${a || 0}${b || 0}`);
      (hex === 0x0000) && (times++);
      if (times > 1) { return "" }
      const r = hex === 0x0000 || !Utils.isNumber(hex) ? '' : String.fromCharCode(hex)
      console.error(hex, r)
      return r
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

  /**
   * 读取文本内容并序列化以初始化Exo实体类
   * @param sourceStr - (*.exo)文件文本
   */
  @action.bound
  public readFile(sourceStr: string) {
    this.sourceStr = sourceStr
    this.init(this.parse(sourceStr))
  }

  /**
   * 序列化文本内容
   * @param sourceStr - (*.exo)文件文本
   */
  @action.bound
  public parse(sourceStr: string) {
    return INI.parse(sourceStr, { autoTyping: false })
  }

  /**
   * 初始化Obj
   * @param obj 
   */
  @action.bound
  protected init(obj: any) {
    const { exedit, ...source } = obj;
    this.source = forEach(source, (value) => AulUtils.fixed(value))
    if (exedit) {
      const { length = 0, ...other } = exedit
      this.exedit = { _length: length, ...other }
    } else {
      this.exedit = null
    }
    console.error(this.output(), GroupStore, GroupStore.view)
  }

  /**
   * 根据AulObject输出exo文本内容
   * @param target 
   */
  @action.bound
  public output(target = this.target): string {
    const { exedit, source } = this;
    const valid = AulUtils.listToObj(target)
    const exeditStr = exedit ? INI.stringify({ exedit }, { blankLine: false, spaceBefore: false, spaceAfter: false }) : ''
    console.error(this, source, valid, Utils.isEqual(source, valid))
    return exeditStr + AulUtils.listToString(target);
  }

  @action.bound
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