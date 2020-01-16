export function logger<P extends any = any>(name?: string, time = false) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    if (__DEV__) {
      /**
       * @type {function}
       */
      const func: Function = target[methodName];
      if (time) {
        descriptor.value = function (...args: P[]) {
          console.time(methodName);
          const r = func.apply(this, args);
          console.log(name, methodName, args, r);
          console.timeEnd(methodName);
          return r;
        };
      } else {
        descriptor.value = function (...args: P[]) {
          const r = func.apply(this, args);
          console.log(name, methodName, args, r);
          return r;
        };
      }
    }
  };
}
