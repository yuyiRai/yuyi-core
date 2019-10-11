import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
export type ScopedSlot = (props: any) => ScopedSlotReturnValue;
interface ScopedSlotReturnArray extends Array<ScopedSlotReturnValue> { }
type ScopedSlotReturnValue = VNode | string | boolean | null | undefined | ScopedSlotReturnArray;

@Component({})
export class SlotsMixin extends Vue {

  get __docgenInfo() {
    return (this.constructor as any).options && (this.constructor as any).options.__docgenInfo
  }
  set __docgenInfo(v) {
    (this.constructor as any).options.__docgenInfo = v;
    (this.constructor as any).options = { ...(this.constructor as any).options }
  }
  static slots(instance: SlotsMixin, name: string, ...props: any[]) {
    const _this = instance
    if (_this.__docgenInfo && _this.__docgenInfo.slots && !_this.__docgenInfo.slots[name]) {
      _this.__docgenInfo.slots[name] = {
        description: '???'
      }
      _this.__docgenInfo = { ..._this.__docgenInfo }
    }
    if (name === void 0) {
      name = 'default';
    }
    const { $slots, $scopedSlots } = _this;
    const scopedSlot = $scopedSlots[name];
    if (scopedSlot) {
      return (scopedSlot as any)(...props);
    }
    return $slots[name];
  }
  slots(name: string, ...props: any[]) {
    return SlotsMixin.slots(this, name, ...props)
  }
}

export default SlotsMixin
