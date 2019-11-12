"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../env");
var React = __importStar(require("react"));
// // import * as Ts from 'ts-transformer-keys';
// export const a = tsKeys();
// console.log(tsKeys())
// interface Foo {
//   foo: string;
// }
// const fooKeys = tsKeys<Foo>();
// console.log(fooKeys[0]);
// type FooBar = Foo & { bar: number; };
// tsKeys<FooBar>()[1];
// type FooBarBaz = FooBar | { bar: Function; baz: Date; };
// const fooBarBazKeys = tsKeys<FooBarBaz>();
// fooBarBazKeys.forEach(key => console.log(key));
// tsKeys.toString();
// export class MyClass<T extends object> {
//   private app: number = 0;
//   keys() {
//     return tsKeys<T>();
//   }
//   logger() {
//     console.log(this.app)
//   }
// }
// export const MAP = MACRO(
//   <T, L>(
//     inputConst: T[],
//     visitor: (value: T, index?: number, input?: T[]) => L
//   ) => {
//     const input = inputConst;
//     const length = input.length;
//     const result = new Array(length) as L[];
//     for (let i = 0; i < length; i++) {
//       result[i] = visitor(input[i], i, input);
//     }
//     return result;
//   }
// );
// export const FILTER = MACRO(
//   <T, L>(
//     inputConst: T[],
//     visitor: (value: T, index?: number, input?: T[]) => T
//   ) => {
//     const input = inputConst;
//     const length = input.length;
//     const result = new Array() as T[];
//     for (let i = 0; i < length; i++) {
//       visitor(input[i], i, input) && result.push(input[i]);
//     }
//     return result;
//   }
// );
// declare global {
//   interface Array<T> {
//     MAP: Array<T>['map'];
//     FILTER: Array<T>['filter']
//   }
// }
// export function test() {
//   console.log([1, 2, 3].MAP(n => {
//     const a = 3
//     const b = 1
//     const ab = () => 2+1
//     return a * n + b + ab()
//   }))
// }
var Hr = MACRO(function (children) {
    return React.createElement("h1", { className: "h1" }, children);
});
exports.TsxControlStatments = function () {
    // const a = null
    // console.log(filters<() => void>(null))
    // console.log(filters<number>(a, '3', 2))
    // console.log(filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6))
    // console.log(filters<number>(a, '3', 2, a + 2, a + 3, 5, a + 5))
    return (React.createElement(For, { of: [1, 2, 3], each: "item", index: "itemIndex" },
        React.createElement(Hr, null, item),
        React.createElement("a", { style: __$hoisted_o0 },
            itemIndex,
            item)));
};
var __$hoisted_o0 = { background: 'red' };
