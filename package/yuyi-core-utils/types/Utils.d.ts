/**
 * @module Main
 */
import commonUtils from './commonUtils';
import * as OptionsUtils from './OptionsUtils';
import { IPropertyUtils } from './PropertyUtils';
import * as CustomUtils from './CustomUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";
import * as ParseUtils from "./ParseUtils";
import * as MobxUtils from './MobxUtils';
export declare type IUtils = typeof CustomUtils & typeof OptionsUtils & typeof typeUtils & typeof commonUtils & typeof TimeBufferUtils & IPropertyUtils & typeof typeFilterUtils & typeof ParseUtils & typeof MobxUtils;
export declare const Utils: IUtils;
