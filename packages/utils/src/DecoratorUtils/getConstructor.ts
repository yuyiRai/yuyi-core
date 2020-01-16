import { Constant$ } from '../Constransts';

export function getConstructor<T extends Function = any>(Target: T) {
  return Constant$.OBJ_getOwnPropertyDescriptor$(Target[Constant$.KEY_PROTOTYPE], Constant$.KEY_CONSTRUCTOR);
}

export function hackConstructor<T extends Function, Args extends any[]>(Target: T, hack: (args: Args, HackedTarget: T, instance: any) => Args, prefix?: string): T {
  const ClassTarget = getConstructor(Target);
  const name = Target.name || ClassTarget.value.name || ''
  let r = function (...args: Args) {
    ClassTarget && ClassTarget.value && (ClassTarget.value as Function).apply(this, hack(args, r as any, this));
  }
  r = Constant$.OBJ_definePropertyNormal$(r, 'name', name)
  const { constructor, ...other } = Constant$.OBJ_getOwnPropertyDescriptors$(Target);
  Constant$.OBJ_defineProperties$(r, other);
  return r as any;
}
