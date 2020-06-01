import { Constant$ } from '../Constransts';
import { autoBindObj } from '../CustomUtils/autobind';
import { escapeRegExp, isRegExp } from './lodash';

/**
 * 转译转换
 */
export interface IPathEscapeConvert {
  /**
   * 将路径转义为安全路径
   * @param path 路径定义，如：a.b.c
   * @param splitStr 转译使用的分隔符 默认为"$_$"
   * @returns 返回安全字符串
   * @example 
   * escapePath("a.b.c") === "a$_$b$_$c"
   * escapePath("a.b.c", "|") === "a|b|c"
   */
  escapePath(path: string): string;
  /**
   * 将被转译的路径还原
   * @param path 被转译过的路径
   * @param splitStr 转译时使用的分隔符 默认为"$_$"
   * @returns 返回还原回来的嵌套key
   */
  extractPath(path: string): string;
  /**
   * 转译路径继承
   * @param path 被转译过的路径
   * @param extendsPath 继承路径
   * @param splitStr 转译时使用的分隔符 默认为"$_$"
   */
  extendsEscapedPath(path: string, extendsPath: string): string;
}
export namespace PathEscapeConvert {
  var _splitStr = "$_$";

  var _safeSplitStr = escapeRegExp(_splitStr);

  /**
   * {@inheritDoc IPathEscapeConvert.escapePath}
   */
  export function escapePath(path: string, splitStr: string = this._splitStr) {
    return path.replace(/\./g, splitStr);
  }
  /**
   * {@inheritDoc IPathEscapeConvert.extractPath}
   */
  export function extractPath(path: string, splitStr: string | RegExp = this._safeSplitStr) {
    return path.replace(isRegExp(splitStr) ? splitStr : new RegExp(`(${splitStr})`, 'g'), ".");
  }
  /**
   * {@inheritDoc IPathEscapeConvert.extendsEscapedPath}
   */
  export function extendsEscapedPath(path: string, extendsPath: string, splitStr: string = this._splitStr) {
    if (path.indexOf(splitStr) === 0) {
      const parent = extendsPath.split(splitStr);
      parent.length > 1 && parent.pop();
      // console.log('extendsCode', parent.join(splitStr) + path);
      return parent.join(splitStr) + path;
    }
    return path;
  }
  /**
   * 创建自定义
   * @param splitStr 
   */
  export function create(splitStr: string): IPathEscapeConvert {
    return Constant$.OBJ_ASSIGN(autoBindObj(PathEscapeConvert), {
      _splitStr: splitStr,
      _safeSplitStr: escapeRegExp(splitStr)
    });
  }
}
// @ts-ignore
PathEscapeConvert = autoBindObj(PathEscapeConvert);
