import { Checkbox, Icon, Input, Menu } from 'ant-design-vue'
import { pullAll, reduce, values, keys } from 'lodash'
const { Item, ItemGroup, SubMenu } = Menu
const { Search } = Input

export default {
  name: 'LoadableTree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    },
    topOnly: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.localOpenKeys = this.openKeys.slice(0)
    this.localSelectedKeys = this.selectedKeys.slice(0)
  },
  data () {
    return {
      localOpenKeys: [],
      localSelectedKeys: []
    }
  },
  methods: {
    handlePlus (item) {
      this.$emit('add', item)
    },
    handleTitleClick (...args) {
      this.$emit('titleClick', { args })
    },
    renderSearch () {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    },
    renderIcon (icon) {
      return null && icon && (<Icon type={icon} />) || null
    },
    renderMenuItem (item, parentPath) {
      return (
        <Item ref={item.key} key={item.key}>
          <Checkbox style={{ marginLeft: '-30px', marginRight: '10px' }} checked={this.keysSelectedMap[item.key].checked}/>
          { this.renderIcon(item.icon) }
          { item.title }
          { this.add && <a class="btn" style="width: 20px;z-index:1300" {...{ on: { click: () => this.handlePlus(item) } }}><a-icon type="plus"/></a>}
        </Item>
      )
    },
    renderItem (item, parentPath = []) {
      return item.children ? this.renderSubItem(item, parentPath.concat([item.key])) : this.renderMenuItem(item, parentPath.concat([item.key]))
    },
    renderItemGroup (item, parentPath) {
      const childrenItems = item.children.map(o => {
        return this.renderItem(o, parentPath)
      })

      return (
        <ItemGroup key={item.key}>
          <template slot="title">
            <span>{ item.title }</span>
            <a-dropdown>
              <a class="btn"><a-icon type="ellipsis" /></a>
              <a-menu slot="overlay">
                <a-menu-item key="1">新增</a-menu-item>
                <a-menu-item key="2">合并</a-menu-item>
                <a-menu-item key="3">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          { childrenItems }
        </ItemGroup>
      )
    },
    renderSubItem (item, parentPath) {
      const key = item.key
      const childrenItems = item.children && item.children.map(o => {
        return this.renderItem(o, parentPath)
      })
      const itemState = this.keysSelectedMap[item.key]
      const title = (
        <span slot="title">
          <Checkbox
            style={{ marginLeft: '-20px', marginRight: '0px' }}
            checked={itemState.checked}
            disabled={(itemState.checked && !itemState.indeterminate)}
            indeterminate={itemState.indeterminate}
            on={{
              'click': e => {
                // e.preventDefault()
                e.stopPropagation()
                this.$nextTick(() => {
                  const checked = e.target.checked
                  if (checked && !this.localSelectedKeys.includes(key)) {
                    console.log('check all')
                    this.localSelectedKeys = Array.from(new Set([...this.localSelectedKeys, ...this.getAllChildrenKeys(item)]))
                  } else if (!checked) {
                    this.localSelectedKeys = pullAll([...this.localSelectedKeys], this.getAllChildrenKeys(item))
                  }
                  this.onHandleChange({ ...item, domEvent: e, keyPath: parentPath })
                  this.$forceUpdate()
                  console.log(checked, this.keysSelectedMap, this.localSelectedKeys)
                })
              }
            }}
          />
          { this.renderIcon(item.icon) }
          <span>{ item.title }</span>
        </span>
      )

      if (item.group) {
        return this.renderItemGroup(item)
      }
      // titleClick={this.handleTitleClick(item)}
      return (
        <SubMenu key={key} onTitleClick={console.log}>
          { title }
          { childrenItems }
        </SubMenu>
      )
    },
    handleClick (item) {
      if (this.localSelectedKeys.includes(item.key)) {
        this.localSelectedKeys = pullAll([...this.localSelectedKeys], [item.key])
      } else {
        // this.$set(this.localSelectedKeys, this.localSelectedKeys.length + 1, item.key)
        this.localSelectedKeys = Array.from(new Set([...this.localSelectedKeys, ...item.keyPath]))
      }
      this.onHandleChange(item)
      // console.log(this.keysSelectedMap)
    },
    onHandleChange(item) {
      this.$emit('update:selectedKeys', this.localSelectedKeys)
      this.$emit('change', item)
    },
    computedSelected(item) {
      const res = { checked: this.localSelectedKeys.includes(item.key), indeterminate: false, key: item.key, item }
      let children = {}
      if (Array.isArray(item.children)) {
        item.children.forEach(child => {
          children = { ...children, ...this.computedSelected(child) }
        })
        res.children = children
        const cildrenList = values(res.children)
        res.indeterminate = cildrenList.some(item => item.checked === true) && cildrenList.some(item => item.checked === false)
      }
      return { [item.key]: res, ...children }
    },
    getAllChildrenKeys(item) {
      return reduce(item.children || [], (list, item) => list.concat(this.getAllChildrenKeys(item)), [item.key])
    },
    getAllChildrenKeysBykey(key, sourceList = this.dataSource) {
      return reduce(sourceList, (list, item) => {
        if (item.key === key) {
          return list.concat(this.getAllChildrenKeys(item))
        }
        return list
      }, [])
    }
  },
  computed: {
    keysSelectedMap() {
      return reduce(this.dataSource, (obj, item) => {
        return { ...obj, ...this.computedSelected(item) }
      }, {})
    },
    topRootSelectedKeys() {
      const baseSelectedKeys = [...this.localSelectedKeys]
      values(this.keysSelectedMap).forEach(item => {
        if (item.checked && !item.indeterminate && item.children) {
          pullAll(baseSelectedKeys, keys(item.children))
        }
      })
      // console.log('topRootSelectedKeys', baseSelectedKeys, this.localSelectedKeys)
      return baseSelectedKeys
    }
  },
  watch: {
    dataSource(sourceList) {
      // console.log('sourceList loaded')
      this.localSelectedKeys = Array.from(new Set(
        this.localSelectedKeys.reduce((list, key) => list.concat(this.getAllChildrenKeysBykey(key, sourceList)), [])
      ))
    },
    selectedKeys(selectedKeys) {
      // console.log('selectedKeys change', selectedKeys, selectedKeys === this.topRootSelectedKeys)
      if (selectedKeys !== this.topRootSelectedKeys && selectedKeys !== this.localSelectedKeys) {
        this.localSelectedKeys = selectedKeys.slice(0)
      }
      // this.$nextTick(() => {
      // })
    }
  },
  render () {
    const { dataSource, search } = this.$props
    const { handleClick } = this

    // this.localOpenKeys = openKeys.slice(0)
    const list = dataSource.map(item => {
      return this.renderItem(item)
    })

    return (
      <div class="tree-wrapper">
        { search ? this.renderSearch() : null }
        <Menu ref="rootMenu" mode="inline" class="custom-tree" {...{ on: { click: handleClick, 'update:openKeys': val => { this.localOpenKeys = val } } }} openKeys={this.localOpenKeys}>
          { list }
        </Menu>
      </div>
    )
  }
}
