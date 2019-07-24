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
import { get, set } from '../LodashExtra';
import { asyncComputed } from './AsyncProperty';
import { get as Get } from './get';
import { getPropByPath } from './getPropByPath';
import { getExpressByStr, getPropertyFieldByCreate } from './getPropertyFieldByCreate';
import { set as Set } from './set';

export interface IPropertyUtils {
  get: typeof Get;
  set: typeof Set;
  getPropByPath: typeof getPropByPath;
  getPropertyFieldByCreate: typeof getPropertyFieldByCreate;
  getExpressByStr: typeof getExpressByStr;
  asyncComputed: typeof asyncComputed;
}

export { getPropByPath, getPropertyFieldByCreate, getExpressByStr, asyncComputed, get, set };


/**
 * 123456
 */