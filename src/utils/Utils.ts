/* eslint-disable */
import CommonUtils from './commonUtils';
import * as OptionsUtils from './OptionsUtils';
import CustomUtils from './CustomUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";

export const Utils: typeof CustomUtils & typeof OptionsUtils & typeof typeUtils & typeof CommonUtils & typeof TimeBufferUtils & typeof typeFilterUtils = {
  ...CommonUtils,
  ...OptionsUtils,
  ...TimeBufferUtils,
  ...typeUtils,
  ...typeFilterUtils,
  ...CustomUtils
};

