/**
 * Macros函数，可以简单地代替for...of
 */
export const GeneratorForEachMacro = MACRO(
  function <T, R, N>(generator: Generator<T, R, N>, handle: (value: T, done?: boolean) => void): R {
    let loop: IteratorResult<T, any>, runner = generator;
    while (loop = runner.next(), !loop.done) {
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
    var i = -1, len = target.length - 1, item: T;
    while (i < len) {
      item = target[++i]
      callbackfn(item, i, target);
    }
  }
);
