import { getStrFullLength } from '../_util/util'
import Ellipsis from '../Ellipsis/index.js'
import styled from 'vue-styled-components';
import Vue from 'vue'
export const CommonCell = Vue.extend({
  props: ['value'],
  mounted() {
    this.mounted()
  },
  // updated() {
  //   this.mounted()
  // },
  data() {
    return {
      length: 100
    }
  },
  methods: {
    mounted() {
      // const parent = this.$el.parentElement
      let index = 0
      while (true) {
        // const left = parseInt(this.getStyle(parent, 'paddingLeft'))
        // const right = parseInt(this.getStyle(parent, 'paddingRight'))
        // const innerWidth = parent.offsetWidth - left - right
        if (this.$el.offsetHeight > 20) {
          this.$el.innerText = this.$el.innerText.substring(0, this.$el.innerText.length - 4) + '...'
          index++
        } else {
          break
        }
        // if (/汉字中文/.test(this.$el.innerText)) {
        //   console.error(index, this.$el.offsetHeight, this.$el.innerText, getStrFullLength(this.$el.innerText || '') - 4)
        // }
      }
      if (index > 0) {
        this.length = getStrFullLength(this.$el.innerText || '') - 4
      } else {
        this.length = -1
      }
    },
    getStyle(obj, styleName) {
      if (obj.currentStyle) {
        return obj.currentStyle[styleName]
      } else {
        return window.getComputedStyle(obj, null)[styleName]
      }
    }
  },
  render(h) {
    const { value } = this
    return (
      value && (length !== -1) ? <Ellipsis tooltip={true} length={length} style={{ wordBreak: 'break-all' }}>{value}</Ellipsis> : <span>{value}</span>
    )
  }
})

export const AutoWidthCell = styled('span', {
  maxWidth: String,
  minWidth: String,
})`
  min-width: ${props => props.minWidth};
  max-width: ${props => props.maxWidth};
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
