/// <reference types="react" />
import './interface';
import './utils';
declare global {
    namespace JSX {
        type TChildren = Element | string | number | boolean | null | typeof undefined;
        interface IntrinsicAttributes {
            children?: TChildren | TChildren[];
        }
    }
    type TChildren = JSX.TChildren;
    type IntrinsicAttributes = JSX.IntrinsicAttributes;
    function Choose(props: {
        children?: TChildren | TChildren[];
    }): any;
    function When(props: {
        children?: TChildren | TChildren[];
        condition: boolean;
    }): any;
    function Otherwise(props: {
        children?: TChildren | TChildren[];
    }): any;
    function If(props: {
        children?: TChildren | TChildren[];
        condition: boolean;
    }): any;
    function For<T>(props: {
        children?: TChildren | TChildren[];
        each: string;
        of: Iterable<T>;
        index?: string;
    }): any;
    function With(props: {
        children?: TChildren | TChildren[];
        [id: string]: any;
    }): any;
}
export * from '.';
