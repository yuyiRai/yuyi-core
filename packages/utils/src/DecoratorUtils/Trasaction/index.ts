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

export function withAsyncOr<T>(waiter: T | Promise<T>, when?: (waiting: boolean) => void, or?: () => void): Promise<T> {
  if (waiter instanceof Promise) {
    return !when && waiter || (when(true), waiter.then(r => {
      when && when(false)
      return r
    }));
  }
  or && or()
  return Constant$.EMPTY_PROMISE(waiter);
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

const TrasactionMap: WeakMap<any, Record<string, ReturnType<typeof createTrasaction>>> = new WeakMap<any, Record<string, ReturnType<typeof createTrasaction>>>();
export const Trasaction = Object.assign(function Trasaction(trasactionKey?: string) {
  const map = TrasactionMap;
  return function (target: any, key: string, { value, ...desc }: TypedPropertyDescriptor<FunctionFactory.Base<any[], Promise<any>>>) {
    if (value instanceof Function) {
      trasactionKey = trasactionKey || key;
      const namespaceKey = generateNamespace(target, '$$_trasaction_' + trasactionKey);
      if (__DEV__) {
        console.info('generateNamespace', namespaceKey)
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
  };
}, { cache: TrasactionMap })
