import { Icon, TreeSelect } from 'ant-design-vue';
import { Component, Inject, Watch } from 'vue-property-decorator';
import TreePropsMixins, { OrgInfo } from './interface';

export function getProps(mode: 'tree' | 'input', This: TreeExtraMixins) {
  switch (mode) {
    case 'tree':
      const div = document.createElement('div')
      div.style.position = 'static'
      let isMount = false
      let height: any = 0
      return {
        open: true,
        style: { opacity: 0 },
        getPopupContainer: node => {
          node.parentElement.appendChild(div)
          return div
        },
        dropdownClassName: 'treemenu',
        dropdownStyle: { overflow: 'auto', boxShadow: 'none', left: '0 !important', position: 'static !important', top: '0 !important', zIndex: 1, maxHeight: '100vh', minWidth: '10vw' },
        listener: () => {
          (This.$refs.tree as TreeSelect).$nextTick(() => {
            setTimeout(() => {
              // console.error('listener')
              height = This.rowContext.$el.offsetHeight + 'px'
              This.$el.querySelector<HTMLDivElement>('.treemenu').style.position = 'static'
              This.$el.querySelector<HTMLDivElement>('.treemenu').style.top = `0`
              This.$el.querySelector<HTMLDivElement>('.treemenu').style.maxHeight = height
              if (!isMount) {
                // console.error('rowHeight', height)
                const style = { ...This.$el.querySelector<HTMLDivElement>('.treemenu').style }
                Object.defineProperty(style, 'top', { get() { return 0 }, set(v) { }, configurable: false })
                Object.defineProperty(style, 'position', { get() { return 'static' }, set(v) { }, configurable: false })
                Object.defineProperty(style, 'maxHeight', { get() { return height }, set(v) { height = v }, configurable: false })
                Object.defineProperty(This.$el.querySelector('.treemenu'), 'style', { get() { return style }, configurable: false })
                isMount = true
              }
            }, 100)
          })
        }
      }
    default: return {
      style: { width: '100%' },
      getPopupContainer(v) {
        This.$nextTick(() => {
          setTimeout(() => {
            const el = This.$el.parentElement && This.$el.parentElement.querySelector<HTMLDivElement>('.ant-select-tree-dropdown')
            // console.error(This, el)
            if (el) {
              const style = el.style
              style.top = `39px`
              Object.defineProperty(style, 'top', { get() { return '39px' }, set(v) { }, configurable: false })
            }
          }, 100);
        })
        return (v && v.parentElement) || v || This.$el || document.body
      },
      dropdownStyle: { maxHeight: '400px', top: '39px !important', overflow: 'auto' }
    }
  }
}

export const levelKeyword = '_$$level'

@Component({})
export class TreeExtraMixins extends TreePropsMixins {

  @Inject({ from: 'rowContext', 'default': () => null })
  rowContext: any;

  prop: any = {}

  mounted() {
    if (this.mode === 'tree') {
      // Object.assign(this.$refs.tree.$props, this.prop)
      window.addEventListener('resize', this.prop.listener)
    }
  }
  updated() {
    if (this.mode === 'tree') {
      this.prop.listener()
    }
  }
  beforeDestroy() {
    if (this.mode === 'tree') {
      window.removeEventListener('resize', this.prop.listener)
    }
    // this.completeWaiting()
  }

  @Watch('mode', { immediate: true })
  onModeChanged(mode) {
    this.prop = getProps(mode, this)
  }

  setLevelKeyword(id: string) {
    return id + this.levelKeyword
  }
  testKeyword(id: string) {
    return new RegExp(`${(levelKeyword || '').replace(/\$/ig, '\\$')}$`).test(id)
  }
  removeKeyword(id: string, force?: boolean) {
    return force || (!this.allowLevelKeyword && this.testKeyword(id)) ? (id + '').replace(this.levelKeyword, '') : id
  }

  renderIcon(icon: string) {
    // @ts-ignore
    return this.mode === 'tree' && icon && (<Icon type={icon} style={{ marginRight: '5px' }} />) || null
  }

  getDisplayTitle(org: OrgInfo, useLevelNode: boolean = true) {
    if (useLevelNode && this.testKeyword(org.comcode)) {
      return () => {
        // console.log(this, props)
        let title: any[] = [org.comcname]
        if (this.testKeyword(org.comcode)) {
          title = [this.removeKeyword(org.comcname), <b>- 本级 -</b>]
        }
        return (
          <span>
            <span class='antd-select-only'>{title[0]}</span>
            <span class='antd-tree-list-only'>{this.renderIcon('folder')}{title[1] || title[0]}</span>
          </span>
        )
      }
    }
    return org.comcname
  }
}


export default TreeExtraMixins
