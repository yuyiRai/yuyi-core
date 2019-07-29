export * from '@yuyi/utils'
export * from './SlotUtils'
export * from './MessageUtils'
import * as MessageUtils from './MessageUtils'
import { Utils as U, IUtils as IU } from '@yuyi/utils'
export type IUtils = IU & typeof MessageUtils
const Utils: IUtils = {
  ...MessageUtils,
  ...U
}
export {
  Utils
}
export default Utils