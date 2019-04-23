<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    :disabled='disabled'
    :open-delay='100'
    @show="onShowPopover"
    @hide="onHidePopover">
    <el-collapse-transition>
      <div 
        v-show='showStatus'>
        <el-tree
          ref="tree"
          class="select-tree"
          highlight-current
          :node-key="props.value"
          :current-node-key='valueModel'
          :style="`min-width: ${treeWidth}`"
          :data="data"
          :props="props"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          :default-expand-all="true"
          @node-click="onClickNode">
        </el-tree>
      </div>
    </el-collapse-transition>
    <el-input v-loading='loading'
      slot="reference" :validate-event='false'
      ref="input" :readonly='readOnly || useFilter===false' :disabled='disabled'
      @input='onLabelInput'
      v-model="labelModel"
      clearable
      @clear="clear"
      :style="`width: ${width}px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder">
    </el-input>
  </el-popover>
</template>

<script>
import SelectTreeItem from './SelectTreeItem'
export default SelectTreeItem
</script>
<style>
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>
