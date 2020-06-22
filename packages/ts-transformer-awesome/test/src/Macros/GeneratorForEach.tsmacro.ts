//@ts-nocheck
/**
 * Macros函数，可以简单地代替for...of
 */
export const GeneratorForEach = MACRO(
  function <T, R, N>(generator: Generator<T, R, N>, handle: (value: T, done?: boolean) => void): R {
    let loop: IteratorResult<T, any>;
    while (loop = generator.next(), !loop.done) {
      handle(loop.value, loop.done);
    }
    return loop.value;
  }
);

/**
 * Macros 代替array.forEach
 */
export const ForEachMacro = MACRO(
  function <T>(target: T[], callbackfn: (value: T, index: number, array: T[]) => void, start?: boolean) {
    let len = target.length, i = 0, item: T;
    while (i < len) {
      item = target[i++];
      callbackfn(item, i, target);
    }
    return true
  }
);

/**
 * Macros 代替array.forEach
 */
export const getter = MACRO(
  function (target: any[], ccc: any, start?: boolean) {
    return [target, ccc, start]
  }
);
export const returnOne = MACRO(
  function (returnedFunc: Function) {
    return returnedFunc
  }
);
export default function app() {

  return {
    a: getter([1, 2, 3], console.log),
    b: returnOne((obj, _preUtils, message?: string, assert?: DynamicLoader<boolean>, rule?) => {
      if (typeof message != 'string') {
        message = `请 ${matchType(obj.type, requiredBlackTypes) ? '选择' : '录入'}${obj.label.replace(/\n/g, '')}`;
      }
      const validate = (rule || {
        required: true,
        validator(_rule, value, callback) {
          // console.log(obj.label, value, isNotEmptyValue(value), isNotEmptyValue)
          if (Array.isArray(value) && value.length === 0) {
            return callback(new Error('请至少录入一项'));
          }
          return isNotEmptyValue(value) ? callback() : callback(new Error(message));
        },
        message: undefined
      });
      return assert ? {
        loader: [
          useLoaderMacro('rules', async function (form, utils) {
            const used = (await assert(form, utils));
            // console.log(obj.code, used, form)
            // if (obj.code === "tistrSeifVo.srid" || obj.code === 'tistrSeifVo.srit' && used) {
            //   debugger
            // }
            return used && (
              validate instanceof Function ? (await validate(form, utils)) : validate
            ) || [];
          })
        ]
      } : { rules: [validate] };
    })
  }
};
