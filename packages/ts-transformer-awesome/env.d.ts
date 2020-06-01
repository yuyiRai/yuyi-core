import { oc as _oc } from 'ts-optchain';
import { keys } from 'ts-transformer-keys';
declare type FilterFunction = <T>(...args: any[]) => T;
declare type MacroFunction<T> = T extends Function ? T : never;
declare global {
    var tsKeys: typeof keys;
    var oc: typeof _oc;
    var item: any;
    var itemIndex: any;
    var filters: FilterFunction;
    function MACRO<T extends Function>(t: T): MacroFunction<T>;
    function Choose(): any;
    function When(props: {
        condition: boolean;
    }): any;
    function Otherwise(): any;
    function If(props: {
        condition: boolean;
    }): any;
    function For<T>(props: {
        each: string;
        of: Iterable<T>;
        index?: string;
    }): any;
    function With(props: {
        [id: string]: any;
    }): any;
    interface Window {
        __DEV__: boolean;
    }
    namespace JSX {
        interface IntrinsicAttributes {
            children?: any;
        }
    }
    namespace NodeJS {
        interface Global {
            filters: FilterFunction;
            __DEV__: boolean;
        }
    }
}
export {};
