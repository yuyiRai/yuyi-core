/**
 * @module Main
 */
import { assign } from 'lodash';
import * as commonUtils from './commonUtils';
import * as CustomUtils from './CustomUtils';
import * as MobxUtils from './MobxUtils';
import * as OptionsUtils from './OptionsUtils';
import * as ParseUtils from "./ParseUtils";
import * as PropertyUtils from './PropertyUtils';
import { IPropertyUtils } from './PropertyUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";

export type IUtils = typeof CustomUtils
  & typeof OptionsUtils
  & typeof typeUtils
  & typeof commonUtils
  & typeof TimeBufferUtils
  & IPropertyUtils
  & typeof typeFilterUtils
  & typeof ParseUtils
  & typeof MobxUtils

export const Utils: IUtils = assign(
  commonUtils,
  OptionsUtils,
  TimeBufferUtils,
  typeUtils,
  PropertyUtils,
  typeFilterUtils,
  CustomUtils,
  ParseUtils,
  MobxUtils
) as IUtils;

