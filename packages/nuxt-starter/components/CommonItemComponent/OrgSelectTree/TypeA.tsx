// import { getOrgTree, getServiceList } from '@/api/manage'
import { DynamicScroller } from 'vue-virtual-scroller';
import TreePropsMixins from './interface';
import OrgTreeBase from './OrgTree';
import './TypeA.less';
DynamicScroller.isTreeNode = true

export default {
  mixins: [TreePropsMixins],
  props: {
    comInfo: undefined
  },
  render(h) {
    return (
      <OrgTreeBase
        comInfo={this.comInfo || this.$store.getters.comInfo}
        {...{
          props: {
            ...this.$props,
            comInfo: this.comInfo || this.$store.getters.comInfo
          },
          attrs: this.$attrs,
          on: this.$listeners
        }}
      />
    )
  }
}
