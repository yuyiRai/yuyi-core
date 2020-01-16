import { Constant$ } from '../Constransts';
import { injectNamespace } from './generateNamespace';
import { hackConstructor } from './getConstructor';

const {
  KEY_CONSTRUCTOR,
  KEY_PROPERTY,
  OBJ_KEYS,
  OBJ_getOwnPropertyDescriptors$: getOwnPropertyDescriptors,
  OBJ_getOwnPropertyDescriptor$: getOwnPropertyDescriptor,
  OBJ_getPrototypeOf$: getPrototypeOf,
  OBJ_definePropertyNormal$: defineProperty,
  OBJ_ASSIGN,
  OBJ_FREEZE
} = Constant$;

const { V } = Constant$.DefPropDec$$;
export type InjectContainer<T extends Record<string, any>> = (
  Target: ConstructorType<T, [any?, any?, ...any[]]>
) => ConstructorType<T, [any?, any?, ...any[]]>;
export type PropertyKeyDefined<T, Public extends boolean = false> = (target: T, key: Public extends true ? Exclude<keyof T, number> : string) => void;
export type TypedMethodDecorator<T> = (target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;

export interface DecoratorContextBase<
  BaseTarget extends Record<string, any>,
  Init extends Record<string, any> | Function,
  InitialFunc extends Init extends Function ? true : false = Init extends Function ? true : false,
  Typed extends (Init extends ((...args: any[]) => infer T) ? T : Init) = (Init extends ((...args: any[]) => infer T) ? T : Init),
  BaseTargetKey extends keyof BaseTarget = keyof BaseTarget,
  BaseTargetPropertyDescriptors extends Record<BaseTargetKey, PropertyDescriptor> = Record<BaseTargetKey, PropertyDescriptor>,
  > {
  // <T extends BaseTarget>(validConstractor?: ConstructorType<T, [any?, any?, ...any[]]>): InjectContainer<T>,
  injectNamespace: typeof injectNamespace;
  replaceState(instance: BaseTarget, setter: Typed | ((prev: Typed) => Typed | Promise<Typed>)): Promise<void>;
  setState(instance: BaseTarget, setter: Typed | ((prev: Typed) => Typed | Promise<Typed>)): Promise<void>;
  container<T extends BaseTarget>(validConstractor?: ConstructorType<T, [any?, any?, ...any[]]>): InjectContainer<T>;
  /**
   *
   * @param isForce 是否强制要求成员为public修饰
   * @param initialValue 手动指定初始化
   */
  property<T extends BaseTarget, Public extends boolean = false>(
    isForce?: Public, initialValue?: any
  ): PropertyKeyDefined<T, Public>;
  match(target: BaseTarget): boolean;
  matchFull<T extends BaseTarget, K extends BaseTargetKey, KP extends BaseTargetPropertyDescriptors>(target: T, excludesPropKeys?: K[]): {
    property?: KP;
    propertyKeys?: K[];
  };
  getPropertyNames<T = ConstructorType<BaseTarget, [any?, any?, ...any[]]>>(t: T): BaseTargetKey[];
  propertyKeys(instance: any, constructors?: any): BaseTargetKey[];
  methodCollection<T extends BaseTarget>(): TypedMethodDecorator<T>;
}

/**
 * 创建装饰器
 * @param key
 * @param value
 * @param initialFunc value是否为初始化对象的函数
 */
export function createDecoratorBase<
  BaseTarget extends Record<string, any>,
  Init extends Record<string, any> | Function
>(key: string, value: Init) {

  let injectedKey = Constant$.KEY_PREFIX_INJECT + key;
  const injectNamespaceCopy = (function (target: BaseTarget, keyName: string, initialValue?: any, options: any = {}) {
    //@ts-ignore
    const r = injectNamespace(
      target,
      keyName,
      initialValue,
      OBJ_ASSIGN({
        initialFunc: true
      }, options)
    );
    injectedKey = r.generedKey;
    return r;
  }) as typeof injectNamespace;

  const context: DecoratorContextBase<BaseTarget, Init> = {
    injectNamespace: injectNamespaceCopy,
    async replaceState(instance, setter) {
      const prop = Constant$.OBJ_getOwnPropertyDescriptor$(instance, injectedKey);
      let next = setter instanceof Function ? setter(prop && prop.value) : setter;
      if (next && 'then' in next) {
        next = await next;
      }
      Constant$.OBJ_ASSIGN(instance[injectedKey], next);
      //@ts-ignore

    },
    async setState(instance, setter) {
      const prop = Constant$.OBJ_getOwnPropertyDescriptor$(instance, injectedKey);
      let next = setter instanceof Function ? setter(prop && prop.value) : setter;
      if (next && 'then' in next) {
        next = await next;
      }
      Constant$.OBJ_ASSIGN(instance[injectedKey], next)
      //@ts-ignore
      
    },
    container(validConstractor) {
      return function (Target) {
        const r = injectNamespaceCopy(Target.prototype, injectedKey, value);
        injectedKey = r.generedKey;
        return hackConstructor(Target, function (args, HackedTarget, instance) {
          // console.log('_injectedKey', r, _injectedKey, instance, HackedTarget)
          context.setState(instance, {} as any);
          return args;
        }, 'Injected');
      };
    },
    property(isForce, initialValue) {
      return function (target, key) {
        defineProperty(target, key, initialValue);
        // console.error(cogpd(target, key))
        // debugger
        // console.log('_injectedKey property start', _injectedKey)
      };
    },
    // : 
    methodCollection() {
      return function (target, propertyKey, descriptor) {
        // console.error(cogpd(target, key))
        // debugger
      };
    },
    match(target) {
      let tmp: any;
      return (tmp = getPrototypeOf(target)) && (tmp = getOwnPropertyDescriptor(tmp, injectedKey)) && tmp[V] === value;
    },
    matchFull(target, excludesPropKeys = []) {
      const props = getPrototypeOf(target);
      const propDescriptors = getOwnPropertyDescriptor(props, injectedKey);
      if (propDescriptors && propDescriptors[V] === value) {
        const { [injectedKey]: keyProp, ...property } = getOwnPropertyDescriptors(props);
        let i = excludesPropKeys.length;
        while (i) {
          // @ts-ignore
          delete property[excludesPropKeys[i-- - 1]];
        }
        delete property[KEY_CONSTRUCTOR];
        // @ts-ignore
        return { [KEY_PROPERTY]: property, propertyKeys: OBJ_KEYS(property) };
      }
      return { [KEY_PROPERTY]: {} as any, propertyKeys: [] as any };
    },
    getPropertyNames(t) {
      return Constant$.OBJ_getOwnPropertyNames$(t) as any;
    },
    propertyKeys(instance, constructors = instance.constructor) {
      return context.matchFull(
        instance, context.getPropertyNames(constructors)
      ).propertyKeys;
    }
  };
  return OBJ_FREEZE(OBJ_ASSIGN(context.container, context));
}


// (window as any).createDecoratorBase = createDecoratorBase
