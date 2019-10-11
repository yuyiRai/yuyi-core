import SlotsMixin from "./SlotsMixin";
import Component from 'vue-class-component';

@Component({})
export default class SlotsWarpMixins extends SlotsMixin {

  /**
   * 向下传递所有slot
   * @public
   * @type {Slots}
   */
  warpSlots() {
    return Object.keys(this.$slots).map(slotName => (
      <template slot={slotName}>{
        /** @slot warpSlots */
        this.$slots[slotName]
      }</template>
    ))
  }
}