import '.'
import { IUtils, Utils as GlobalUtils } from '../utils/Utils'
window.Utils = GlobalUtils
interface IPrototype extends Object {
  [key: string]: any;
}
interface IClassConstructor extends Function {
  [key: string]: any;
}
declare global {
  var Utils: IUtils;
  export class Type {
    Function: (...args: any[]) => void | any;
    Prototype: IPrototype;
    ClassConstructor: IClassConstructor;
  }
  export interface Array<T> {
    includes(type: any): boolean;
  }
  export interface Window {
    Utils: IUtils
  }
}