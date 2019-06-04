/* eslint-disable */
import commonUtils from './commonUtils';
import * as OptionsUtils from './OptionsUtils';
import * as PropertyUtils from './PropertyUtils';
import * as CustomUtils from './CustomUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";
import * as ParseUtils from "./ParseUtils";
import * as MobxUtils from './MobxUtils'

export type IUtils = typeof CustomUtils 
& typeof OptionsUtils 
& typeof typeUtils 
& typeof commonUtils 
& typeof TimeBufferUtils 
& typeof PropertyUtils
& typeof typeFilterUtils
& typeof ParseUtils
& typeof MobxUtils

export const Utils: IUtils = ({
  ...commonUtils,
  ...OptionsUtils,
  ...TimeBufferUtils,
  ...typeUtils,
  ...PropertyUtils,
  ...typeFilterUtils,
  ...CustomUtils,
  ...ParseUtils,
  ...MobxUtils
}) as IUtils;

