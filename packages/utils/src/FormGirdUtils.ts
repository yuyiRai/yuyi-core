import { defaults, defaultTo, defaultsDeep, reduce } from 'lodash';
import { castArray, cloneDeep, get, isNumber, isObject } from './LodashExtra';
import { typeFilterUtils } from './TypeLib';

export type PropFormatter<T, InputT = any, DefaultT = any> = (value: InputT, defaultValue?: DefaultT) => T
export type NativeOrProp<T, K extends string> = K extends string ? { [key in K]: T } : T


/**
 * 
 * @param formatter - 格式化方法
 * @param searchTarget - 检索对象
 * @param replaceKey - 检索来源，优先级为前>后
 * @param targetKey - 嵌入检索对象时指定的Key
 * @returns 返回由检索而来的值聚合而成的格式化后的值，指定[targetKey]时返回检索对象
 */
export function searchFormatter<T, Target extends (object | any[]), TargetKey extends string>(
  formatter: PropFormatter<T> | null,
  searchTarget: Target,
  replaceKey: string | string[],
  targetKey?: TargetKey
): NativeOrProp<ReturnType<PropFormatter<T>>, TargetKey> {
  const replaceKeys = castArray(replaceKey)
  let target = undefined
  for (const key of replaceKeys) {
    const value = get(searchTarget, key);
    const after = formatter ? formatter(value) : value
    const lift = isObject(target) ? defaults : defaultTo
    target = lift(target, after)
  }
  return targetKey ? { ...cloneDeep(searchTarget), [targetKey]: target } : target
}


export function defaultFromKey<T>(target: T, key: string, source: T) {
  return defaultsDeep(get(target, key), get(source, key))
}

export function formatterCol(col: ColProps): IColProps {
  return isNumber(col) ? { span: col } : typeFilterUtils.isObjectFilter(col) || {}
}



interface IColProps {
  span?: number;
  sm?: number;
  lx?: number;
  lg?: number;
  xl?: number;
}
type ColProps = IColProps | number;

export interface ICommonFormContainerTarget {
  labelCol?: IColProps;
  wrapperCol?: IColProps;
  col?: IColProps;
  colon?: boolean;
}

export interface ICommonFormContainer {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  /** labelCol的别名 */
  label?: ColProps;
  /** warpperCol的别名 */
  content?: ColProps;
  col?: ColProps;
  colon?: boolean;
}

export interface IItemConfig {
  container: ICommonFormContainer;
  colon?: boolean;
  col?: ColProps;
}

// interface IItemConfigTarget {
//   container: ICommonFormContainerTarget;
//   [key: string]: any;
// }

function getItemContainerAppend(arr: string[]): string[] {
  return reduce(['item', 'default'], (t, key) => t.concat(arr.map(code => key + "." + code)), [] as string[])
}
const { _content, _container, _label, _main, _Main } = {
  _container: "container",
  _content: "content",
  _label: "label",
  _main: "col",
  _Main: "Col"
}
export const GirdKeywords$$ = {
  _content, _label, _main, _Main,
  _wrapperCol: "wrapperCol",
  _labelCol: _label + _Main
}
const { _wrapperCol, _labelCol } = GirdKeywords$$

export function getItemContainer(
  item: Partial<IItemConfig>,
  defaultContainer: ICommonFormContainer,
  ...appendKeys: string[]
): ICommonFormContainerTarget & {
  [key: string]: any;
} {
  const target = { item, default: defaultContainer }
  return appendKeys.reduce((obj, key) => {
    return { ...obj, [key]: searchFormatter(null, target, getItemContainerAppend([key, _container +'.' + key])) }
  }, {
      [_main]: searchFormatter(formatterCol, target, getItemContainerAppend([_main, _container + "." + _main])),
      [_wrapperCol]: searchFormatter(formatterCol, target, getItemContainerAppend([
        _wrapperCol, _container + "." + _content, _container + "." + _wrapperCol
      ])),
      [_labelCol]: searchFormatter(formatterCol, target, getItemContainerAppend([
        _labelCol, _container + "." + _label, _container + "." + _labelCol
      ]))
    })
}

// col: searchFormatter(formatterCol, target, getItemContainerAppend(["col", "container.col"])),
  // wrapperCol: searchFormatter(formatterCol, target, getItemContainerAppend([
    // "wrapperCol", "container.content", "container.wrapperCol"
  // ])),
    // labelCol: searchFormatter(formatterCol, target, getItemContainerAppend([
      // "labelCol", "container.label", "container.labelCol"
    // ]))
