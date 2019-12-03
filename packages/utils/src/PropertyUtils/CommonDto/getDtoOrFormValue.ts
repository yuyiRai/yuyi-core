/**
 * @module CustomUtils
 */
import { CommonDto } from "./CommonDto";
import { isObject } from "../../LodashExtra";

/**
 * 
 * @param key - 
 * @param formOrDto - 
 */
export function getDtoOrFormValue(key: string, formOrDto: any) {
  if (formOrDto instanceof CommonDto) {
    return formOrDto.get(key);
  } else if (isObject(formOrDto)) {
    return formOrDto[key];
  } else {
    return undefined;
  }
}
