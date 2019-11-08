import { keys } from 'ts-transformer-keys';
// import * as Ts from 'ts-transformer-keys';

export const a = keys();

console.log(keys())
interface Foo {
  foo: string;
}
const fooKeys = keys<Foo>();
console.log(fooKeys[0]);

type FooBar = Foo & { bar: number; };
keys<FooBar>()[1];
type FooBarBaz = FooBar | { bar: Function; baz: Date; };
const fooBarBazKeys = keys<FooBarBaz>();
fooBarBazKeys.forEach(key => console.log(key));

keys.toString();

export class MyClass<T extends object> {
  keys() {
    return keys<T>();
  }
}