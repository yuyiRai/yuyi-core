import { expect$ } from '../../TypeLib';
import { FunctionFactory, Constant$ } from '../../Constransts';
import { generateNamespace } from '../generateNamespace';

export function generateLock(lockSet?: Set<Promise<unknown>>, taskId?: string | number) {
  var next: (() => void) = null;
  // console.log('任务开始', taskId)
  let lock = new Promise(resolve => {
    next = () => {
      resolve(taskId);
      lockSet && lockSet.delete(lock);
      lock = null;
      next = null;
      // console.log('任务完成', taskId)
    };
  });
  lockSet && lockSet.add(lock);
  return next;
}

export function waitingLock(lockSet: Set<Promise<unknown>>) {
  if (lockSet.size > 0) {
    const tasks = Array.from(lockSet);
    const task = (tasks.length > 1 ? Promise.all(tasks) : tasks[0]);
    return task && task.then(taskIds => {
      // console.log('等候任务完成', taskIds.join(','))
      return taskIds;
    }) || false;
  }
  return true;
}

/**
 * 逻辑工具函数
 * 接收一个值，如果是非Promise则自动包装为Promise
 * 如果传入值为Promise，可传入回调函数
 * 如果传入值为非Promise，可传入回调函数
 * @param target 
 * @param when 传入时，监听原生```Promise```的resolving(立即执行)/resolved(then后执行)状态并调用此回调函数
 * @param or 在即将返回包装后的```Promise```之前调用
 */
export function withAsyncOr<T>(target: T | Promise<T>, when?: (resolving: boolean) => void, or?: () => void): Promise<T> {
  if (target instanceof Promise) {
    return !when && target || (when(true), target.then(r => {
      when && when(false)
      return r
    }));
  }
  or && or()
  return Constant$.EMPTY_PROMISE(target);
}
export interface TrasactionGenerator extends ReturnType<typeof createTrasaction> {
}
export function createTrasaction(runner?: (foreExit: () => void) => any) {
  const lockSet = new Set<Promise<unknown>>();
  const generated = {
    runner,
    lockSet,
    generateLock(taskId?: number | string) {
      return generateLock(lockSet, taskId || new Date().getTime());
    },
    waitLock() {
      return waitingLock(lockSet);
    },
    run<T>(runner: (foreExit: () => void) => T): Promise<T> | null {
      const handle = expect$.isFunction.filter(runner, generated.runner);
      if (!handle) return null;
      const lock = generated.waitLock();
      if (lock instanceof Promise) {
        return lock.then(() => generated.run<T>(handle));
      }
      const next = generated.generateLock();
      let isEmited = false;
      const r = handle(function () {
        next();
        isEmited = true;
      });
      !isEmited && next();
      return r;
    },
    // @ts-ignore
    runInAsync<T, Args extends any[]>(runner: (...args: Args, foreExit: () => void) => Promise<T>, args: Args): Promise<T> | null {
      const handle = expect$.isFunction.filter(runner, generated.runner);
      if (!handle) return null;
      const lock = generated.waitLock();
      if (lock instanceof Promise) {
        return lock.then(() => generated.runInAsync<T, Args>(handle, args));
      }
      const next = generated.generateLock();
      let isEmited = false;
      return handle.apply(this, args.concat([function () {
        next();
        isEmited = true;
      }])).then(function (r: any) {
        !isEmited && next();
        return r;
      });
    }
  };
  return generated;
}



const TrasactionMap: WeakMap<any, Record<string, TrasactionGenerator>> = new WeakMap<any, Record<string, TrasactionGenerator>>();

/**
 * 事务锁定修饰符，保证一个async/返回一个Promise的函数的时序性
 * @param trasactionKey 指定命名，如果不指定则默认为函数名
 */
export function Trasaction(trasactionKey?: string) {
  const map = TrasactionMap;
  return (function (target: any, key: string, { value, ...desc }: TypedPropertyDescriptor<FunctionFactory.Base<any[], Promise<any>>>) {
    if (value instanceof Function) {
      trasactionKey = trasactionKey || key;
      const namespaceKey = generateNamespace(target, '$$_trasaction_' + trasactionKey);
      if (__DEV__) {
        console.info('generateNamespace', namespaceKey);
      }
      return Object.defineProperty(target, key, {
        ...desc,
        value(...args: any[]) {
          const config = map.get(this) || {};
          const generated = config[trasactionKey] || (config[trasactionKey] = createTrasaction());
          map.set(this, config);
          if (__DEV__) {
            console.info('generateNamespace', namespaceKey, this);
          }
          if (!this[namespaceKey])
            this[namespaceKey] = value.bind(this);
          return generated.runInAsync.apply(this, [
            this[namespaceKey],
            args
          ]);
        }
      });
    }
  }) as MethodDecorator;
}

Trasaction.cache = TrasactionMap

