export * from '@yuyi/utils';
export * from './SlotUtils';
export * from './MessageUtils';
import * as MessageUtils from './MessageUtils';
import { IUtils as IU } from '@yuyi/utils';
export declare type IUtils = IU & typeof MessageUtils;
declare const Utils: IUtils;
export { Utils };
export default Utils;
//# sourceMappingURL=index.d.ts.map