import '.';
import { IUtils } from '../utils/Utils';
interface IPrototype extends Object {
    [key: string]: any;
}
interface IClassConstructor extends Function {
    [key: string]: any;
}
declare global {
    var Utils: IUtils;
    class Type {
        Function: (...args: any[]) => void | any;
        Prototype: IPrototype;
        ClassConstructor: IClassConstructor;
    }
    interface Array<T> {
        includes(type: any): boolean;
    }
    interface Window {
        Utils: IUtils;
    }
}
export {};
