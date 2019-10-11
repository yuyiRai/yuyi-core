<template>
  <div :class="[prefixCls, 'ant-input', { focus: isFocus }]" :style="{ height }">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      :disabled="disabled"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
      style="height: calc(100% - 96px);"
    ></quill-editor>
    <div ref="view" v-html="content" style="display: none"></div>
  </div>
</template>

<script>
// import Vue from 'vue'
import VueQuillEditor, { quillEditor } from 'vue-quill-editor'
import {} from 'lodash'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import hljs from 'highlight.js'

// Vue.use(VueQuillEditor, {})

const QuillEditor = {
  /**
   * 校验转换，取[HTML文本/InnerText]中的InnerText来校验长度
   * 如果有[InnerText]则取出并进行格式清理
   * @param value value
   */
  getNormalizeValue(value) {
    // console.error('getNormalizeValue', value, value instanceof Array && value[1] ? trim(value[1]) : undefined)
    // eslint-disable-next-line
    let [content, contentText] = value instanceof Array ? value : []
    if (content && !contentText) {
      const div = document.createElement('div')
      div.innerHTML = content
      contentText = div.innerText
      div.remove()
    }
    return contentText
  },
  name: 'AntQuillEditor',
  components: {
    quillEditor
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-quill'
    },
    // 表单校验用字段
    // eslint-disable-next-line
    value: {
      type: null
    },
    disabled: {
      type: Boolean
    },
    readOnly: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请输入...'
    },
    line: {
      type: Number,
      default: 4
    }
  },
  computed: {
    editorOption() {
      return {
        ...this.baseEditorOption,
        placeholder: this.placeholder,
        readOnly: this.readOnly,
        strict: false
      }
    },
    height() {
      return this.line > 0 ? `${this.line * 100}px` : 'auto'
    }
  },
  beforeDestroy() {
    if (this.destroy) {
      this.destroy()
    }
  },
  mounted() {
    // console.log('this.mounted', this.value)
    // this.content = this.value
    let textarea = this.$el.querySelector('.ql-editor') || this.$el
    textarea.addEventListener('focus', this.onEditorFocus)
    textarea.addEventListener('blur', this.onEditorBlur)
    this.destroy = () => {
      textarea.removeEventListener('focus', this.onEditorFocus)
      textarea.removeEventListener('blur', this.onEditorBlur)
      textarea = null
    }
  },
  data() {
    return {
      n: 0,
      isFocus: false,
      content: null,
      lastContent: null,
      contentText: null,
      baseEditorOption: {
        // some quill options
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean']
            // ['link', 'image', 'video']
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    }
  },
  methods: {
    setFocus(v) {
      if (this.isFocus !== v) {
        this.isFocus = v
      }
    },
    onEditorBlur(quill) {
      this.setFocus(false)
      // console.log('editor blur!')
      this.$emit('blur', [this.content, this.contentText])
    },
    onEditorFocus(quill) {
      this.setFocus(true)
      // console.log('editor focus!')
      this.$emit('focus', [this.content, this.contentText])
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
      this.$emit('ready')
    },
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.contentText = text ? text.replace(/\n$/, '') : ''
      // console.log('editor input!', quill, html, text)
      // if (text.length % 5 === 0) {
      this.emitValue()
      // }
    },
    emitValue() {
      if (this.lastContent !== this.content) {
        this.lastContent = this.content
        // console.log('editor change!', this.content)
        this.$emit('change', this.content)
        this.$emit('changeValues', [this.content, this.contentText])
      }
    },
    nextValue(val) {
      const [content, contentText] = val instanceof Array ? val : [val, undefined]
      if (content !== this.content) {
        console.log('value next', content, this.content)
        this.content = content
        this.contentText = contentText || QuillEditor.getNormalizeValue([content, contentText])
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.nextValue(val)
      },
      immediate: true
    }
  }
}
export default QuillEditor
</script>
<style lang="less">
@import url('../index.less');
.has-error .ant-editor-quill.ant-input {
  border-color: #f5222d !important;
  &.focus {
    border-color: #f5222d !important;
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2) !important;
    border-right-width: 1px !important;
  }
}
</style>
<style lang="less" scoped>
@import '../index';

/* 覆盖 quill 默认边框圆角为 ant 默认圆角，用于统一 ant 组件风格 */
.ant-editor-quill.ant-input {
  display: inline-block;
  padding: 0;
  padding-bottom: 10px;
  line-height: inherit;
  &.focus {
    // border-color: @primary-color;
    // box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    border-right-width: 1px !important;
  }
  /deep/ .ql-toolbar.ql-snow {
    border-width: 0;
    border-bottom-width: 1px;
  }
  /deep/ .ql-container.ql-snow {
    // border-radius: 0 0 @border-radius-base @border-radius-base;
    border-width: 0;
    padding: 0;
    .ql-editor {
      padding-bottom: 0;
    }
  }
  /deep/ .ql-snow {
    .ql-picker-label::before {
      position: absolute;
    }
    .ql-color-picker,
    .ql-icon-picker {
      .ql-picker-label svg {
        right: 4px;
        position: relative;
        top: -6px;
      }
    }
  }
}
</style>
