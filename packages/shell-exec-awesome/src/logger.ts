import colors from 'colors';

export function logger(key: string, pre = false): MethodDecorator {
  return function (target: any, prop: string, desc: TypedPropertyDescriptor<any>) {
    const { value: func, get, set, writable, ...other } = desc;
    return {
      ...other,
      get() {
        const This = this;
        return function (...args: any[]) {
          pre && console.log(colors.cyan(`[${key}] `) + args[0]);
          const result = (func as Function).apply.call(func, This, args);
          !pre && console.log(colors.cyan(`[${key}] `) + result);
          return result;
        };
      }
    } as TypedPropertyDescriptor<any>;
  };
}
