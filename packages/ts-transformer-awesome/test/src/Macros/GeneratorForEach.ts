/**
 * Macros函数，可以简单地代替for...of
 */
export const GeneratorForEach = MACRO(
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
    const arr = target, len = target.length;
    let i = 0, item: T;
    while (i < len) {
      item = arr[i++];
      callbackfn(item, i, arr);
    }
    return true
  }
);

export default function* app() {
  for (var i = 0; i < 10; i++) {
    yield i;
  }
};
