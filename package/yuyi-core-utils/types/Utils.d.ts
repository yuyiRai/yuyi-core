/**
 * @module Main
 */
import * as commonUtils from './commonUtils';
import * as CustomUtils from './CustomUtils';
import * as EventEmitterUtils from './EventEmitter';
import * as MobxUtils from './MobxUtils';
import { OptionsUtils } from './OptionsUtils';
import * as LodashExtra from './LodashExtra';
import * as TestUtils from './TestUtil';
import * as ParseUtils from "./ParseUtils";
import { IPropertyUtils } from './PropertyUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";
declare type UtilsStatic = typeof CustomUtils & typeof OptionsUtils & typeof EventEmitterUtils & typeof commonUtils & typeof TimeBufferUtils & IPropertyUtils & typeof TestUtils & typeof LodashExtra & typeof typeUtils & typeof typeFilterUtils & typeof ParseUtils & typeof MobxUtils;
export interface IUtils extends UtilsStatic {
}
export declare let Utils: IUtils;
export {};
//# sourceMappingURL=Utils.d.ts.map