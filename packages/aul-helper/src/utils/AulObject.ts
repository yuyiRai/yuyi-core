import { forEach } from 'lodash';
import { action, computed, observable, ObservableMap, ObservableSet, toJS } from 'mobx';
import { Utils } from '@yuyi919/utils';
import { AulUtils, ExoUtils } from './ExoUtils';

export class TextObjectAdapter {
  @observable
  private obj: IObject;

  @computed
  public get text() {
    return AulUtils.decode(this.obj.text)
  }
  public set text(v: string) {
    this.obj.text = AulUtils.encode(v)
  }

  constructor(obj: IObject) {
    this.obj = obj
  }

  @action
  public static getInstance(obj: IObject = {} as any) {
    if (obj._name === 'Text') {
      return new TextObjectAdapter(obj)
    }
  }
}

export class AulObject implements IObject {
  @observable
  base: AulObjectBase = null as any;
  @observable
  _children: IObject[] = [] as any;

  @computed
  public get textAdapter() {
    return TextObjectAdapter.getInstance(this.matchType('Text'))
  }

  public matchType(type: string) {
    return this._children.find(obj => obj._name === type)
  }

  @computed
  public get config() {
    return this._children.map(({ ...value }, index) => {
      value._source = this._children[index]
      if (value._name === 'Text') {
        value.text = AulUtils.decode(value.text)
      }
      return value
    })
  }


  @action.bound
  public appenConfig(config: IObject) {
    this._children = this._children.concat([config])
  }

  constructor(public idNum: string) {
  }

  @action.bound
  public setBase(obj: any = {}) {
    this.base = new AulObjectBase(obj, this);
  }
  public export() {
    return { base: this.exportBase(), children: toJS(this._children) };
  }
  @action.bound
  public exportBase() {
    return this.base ? this.base.export({}) : {};
  }
}
export class GroupStore {
  @observable.shallow
  public static map: ObservableMap<number, ObservableSet<AulObject>> = observable.map({}, { deep: false });
  @computed
  public static get view() {
    return toJS(this.map, { exportMapsAsObjects: true, detectCycles: true });
  }

  @action.bound
  public static moveGroup(source: number, target: number) {
    const sourceGroup = this.map.get(source);
    if (sourceGroup) {
      sourceGroup.forEach(value => {
        Utils.isNumber(target) ? value.base.set('group', target) : value.base.unset('group');
      });
      this.map.delete(source);
      // this.map.set(target, sourceGroup)
    }
  }

  @action.bound
  public static removeGroupOne(obj: AulObject, source?: number) {
    if (Utils.isNumber(source)) {
      const last = this.map.get(source);
      if (last) {
        last.delete(obj);
        if (last.size === 0) {
          this.map.delete(source);
        }
      }
    }
    return this.map;
  }

  @action.bound
  public static setGroupOne(obj: AulObject, target: number) {
    this.map.set(target, (this.map.get(target) || observable.set([])).add(obj));
    return this.map;
  }

  @action.bound
  public static updateGroupOne(obj: AulObject, target: number, source?: number) {
    this.removeGroupOne(obj, source);
    this.setGroupOne(obj, target);
    return this.map;
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
export type BaseConfigKey = 'group' | 'layer' | 'start' | 'end';
export class AulObjectBase {
  [key: string]: any;
  @observable.ref
  group?: number;
  @observable.ref
  layer: number = undefined as any;
  @observable.ref
  start: number = undefined as any;
  @observable.ref
  end: number = undefined as any;
  constructor(private _obj: any, private _ref: AulObject) {
    // this.listenGroup(_obj['group'])
    forEach(['group', 'layer', 'start', 'end'], (type: BaseConfigKey) => {
      const v = parseInt(_obj[type])
      if (Utils.isNumber(v)) {
        this.set(type, v);
      }
    });
    AulUtils.fixed(_obj);
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
      GroupStore.updateGroupOne(this._ref, value, this[type]);
    }
    this[type] = value as any;
  }
  @action
  public unset(type: BaseConfigKey) {
    if (type === 'group') {
      GroupStore.removeGroupOne(this._ref, this[type]);
    }
    this[type] = undefined as any;
  }
  public export(obj?: any) {
    const { group } = this;
    return { ...this._obj, ...obj, group };
  }
}
export interface IObject {
  _name?: string;
  idNum: string;
  base: AulObjectBase;
  _children: IObject[];
  [key: string]: any;
}
