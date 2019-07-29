/** 
 * @module PropertyUtils
 */

/** 
 * 根据 object对象的path路径获取值。
 * Gets the property value at path of `object`.
 * @typeParam Target - 解析对象
 * @typeParam ExpectValue - 预期值
 * @typeParam DeepTarget - 路径最深处的对象（只有一层的话就是解析对象自己）
 * 
 * @param obj - 要检索的`对象`。
 * The `object` to query.
 * @param path - 要获取属性的`路径`。
 * The `path` of the property to get.
 * @param strict - 是否严格模式，obj解析出错时弹出错误
 * @returns - 返回解析结果。
 * Returns the resolved value.
 * 
 * @remarks
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c': 3 } }] };
 * getPropByPath(object, 'a[0].b.c');
 * // => 3
 * getPropByPath(object, 'a.b.d');
 * // => throw Error("please transfer a valid prop path to form item!")
 * ```
 */
export function getPropByPath<
  Target = any,
  ExpectValue = any,
  DeepTarget = Target
>(
  obj: Target, path: string, strict = false
): IGetPathResult<ExpectValue, DeepTarget> {
  let tempObj: DeepTarget = obj as any;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) {
      break;
    }
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    }
    else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    innerObj: tempObj,
    key: keyArr[i],
    value: tempObj ? tempObj[keyArr[i]] : null
  };
}

export interface IGetPathResult<ExpectValue, DeepT> {
  /**
   * 解析到达最深处的对象
   */
  innerObj: DeepT;
  /**
   * 解析到达最深处对象的键值
   */
  key: string;
  /**
   * 预期解析得到的值
   */
  value: ExpectValue;
}