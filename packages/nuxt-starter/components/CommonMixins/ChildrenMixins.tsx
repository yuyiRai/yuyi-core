import { VNodeChildren } from 'vue';
import { Component, Inject, Prop } from 'vue-property-decorator';
import SlotsMixin from './SlotsMixin';

export interface IChildrenMixinsProps extends Pick<ChildrenMixins, 'children'> {

}

@Component({})
export class ChildrenMixins extends SlotsMixin {
  /**
   * @see slots.default
   * @type {ScopedSlot} default
   */
  @Prop({
    type: null,
    default() { return SlotsMixin.slots(this, 'default') || null }
  })
  children?: VNodeChildren;
}

export default ChildrenMixins
