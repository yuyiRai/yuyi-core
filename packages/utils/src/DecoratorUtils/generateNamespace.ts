import { Constant$ } from '../Constransts';
import { isFunction } from '../LodashExtra';

const { V, E, C, W } = Constant$.DefPropDec$$


/**
  * 生成实例的内部实现细节存储空间(namespace)
  * @param target
  * @param keyName
  * @example
  * var utils = createDecoratorBase('app', 'keys')
  * var T = class A { }
  * utils.generateNamespace(T.prototype, 'test')
  * utils.generateNamespace(T.prototype, 'test', 'app')
  * utils.generateNamespace(T.prototype, 'test', [])
  * * // => []
  * utils.generateNamespace(T.prototype, 'test', 'app')
  *
  */
export function generateNamespace2<T>(target: T, keyName: string = 'base', extendsIndex: number = -1) {
  // console.log(arguments.length)
  var k = extendsIndex;
  var key: string;

  while (true)
    if (!Constant$.OBJ_getOwnPropertyDescriptor$(target, (
      key = keyName + (++k > 0 ? '$' + k : '')
    )))
      break;
  
  return key;
}
export function generateNamespace<T>(target: T, keyName: string = 'base', prevIndex: number = 0) {
  var key: string = keyName + (prevIndex > 0 ? '$' + prevIndex : '');
  if (!Constant$.OBJ_getOwnPropertyDescriptor$(target, key)) return key;
  try {
    return generateNamespace<T>(target, keyName, prevIndex + 1);
  } catch (error) {
    return generateNamespace2<T>(target, keyName, prevIndex);
  }
}

export type InjectNamespaceOptions = {
  /**
   * 传入函数时视作初始化函数
   * @default true
   * */
  initialFunc ?: boolean;
  /** 统一前缀 */
  prefixKey?: string;
  /** 所属上级的Key，用以进行嵌套Inject */
  upperKey?: string
  /**
   * 模式
   */
  mode ?: 'init' | 'forceInit' | 'update';
}

export function injectNamespace<T, VT = any>(target: T, keyName: string, initialValue?: VT | ((...args: any[]) => VT), options?: InjectNamespaceOptions) {
  var { initialFunc = true, prefixKey, mode } = options || {};

  var baseKey = prefixKey ? (prefixKey + '_' + keyName) : keyName;

  var generedKey = mode !== "forceInit" && generateNamespace(target, baseKey) || baseKey;

  var desc = isFunction(initialValue) && initialFunc
    ? { [V]: initialValue(target, generedKey), [W]: false, [C]: true, [E]: false, generedKey }
    : { [V]: initialValue, [W]: false, [C]: true, [E]: false, generedKey };
  
  Constant$.OBJ_defineProperty$(target, generedKey, desc);

  return desc as TypedPropertyDescriptor<VT> & {
    generedKey: string;
  };
}
