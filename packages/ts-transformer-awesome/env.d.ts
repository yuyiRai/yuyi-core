import 'ts-nameof';
import { oc as _oc } from 'ts-optchain';
import { keys } from 'ts-transformer-keys';
declare global {
    var tsKeys: typeof keys;
    var oc: typeof _oc;
    var item: any;
    var itemIndex: any;
    function MACRO<T>(t: T): T;
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
    type FilterFunction = <T>(...args: any[]) => T;
    const filters: FilterFunction;
    namespace NodeJS {
        interface Global {
            filters: FilterFunction;
            __DEV__: boolean;
        }
    }
}
