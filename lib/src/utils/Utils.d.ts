import CommonUtils from './commonUtils';
import * as OptionsUtils from './OptionsUtils';
import CustomUtils from './CustomUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";
import * as MessageUtils from './MessageUtils';
export declare const Utils: typeof CustomUtils & typeof OptionsUtils & typeof typeUtils & typeof CommonUtils & typeof TimeBufferUtils & typeof typeFilterUtils & typeof MessageUtils;
