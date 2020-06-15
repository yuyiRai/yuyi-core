/**
 * Macros函数，可以简单地代替for...of
 */
export const GeneratorForEachMacro = MACRO(
  function <T, R, N>(generator: Generator<T, R, N>, handle: (value: T, done?: boolean) => void): R {
    let loop: IteratorResult<T, any>, _generator = generator;
    while (loop = _generator.next(), !loop.done) {
      handle(loop.value, loop.done);
    }
    return loop.value;
  }
);

/**
 * Macros 代替array.forEach
 */
export const ForEachMacro = MACRO(
  function <T>(target: T[], callbackfn: (value: T, index: number, array: T[]) => void) {
    var _target = target,
      i = -1,
      len = _target.length - 1,
      item: T;
    while (i < len) {
      item = _target[++i];
      callbackfn(item, i, _target);
    }
  }
);

/**
 * Macros 代替array.map
 */
export const MapMacro = MACRO(
  function <T, R>(target: T[], callbackfn: (value: T, index: number, array: T[]) => R): R[] {
    var _target = target,
      i = -1,
      len = _target.length - 1,
      item: T,
      result: R[];
    while (i < len) {
      item = _target[++i];
      result[result.length] = callbackfn(item, i, _target);
    }
    return result;
  }
);

