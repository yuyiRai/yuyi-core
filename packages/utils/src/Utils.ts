/**
 * @module Main
 */

import { Constant$ } from './Constransts';
import * as commonUtils from './commonUtils';
import * as CustomUtils from './CustomUtils';
import * as EventEmitterUtils from './EventEmitter';
import * as LodashExtra from './LodashExtra';
import * as MobxUtils from './MobxUtils';
import * as OptionsUtils from './OptionsUtils';
import * as ParseUtils from "./ParseUtils";
import * as PropertyUtils from './PropertyUtils';
import * as DecoratorUtils from './DecoratorUtils';
// import * as TestUtils from './TestUtils';
// tslint:disable-next-line: no-duplicate-imports
import TimeBufferUtils from './TimeBuffer';
import { expect$, typeFilterUtils } from "./TypeLib";

type IUtilsGroup = typeof CustomUtils
  & typeof OptionsUtils
  & typeof EventEmitterUtils
  & typeof commonUtils
  & typeof TimeBufferUtils
  & typeof PropertyUtils
  & typeof DecoratorUtils
  // & typeof TestUtils
  & typeof LodashExtra
  & typeof ParseUtils
  & typeof MobxUtils
  & typeof expect$
  & typeof typeFilterUtils

export interface IUtils extends IUtilsGroup {

}

export const Utils: IUtils = Object.freeze(Constant$.OBJ_ASSIGN(
  {},
  LodashExtra,
  commonUtils,
  OptionsUtils,
  TimeBufferUtils,
  EventEmitterUtils,
  // TestUtils,
  PropertyUtils,
  expect$,
  CustomUtils,
  ParseUtils,
  MobxUtils,
  typeFilterUtils,
  DecoratorUtils
)) as IUtils;

// export function UtilsTest() {
//   return Utils.isFunction(1)
// }
