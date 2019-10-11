<template>
  <LabelWidthFormContainer v-bind="$props" v-if="itemGroupKeys.length > 0">
    <a-form
      ref="form"
      :disabled="!!disabled"
      class="auto-created-form min-form"
      :form="form"
      :data="formData"
      layout="horizontal"
    >
      <!-- @slot 表单头部 -->
      <slot name="header"></slot>
      <a-spin :spinning="localSpinning">
        <AutoDescriptionList
          style="margin-bottom: 4px;"
          :title="description && description.title"
          :disabled="!description"
          :list="itemGroupKeys"
          :termMap="description && description.termMap"
        >
          <template slot="item" slot-scope="itemGroupKey">
            <AutoGroupRow
              :itemList="configDisplayMap[itemGroupKey]"
              :rowProps="{ gutter: 0 }"
              :class="['form-group-item', 'group-' + itemGroupKey]"
            >
              <template slot="item" slot-scope="itemConfig">
                <a-col :key="itemConfig.code" v-bind="itemConfig.container.col">
                  <component
                    :key="(isReadOnly ? 'r' : 'w') + itemConfig.code"
                    :is="itemConfig.containerComponent || defaultContainerComponent"
                    :class="[!getItemLabelNative(itemConfig) && 'hack-label']"
                    v-bind="getItemContainerProps(itemConfig)"
                  >
                    <span v-if="!getItemLabelNative(itemConfig)" slot="label">
                      <span v-if="$slots[itemConfig.code + '_label']">
                        <!--
                          @slot 自定义Label展示
                          code | string | 见itemConfig
                        -->
                        <slot name="label" :code="itemConfig.code"></slot>
                      </span>
                      <span v-else>
                        <HintComponent
                          :disabled="!itemConfig.hint"
                          :item="itemConfig"
                        >{{ itemConfig.label }}</HintComponent>
                      </span>
                    </span>
                    <component
                      v-decorator="[
                        itemConfig.code, utils.getItemDecorator(itemConfig)
                      ]"
                      :is="itemConfig.component"
                      v-bind="getItemInputProps(itemConfig)"
                    >
                      <span v-html="itemConfig.innerHTML" />
                    </component>
                  </component>
                </a-col>
              </template>
            </AutoGroupRow>
          </template>
        </AutoDescriptionList>
        <!-- @slot 表单主体追加内容 -->
        <slot></slot>
      </a-spin>
      <div v-if="$slots.operation || useOperation" class="auto-operation-bar">
        <!--
          @slot 插入操作栏
          spinning | boolean | 当前载入状态
        -->
        <slot v-if="$slots.operation" name="operation" :spinning="localSpinning"></slot>
        <AutoOperationBar
          :class="operationClass"
          :style="operationStyle"
          :spinning.sync="localSpinning"
          v-else-if="useOperation"
          v-bind="useOperation"
          v-on="autoOperationListeners"
        />
      </div>
      <div style="display: none;">
        <component
          v-for="item in configHiddenList"
          :key="item.code"
          :is="defaultContainerComponent"
        >
          <a-select
            mode="tag"
            :key="item.code"
            type="hidden"
            v-decorator="[item.code, {...utils.getItemDecorator(item), rules: []}]"
          />
        </component>
      </div>
      <!-- @slot 表单脚 -->
      <slot name="footer"></slot>
    </a-form>
  </LabelWidthFormContainer>
  <div v-else></div>
</template>
<script>
import Template from './Template.tsx'
export default {
  mixins: [Template]
}
</script>
<style lang="less">
@import '../../index.less';
@import '../common.less';

.ant-card {
  border-radius: @border-radius-base;
}

.auto-created-form {
  /deep/ .hack-label .ant-form-item-no-colon .ant-form-item-label .aml-notice-bar__content:after {
    content: ' ';
  }
  /deep/ .hack-label .ant-form-item-label .aml-notice-bar__content:not(.rolling):after {
    content: ':';
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
  /deep/ .hack-label .ant-form-item-label label:after {
    content: unset !important;
    position: relative;
  }
  /deep/ .form-group-item:not(:empty) {
    &:not(:nth-child(1)) {
      margin-bottom: 10px;
      &:after {
        content: ' ';
        position: absolute;
        width: 100%;
        top: 2px;
        display: block;
        border-bottom: 1px dashed fade(@border-color-base, 80%);
      }
    }
  }
  .auto-operation-bar {
    margin-bottom: 5px;
    margin-top: 20px;
  }
}
.ant-card-body .auto-created-form {
  /deep/ .form-group-item {
    position: relative;
    &:after {
      width: calc(100% + 30px);
      left: -15px;
    }
  }
}
</style>
