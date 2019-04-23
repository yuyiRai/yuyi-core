<template>
    <MDialog ref='dialog' @submit='submit' @close='close' :dialogType='dialogType' :dialogConfig='dialogConfig' :width="width || '60%'" :top="top || '15vh'" 
        :is-hidden-exsist='isHiddenExsist' @exsist-change="$emit('exsist-change', $event)" >
        <slot slot='title' name='title'></slot>
        <slot></slot>
        <template v-if='returnModel' slot='operaBtn'>
            <slot name='operaBtn'></slot>
            <el-button @click='close'>返回</el-button>
        </template>
        <template v-else>
            <slot slot='operaBtn' name='operaBtn'></slot>
        </template>
    </MDialog>
</template>

<script>
/* eslint-disable */
import MDialog from "../TablePage/dialog.vue";
export default {
    components: { MDialog },
    inject: {
      cForm: {
        default: Utils.stubObject
      }
    },
    props: [ 'title', 'setting', 'submitText', 'cancelText', 'show', 'width', 'top', 'is-hidden-exsist' ],
    computed: {
      dialogConfig() {
        return {
          titleMap: { open: this.title }, 
          submitTextMap: { open: this.submitText || '提交' }, 
          cancelTextMap: { open: this.cancelText || "取消" }
        }
      },
      dialogType() {
          return this.show ? 'open' : 'close'
      },
      returnModel() {
        // console.log('returnModel', this.setting==='return', this.cForm.formStatus)
        return this.setting==='return' || this.cForm.formStatus==='view'
      }
    },
    methods: {
        submit(dialogType, done) {
            this.$emit("submit", close => {
                done(close);
            });
        },
        close() {
            this.$emit("close")
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style>

</style>
