import { Constant$ } from '../Constransts';
import { autoBindObj } from '../CustomUtils/autobind';
import { escapeRegExp, isRegExp } from './lodash';


export interface IEscapeConvert {
  escapePath(path: string, splitStr?: string): string;
  extractPath(path: string, splitStr?: string | RegExp): string;
  extendsEscapedPath(path: string, extendsPath: string, splitStr?: string): string;
  create(splitStr: string): Exclude<IEscapeConvert, 'create'>;
}
var _splitStr = "$_$"
const base = {
  _splitStr,
  _safeSplitStr: escapeRegExp(_splitStr),
  escapePath(path: string, splitStr?: string) {
    !splitStr && (splitStr = this._splitStr);
    return path.replace(/\./g, splitStr);
  },
  extractPath(path: string, splitStr?: string | RegExp) {
    !splitStr && (splitStr = this._safeSplitStr);
    return path.replace(isRegExp(splitStr) ? splitStr : new RegExp(`(${splitStr})`, 'g'), ".");
  },
  extendsEscapedPath(path: string, extendsPath: string, splitStr?: string) {
    !splitStr && (splitStr = this._splitStr);
    if (path.indexOf(splitStr) === 0) {
      const parent = extendsPath.split(splitStr);
      parent.length > 1 && parent.pop();
      // console.log('extendsCode', parent.join(splitStr) + path);
      return parent.join(splitStr) + path;
    }
    return path;
  },
  create(_splitStr: string): IEscapeConvert {
    return Constant$.OBJ_ASSIGN(autoBindObj(base), {
      _splitStr,
      _safeSplitStr: escapeRegExp(_splitStr)
    });
  }
}
export const EscapeConvert: IEscapeConvert = autoBindObj(base);
