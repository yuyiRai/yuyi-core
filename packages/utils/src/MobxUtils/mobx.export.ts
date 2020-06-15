/**
 * @module MobxUtils
 */
import { defaultTo } from 'lodash';
import { action, autorun, computed, get as $get, keys as $keys, observable, ObservableMap, ObservableSet, observe, reaction, runInAction, set as $set, toJS, values as $values } from 'mobx';
import { createTransformer, expr } from 'mobx-utils';
export { createTransformer, expr, observable, computed, ObservableMap, ObservableSet, action, autorun, observe, runInAction, reaction, $set, $get, $keys, $values, toJS };

// export namespace _mobxUtils {
//   export var get$$ = $get
//   export var set$$ = $set
//   export var keys$$ = $keys
//   export var values$$ = $values
// }
/**
 * (mobx)反应式追踪一个值的变化，并在符合要求的情况时注销追踪
 * @param expression 反射函数，返回一个可观察的值
 * @param match 捕捉符合要求的反射值
 * @param emitValue 符合要求时返回的值，不传则返回expression函数返回的值
 */
export function reactionOnce<T = any>(
  expression: () => any,
  match: (value: any) => boolean,
  emitValue?: T
) {
  const getter = expression()
  if (match(getter))
    return defaultTo(emitValue, getter);
  return new Promise<T>(resolve => {
    const listener = reaction(expression, (updated: any) => {
      const ok = match(updated)
      if (ok) {
        resolve(defaultTo(emitValue, getter));
        listener && listener();
      }
    });
  })
}
