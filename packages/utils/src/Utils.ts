/**
 * @module Main
 */

import * as commonUtils from './commonUtils';
import * as CustomUtils from './CustomUtils';
import * as EventEmitterUtils from './EventEmitter';
import * as MobxUtils from './MobxUtils';
import * as OptionsUtils from './OptionsUtils';
import * as LodashExtra from './LodashExtra'
import * as TestUtils from './TestUtil'
import * as ParseUtils from "./ParseUtils";
import * as PropertyUtils from './PropertyUtils';
// tslint:disable-next-line: no-duplicate-imports
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";

type IUtilsGroup = typeof CustomUtils
  & typeof OptionsUtils
  & typeof EventEmitterUtils
  & typeof commonUtils
  & typeof TimeBufferUtils
  & typeof PropertyUtils
  & typeof TestUtils
  & typeof LodashExtra
  & typeof ParseUtils
  & typeof MobxUtils
  & typeof typeUtils
  & typeof typeFilterUtils

export interface IUtils extends IUtilsGroup {

}

export const Utils: IUtils = Object.freeze(LodashExtra.assign(
  {},
  LodashExtra,
  commonUtils,
  OptionsUtils,
  TimeBufferUtils,
  EventEmitterUtils,
  TestUtils,
  PropertyUtils,
  typeUtils,
  typeFilterUtils,
  CustomUtils,
  ParseUtils,
  MobxUtils
)) as IUtils;

export function UtilsTest() {
  return Utils.isFunction(1)
}