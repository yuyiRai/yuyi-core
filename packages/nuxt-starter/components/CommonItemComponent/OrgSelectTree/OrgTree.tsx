import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { likeArray } from '@yuyi/utils';
import TreeSelect from 'ant-design-vue/es/tree-select';
import { castArray } from 'lodash';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ITreeProps, OrgInfo } from './interface';
import TreeMixins from './TreeMixins';

@Component({})
export class OrgTreeBase extends TreeMixins {
  @Watch('nextComcodeList')
  onNextComcodeListReceive(nextValue: string | string[]) {
    this.emitValue(nextValue);
  }

  @Watch('value', { immediate: true })
  onNextValueReceive(comcodeList: string[]) {
    comcodeList = comcodeList ? castArray(comcodeList) : [];
    if (!likeArray(comcodeList, this.localComcodeList.map(code => this.removeKeyword(code)))) {
      this.localComcodeList = this.transformFrom ? comcodeList.map(code => this.transformFrom(code, this.orgList)) : comcodeList;
    }
  }

  @Watch('comInfo', { immediate: true })
  async onNextComcodeReceive(comInfo: OrgInfo, prevComInfo: OrgInfo) {
    if (!prevComInfo || comInfo && prevComInfo && comInfo.comcode !== prevComInfo.comcode) {
      this.$autils.$commitWaiting();
      this.toggleSpinning(true);
      try {
        const rootAndUpperCode = await this.handleUserComcodeChanged(comInfo, prevComInfo);
        this.$nextTick(() => {
          this.openKeys = rootAndUpperCode;
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.toggleSpinning(false);
        // console.log('switch completed', this.nextComcodeList)
        this.emitValue(this.nextComcodeList);
      }
    }
  }
  optionsInited = false;
  openKeys = [];

  get on() {
    return {
      change: value => {
        this.localComcodeSelected = value;
      },
      treeExpand: keys => {
        // console.error(keys, this)
        this.openKeys = keys;
      }
    };
  }

  created() {
    console.log('WAITING', this);
    this.$autils.$commitWaiting();
  }

  lastUpdateValue: any;
  emitValue(nextValue: string | string[]) {
    if (!likeArray((nextValue as any) || [], (this.lastUpdateValue as any) || [])) {
      // console.error('emitvALUE', nextValue)
      this.lastUpdateValue = nextValue;
      this.$emit('update:value', nextValue);
      this.$emit('change', nextValue);
      this.$emit('blur', nextValue);
    }
    this.completeWaiting();
  }

  once: boolean
  completeWaiting() {
    this.$nextTick(() => {
      this.$autils.$commitFinish();
      if (this.optionsInited && !this.once) {
        console.log('FINISH');
        this.once = true;
      }
    });
  }


  render(h) {
    const { multiple, disabled, placeholder, showCheckedStrategy, prop: { style, ...other } } = this
    const nowLoading = this.localLoading
    const props = {
      props: {
        ...other,
        value: this.localComcodeSelected,
        treeExpandedKeys: this.openKeys
      },
      style,
      on: {
        ...this.on
      }
    }
    // const render = (
    //   <DynamicScroller
    //     items={this.orgList}
    //     min-item-size={27}
    //     class="scroller"
    //     {...{
    //       scopedSlots: {
    //         default: ({ item, index, active }) => {
    //           return (
    //             <DynamicScrollerItem
    //               item={item}
    //               active={active}
    //               size-dependencies={[
    //                 item.children
    //               ]}
    //               data-index={index}
    //             >
    //               <a-tree-select-node props={item} />
    //             </DynamicScrollerItem>
    //           )
    //         }
    //       }
    //     }}
    //   >
    //   </DynamicScroller>
    // )
    const children = (
      <TreeSelect
        ref="tree"
        class="ant-select-height-fixed"
        treeCheckable={multiple && true}
        disabled={disabled}
        showSearch
        placeholder={nowLoading ? '数据加载中...' : placeholder}
        allowClear
        showCheckedStrategy={showCheckedStrategy}
        multiple={multiple}
        loadData={this.useAppendLoad ? this.appendLoadNodeData : undefined}
        treeData={this.orgList}
        treeDataSimpleMode
        {...props}
      >
      </TreeSelect>
    )
    return this.useLoading ? this.useLoading(nowLoading, children, h) : children
  }
}
export default OrgTreeBase as VueComponent<ITreeProps>
