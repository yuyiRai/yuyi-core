/**
 * @module MobxUtils
 */
import { observable, computed, observe, runInAction, ObservableMap, ObservableSet, action, autorun, reaction, set as $set, get as $get, keys as $keys, values as $values, toJS, IReactionOptions } from 'mobx'
import { createTransformer, expr } from 'mobx-utils'
export { createTransformer, expr, observable, computed, ObservableMap, ObservableSet, action, autorun, observe, runInAction, reaction, $set, $get, $keys, $values, toJS }

// export namespace _mobxUtils {
//   export var get$$ = $get
//   export var set$$ = $set
//   export var keys$$ = $keys
//   export var values$$ = $values
// }
export function reactionOnce<T = any>(
  re: () => any,
  match: (value: any) => boolean,
  emitValue?: T
) {
  if (match(re()))
    return emitValue;
  return new Promise<T>(resolve => {
    const listener = reaction(re, (updated: any) => {
      const ok = match(updated)
      if (ok) {
        resolve(emitValue);
        listener && listener();
      }
    });
  })
}
