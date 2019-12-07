import { __decorate } from 'tslib';

export const enum DecorateType {
  nil,
  false
}
const keyword = [
  null,
  ,
]
export function __decorate_all<T extends Function, E extends {
  decorators: Function[];
  [key: string]: any;
}>(keymap: Record<string, E>): (target: T) => T {
  return function (Target: T) {
    var tmp: E | undefined;
    for (var key in keymap) {
      tmp = keymap[key]
      tmp && __decorate(tmp[0], Target.prototype, key, keyword[tmp[1]]);
    }
    return Target
  }
}
