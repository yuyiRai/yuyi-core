/**
 * @module CustomUtils
 */
import Utils from '../';
import CommonDto from "../CommonDto";
export function getDtoOrFormValue(key: string, formOrDto: any) {
  if (formOrDto instanceof CommonDto) {
    return formOrDto.get(key);
  }
  else if (Utils.isObject(formOrDto)) {
    return formOrDto[key];
  }
  else {
    return undefined;
  }
}
