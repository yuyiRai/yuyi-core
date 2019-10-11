import NTable from '../NTable/component'

export const STable = {
  mixins: [NTable],
  name: 'SystemTable',
  props: {
    pageNum: {
      type: Number,
      default() {
        return (this.pageURI && (this.$route && this.$route.params && this.$route.params.pageNo && parseInt(this.$route.params.pageNo))) || 1
      }
    },
    /**
     * 启用URI-Page模式
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'localPagination.current'(val) {
      if (this.pageURI) {
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNo: val
          })
        })
      }
    },
    '$route.path': {
      handler(to, from) {
        if (!from || !this.boundPath) {
          this.boundPath = to
        } else if (to === this.boundPath && to !== from) {
          // console.error('route switch into refresh')
          this.refresh()
        }
      },
      immediate: true
    }
  }
}
export default STable
