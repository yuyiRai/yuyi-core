<template>
    <el-dialog 
        :title="titleText"
        :visible.sync="visibleDialog"
        :before-close="closeDialog" 
        :close-on-press-escape='!waitingDialog'
        :close-on-click-modal='!waitingDialog'
        :width="width || '80%'"
        :top="top || '15vh'"
        append-to-body>
        <template slot='title' >
          {{ titleText }}
          <slot name='title'></slot>
        </template>
        <slot v-if='exsist' v-show='visibleDialog'></slot>
        <div slot="footer" class="dialog-footer">
            <slot name='operaBtn'></slot>
            <el-button v-if='!$slots.operaBtn && !waitingDialog' @click="closeDialog(null)">{{ cancelText || '取消' }}</el-button>
            <el-button v-if='!$slots.operaBtn && submitText' type="primary" @click="completeDialog(dialogType)" :loading='waitingDialog'>{{submitText}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
export default {
  computed: {
    submitText() {
      // 提交按钮的文字
      if (this.waitingDialog) return "...提交中";
      if (!this.dialogConfig.submitTextMap) return "确认";
      return this.getMap(this.dialogConfig.submitTextMap[this.dialogType]);
    },
    cancelText() {
      if (!this.dialogConfig.cancelTextMap) return "取消";
      return this.getMap(this.dialogConfig.cancelTextMap[this.dialogType]);
    },
    titleText() {
      if (!this.dialogConfig.titleMap) return "";
      return this.getMap(this.dialogConfig.titleMap[this.dialogType]);
    },
    visibleDialog: {
      get() {
        return this.dialogType != "close";
      },
      set(value) {
        if (value == false) this.closeDialog();
      }
    }
  },
  props: {
    dialogConfig: {
      type: Object,
      default: () => ({
        titleMap: {
          // 标题文字
          add: "新增",
          edit: "编辑"
        },
        submitTextMap: {
          // 弹出框按钮文字
          add: "确定",
          edit: "修改"
        },
        cancelTextMap: {}
      })
    },
    dialogType: {
      type: String,
      required: true
    },
    isHiddenExsist: {},
    width: {},
    top: {}
  },
  watch:{
    async visibleDialog(show){
      // console.log('exsist show', show, this.isHiddenExsist)
      if(this.isHiddenExsist!==false) {
          this.exsist = show===true ? true : (await Utils.waitingPromise(350, false))
          // console.log('exsist change', this.exsist)
      }
    },
    exsist(exsist) {
      // console.log('exsist change', exsist)
      this.$emit('exsist-change', exsist)
    }
  },
  data() {
    return {
      waitingDialog: false,
      exsist: this.isHiddenExsist!==false ? false : true
    };
  },
  methods: {
    getMap(mapOrMethod) {
      if (typeof mapOrMethod == "function") {
        return mapOrMethod();
      }
      return mapOrMethod;
    },
    closeDialog(done) {
      this.waitingDialog = false;
      if (done) done();
      this.$emit("close");
    },
    completeDialog(dialogType) {
      this.waitingDialog = true;
      this.$emit("submit", dialogType, close => {
        this.waitingDialog = false;
        if (close) {
          this.closeDialog();
        }
      });
    }
  }
};
</script>

