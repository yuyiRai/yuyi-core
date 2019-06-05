/**
 * This comment will be printed
 *
 * @module PropertyUtils
 * @preferred
 * 
 * 
 * This comment will be printed
 *
 * 
 */
import { get } from './get';
import { set } from './set';
import { getExpressByStr, getPropertyFieldByCreate } from './getPropertyFieldByCreate';
import { getPropByPath } from './getPropByPath'

export interface IPropertyUtils {
  get: typeof get;
  set: typeof set;
  getPropByPath: typeof getPropByPath, 
  getPropertyFieldByCreate: typeof getPropertyFieldByCreate, 
  getExpressByStr: typeof getExpressByStr, 
}

export { 
  getPropByPath, 
  getPropertyFieldByCreate, 
  getExpressByStr
}
export { get, set } from 'lodash';

/** 
 * 123456
 */