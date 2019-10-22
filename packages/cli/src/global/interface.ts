import { IReactComponent as ReactComponent } from 'mobx-react'

declare global {
  interface IPrototype extends Object {
    [key: string]: any;
  }
  interface IClassConstructor extends Function {
    [key: string]: any;
  }
  export type IReactComponent = ReactComponent
  export namespace Type {
    export type Function<Args extends any[] = [], Result = any> = ((...args: Args) => Result);
    export type Prototype = IPrototype;
    export type ClassConstructor = IClassConstructor;
  }
  export interface Array<T> {
    includes(type: any): boolean;
  }
}