import './interface';
import './utils';
import './WasmImporter'

declare namespace JSX {
  type TChildren =
    | Element
    | string
    | number
    | boolean
    | null
    | typeof undefined;

  interface IntrinsicAttributes {
    children?: TChildren | TChildren[];
  }
}
declare global {
  export type TChildren = JSX.TChildren
  export type IntrinsicAttributes = JSX.IntrinsicAttributes
  export function Choose(props: { children?: TChildren | TChildren[] }): any;
  export function When(props: { children?: TChildren | TChildren[]; condition: boolean; }): any;
  export function Otherwise(props: { children?: TChildren | TChildren[] }): any;
  export function If(props: { children?: TChildren | TChildren[]; condition: boolean; }): any;
  export function For<T>(props: { children?: TChildren | TChildren[]; each: string; of: Iterable<T>; index?: string; }): any;
  export function With(props: { children?: TChildren | TChildren[];[id: string]: any; }): any;
}

export * from './interface'
export * from './utils'