import { KeyMapList } from '@/core/helper/utils';
import TreeSelect from 'ant-design-vue/es/tree-select';
import { TreeNode } from 'ant-design-vue/types/tree-node';
import { castArray, difference, filter, isBoolean, map, memoize, pullAll } from 'lodash';
import { Component } from 'vue-property-decorator';
import { OrgInfo, OrgOption } from './interface';
import TreeExtraMixins from './TreeExtraMixins';

/**
 * 记录code到info的映射
 */
const tempCodeDtoMap = new Map<string, OrgOption>()
/**
 * 记录作为父节点存在的code
 */
const parentNodeCodeSet = new Set<string>()


export const levelKeyword = '_$$level'
@Component({})
export class TreeMixins extends TreeExtraMixins {
  _lastLocalComcodeList: string[];

  /** 覆盖强制使用懒加载 */
  useAppendLoadOverwrite: boolean = true
  prevOptionsCodeList: string[];
  prevOptionsLevelMap: { [x: string]: string; };

  /**
   * 是否启用懒加载（内置加载/自定义但覆盖使用懒加载）
   */
  get useAppendLoad() {
    return !this.customLoader || (this.customLoader && this.useAppendLoadOverwrite);
  }

  preOrgList: KeyMapList<OrgOption, 'comcode'> = new KeyMapList('comcode', true)
  orgList: OrgOption[] = []
  /**
   * 选项数据集
   * 将数据预先存储在this.preOrgList，等到加载完毕后一口气返回
   */
  setOrgList(list: KeyMapList<OrgOption, 'comcode'> | OrgOption[]) {
    if (list instanceof KeyMapList) {
      this.preOrgList = list
    } else {
      this.preOrgList = KeyMapList.fromWithKey('comcode', list)
    }
  }
  appendOrgList(list: OrgOption | OrgOption[]) {
    const nextList = castArray(list).filter(({ orglevel, comcode, uppercomcode }) =>
      comcode === this.comCode ||
      uppercomcode === this.comCode ||
      orglevel > this.comInfoLevel
    )
    // debugger
    this.preOrgList.push(...nextList)
  }
  loadOrgList() {
    this.orgList = [...this.preOrgList.list]
  }


  /**
   * 已选择的comcode
   */
  localComcodeList: string[] = []
  setComcodeList(codeList: string[]) {
    this.localComcodeList = codeList;
    return codeList.length
  }

  /**
   * 重置当前选中的数组（索引）并返回
   */
  cloneSelfComcodeList() {
    this.localComcodeList = this.localComcodeList.slice(0)
    return this.localComcodeList
  }

  /**
   * 数据集的code列表
   */
  get optionsCodeList() {
    return map(this.preOrgList.list, 'comcode')
  }
  /**
   * 数据集的code列表
   */
  get optionsLevelMap(): { [key: string]: string } {
    return this.orgList.reduce((o, org) => ({ ...o, [org.comcode]: org.orglevel }), {})
  }

  /**
   * 本机机构代码
   */
  get comCode(): string {
    return this.comInfo && this.comInfo.comcode;
  }

  /**
   * 本机机构级别
   */
  get comInfoLevel() {
    return this.comInfo && this.comInfo.orglevel || '0'
  }

  /**
   * 该机构层级是否超出允许搜索的层级范围内
   * @param org 
   */
  isLevelLimited(level: number) {
    const { levelLimited } = this
    if (levelLimited <= 0) {
      return false
    }
    // console.error(levelLimited, level)
    return level >= levelLimited
  }

  /**
   * 该机构层级是否超出允许搜索的层级范围内（相对于自己的所属的级数）
   * @param org 
   */
  isLevelRelativeLimited(level: number) {
    const { levelRelativeLimited, comInfoLevel } = this
    // console.error(levelLimited, comInfoLevel)
    if (levelRelativeLimited === false) {
      return false
    }
    return level >= parseInt(comInfoLevel) + (levelRelativeLimited === true ? 0 : levelRelativeLimited)
  }

  /**
   * 该机构是否已经无法再往下搜索（即叶子节点
   * @param org 
   */
  isLimitedLevel(level: number) {
    return this.isLevelLimited(level) || this.isLevelRelativeLimited(level)
  }

  /**
   * 该层级是否超出允许边界
   * @param level 
   * @param offset 偏移量
   */
  isLevelOut(level: string, offset: number = 0) {
    return this.isLimitedLevel(parseInt(level) + offset)
  }

  /**
   * 转换组件展示用的机构信息
   * @param org 
   */
  transformToCompanyItem(org: OrgInfo): OrgOption {
    const { disabledOption } = this
    const disabled = disabledOption(org) || false
    return {
      ...org,
      id: org.comcode,
      key: org.comcode,
      pId: org.uppercomcode !== org.comcode ? org.uppercomcode : null,
      value: org.comcode,
      isLeaf: this.isLevelOut(org.orglevel) || (isBoolean(org.isLeaf) ? org.isLeaf : false),
      disabled: disabled,
      title: this.getDisplayTitle(org, this.useLevelNode)
    } as any
  }

  /**
   * 使用code单独获取节点的信息
   */
  public getNodeInfoByCode = memoize(async function (this: TreeMixins, code: string): Promise<OrgInfo> {
    try {
      if (tempCodeDtoMap.has(code)) {
        const info = tempCodeDtoMap.get(code)
        // console.log('has cache code', code, info.uppercomcode)
        return info as any
      }
      const data = await this.loader.getInfo(this.removeKeyword(code, true))
      // console.log('remove get code', code)
      return this.transformToCompanyItem(data)
    } catch (error) {
      this.getNodeInfoByCode && this.getNodeInfoByCode.cache.delete(code)
      return error
    }
  })

  /**
   * 查找一组机构code的上级code，查询出该上级code下的所有下级
   * 查找出上级机构后会以再向上级搜索
   * @param nextCodeList 
   * @param ignoreCode 
   */
  // @ts-ignore
  async queryListParentTree(nextCodeList: string[], ignoreCode: { [key: string]: boolean }) {
    const uppercomcodeSet = new Set<string>()
    const preChildrenList = [] // 缓存子列表，顺序上子列表应该在上级之后
    const queryInfo = nextCodeList.filter(code => !ignoreCode[code]).map(code => this.getNodeInfoByCode(code))
    for await (const info of queryInfo) {
      if (info && !(info instanceof Error) && !this.isLevelOut(info.orglevel)) {
        const { pId } = info
        if (pId && !ignoreCode[pId]) {
          const options = this.transformToCompanyItem(info)
          preChildrenList.push(options)
          uppercomcodeSet.add(pId)
          ignoreCode[options.comcode] = true
        }
      }
    }
    const nextStageList = Array.from<string>(uppercomcodeSet)
    console.log('newCodeList', nextStageList)
    if (nextStageList.length > 0) {
      const list = await this.queryListParentTree(nextStageList, ignoreCode)
      for (const code of list) {
        uppercomcodeSet.add(code)
      }
    }
    for (const comcode of nextStageList) {
      const comInfo = this.preOrgList.list.find(org => org.comcode === comcode)
      await this.appendLoadOptionData(comInfo)
    }
    this.appendOrgList(preChildrenList)
    return uppercomcodeSet
  }


  async appendLoadNodeData(node: TreeNode) {
    if (!node || node.value === this.comCode && this.optionsInited) {
      return null
    }
    const comInfo = await this.transformToCompanyItem(await this.getNodeInfoByCode(node.value))
    const list = await this.appendLoadData(comInfo)
    this.loadOrgList()
    return list
  }

  async appendLoadOptionData(node: OrgInfo) {
    if (!node || node.value === this.comCode && this.optionsInited) {
      return null
    }
    const comInfo: OrgInfo = node.orglevel !== undefined ? node : await this.getNodeInfoByCode(node.value)
    return this.appendLoadData(this.transformToCompanyItem(comInfo))
  }

  async handleUserComcodeChanged(comInfo: OrgInfo, prevComInfo: OrgInfo) {
    if (!comInfo) {
      return []
    }
    const { comcode: comCode, orglevel } = comInfo
    const { comcode: prevComcode, orglevel: prevOrglevel } = prevComInfo || {}
    const { prevOptionsCodeList, prevOptionsLevelMap } = this
    /**
     * 选项(重新)初始化标志
     */
    this.optionsInited = false

    if (this.customLoader) {
      const { openKeys = [], data, defaultValues, appendLoad = false } = await this.customLoader(comCode, this)
      // debugger
      this.setOrgList(data.map(this.transformToCompanyItem))
      this.useAppendLoadOverwrite = appendLoad;
      this.loadOrgList()
      debugger
      if (defaultValues instanceof Array) {
        this.localComcodeList = defaultValues
      }
      return openKeys
    }

    /**
     * 是否切换了机构
     */
    const isSwitchCom = !this.freedomSelectMode && prevComcode && prevComcode !== comCode

    /** 缓存的当前选中code */
    let lastLocalComcodeList: string[] = [...this.localComcodeList]
    /** 是否之前有选中 */
    const hasPreCode = lastLocalComcodeList.length > 0

    /** 默认展开的节点 */
    const rootAndUpperCode = [comCode]

    /**
     * 树的顶点
     */
    const root = this.transformToCompanyItem(comInfo)
    this.setOrgList([root])

    // 处理默认选择当前机构本级（在加载子节点之前就应该选中）
    let defaultSelectedCode = this.loadInitValue()
    if (defaultSelectedCode) {
      this.setComcodeList(defaultSelectedCode)
    }

    // 记录这次获得的节点
    const cacheMap = {}
    // 尝试加载子节点
    const nextAllCode = await this.appendLoadData(root, true, cacheMap)

    // 默认选中的codeList
    defaultSelectedCode = !defaultSelectedCode ? [...nextAllCode] : defaultSelectedCode


    // 排除掉上一个树的根节点作为未知code
    let excludePrevTree = true
    if (this.freedomSelectMode && this.switchTreeExtends && prevOrglevel > orglevel) {
      if (cacheMap[prevComcode]) {
        // 当当前树中含有上一次的顶级机构，直接将原有的机构树继承
        rootAndUpperCode.push(prevComcode)
        // 继承原机构树的下级
        this.appendOrgList(
          this.orgList.filter(org => org.orglevel > root.orglevel && this.isLevelOut(org.orglevel))
        )
        // 继承已经选中的值
        defaultSelectedCode.push(...lastLocalComcodeList)
        // // 将上一次的顶级机构全选改为只选中本级
        // defaultSelectedCode.forEach((code, index) => {
        //   if (code === prevComcode) {
        //     defaultSelectedCode[index] = this.setLevelKeyword(code)
        //   }
        // })
        // defaultSelectedCode = defaultSelectedCode.slice(0)
        // debugger
      } else {
        // 如果存在断层，不排除
        excludePrevTree = false
      }
    }

    if (this.searchUnknownCode) {
      // this.emitValue(this.nextComcodeList)
      // 取得不存在于选项中的code
      const unknownCodeList = hasPreCode && [...lastLocalComcodeList]
      // debugger
      if (unknownCodeList && unknownCodeList.length > 0) {
        const ignoreMap = {}
        if (!excludePrevTree) {
          // 存在断层时还是需要，不排除
          ignoreMap[prevComcode] = true
          ignoreMap[this.setLevelKeyword(prevComcode)] = true
        }
        for (const code of this.optionsCodeList) {
          ignoreMap[code] = true
        }
        if (excludePrevTree && prevOptionsCodeList && unknownCodeList && unknownCodeList.length > 0) {
          for (const code of prevOptionsCodeList) {
            ignoreMap[code] = true
          }
        }
        if (prevComInfo && prevOrglevel > orglevel) {
          for (const [code, level] of Object.entries(prevOptionsLevelMap)) {
            ignoreMap[code] = level === undefined || level > orglevel
          }
        }
        // console.error('多余的code', outCodeList, disallowMap, this.prevComcode)
        rootAndUpperCode.push(...Array.from((
          await this.queryListParentTree(
            unknownCodeList,
            ignoreMap
          )
        )))
      }
    }

    // console.log(this.localComcodeList, rootAndUpperCode, this.value, this)
    // console.log(this.$refs.tree)
    if (!this.optionsInited) {
      this.optionsInited = true
    }

    // debugger
    // 如果之前有选中，过滤只存在于选项中的value
    if (hasPreCode) {
      lastLocalComcodeList = lastLocalComcodeList.filter(code => this.preOrgList.has(code))
    }

    // 如果最后还是什么都没选中，使用默认选中
    const needDefaultSelect = defaultSelectedCode.length > 0
    if (needDefaultSelect && (this.switchRefresh || lastLocalComcodeList.length === 0 || isSwitchCom)) {
      this.setComcodeList(defaultSelectedCode)
    } else {
      this.setComcodeList(lastLocalComcodeList)
    }

    this.prevOptionsCodeList = [...this.optionsCodeList]
    this.prevOptionsLevelMap = { ...this.optionsLevelMap }

    this.loadOrgList()
    // console.log('switch', this.localComcodeList)
    return rootAndUpperCode
  }

  /**
   * 完全自由选择模式
   */
  get freedomSelectMode() {
    return !this.defaultSelected && !this.defaultSelectedAll
  }

  optionsInited: boolean;

  /**
   * 缓存code到orgInfo的map
   * @param comInfo 
   */
  cacheTempCodeDto(comInfo: OrgInfo) {
    const { comcode } = comInfo
    const searchkey = this.testKeyword(comcode) ? this.removeKeyword(comcode, true) : this.setLevelKeyword(comcode)
    const option = tempCodeDtoMap.get(searchkey) || this.transformToCompanyItem(comInfo)
    tempCodeDtoMap.set(comcode, option)
    tempCodeDtoMap.set(searchkey, option)
  }

  /**
   * 取得该节点的下级，返回下级codeList
   * @param comInfo 
   * @param strict 
   * @param cacheMap 
   */
  async appendLoadData(comInfo: OrgInfo, strict: boolean = true, cacheMap?: any) {
    let nextChildren: OrgInfo[] = []
    // 缓存
    this.cacheTempCodeDto(comInfo)
    try {
      if (!comInfo) return [];
      if (this.useLevelNode) {
        const levelOption = this.transformToCompanyItem(this.convertLevelItem(comInfo))
        nextChildren.push(levelOption)
        this.appendOrgList(levelOption)
        cacheMap && (cacheMap[levelOption.key] = true)
      }
      nextChildren = await this.loader.appendChildren(comInfo.value, comInfo.orglevel)
      for (const org of nextChildren) {
        const option = this.transformToCompanyItem(org)
        tempCodeDtoMap.set(org.comcode, option)
        this.appendOrgList(option)
        cacheMap && (cacheMap[option.key] = true)
      }
      parentNodeCodeSet.add(comInfo.comcode)
      return this.optionsCodeList
    } catch (e) {
      console.error(e)
      return this.optionsCodeList
    } finally {
      if (strict) {
        // 如果未取得该节点下的子集（或子集为空），判断该节点就是叶子节点
        if (nextChildren.length === 0) {
          const currentNode = this.preOrgList.list.find(org => org.value === comInfo.value)
          if (currentNode) {
            currentNode.isLeaf = true
            this.setOrgList(this.preOrgList.list)
            parentNodeCodeSet.delete(comInfo.comcode)
          }
        } else {
          this.cloneSelfComcodeList()
        }
      }
    }
  }

  /**
   * 已选择的机构序列
   */
  get localComcodeSelected() {
    const value = this.multiple ? this.localComcodeList : this.localComcodeList[0]
    // console.log('computed localComcodeSelected', value)
    return value
  }
  set localComcodeSelected(code) {
    this.localComcodeList = code ? castArray(code).slice(0) : []
  }

  get nextComcodeList(): string[] | string {
    const transform = this.transform
      ? (comcode: string) => {
        const data = filter(this.orgList, org => org.comcode = comcode)
        // console.error('transform prepare', data)
        return this.transform((data.length > 0 ? data[data.length - 1] : {}) as any)
      }
      : (v: string) => this.removeKeyword(v)
    const nextList = this.localComcodeList.map(code => {
      return transform(code)
    })
    return (this.multiple ? Array.from(new Set(castArray(nextList))) : (nextList[0] || ''))
  }

  get showCheckedStrategy() {
    return this.useParentShowOnly ? TreeSelect.SHOW_PARENT : (this.useLevelNode ? TreeSelect.SHOW_CHILDREN : TreeSelect.SHOW_ALL)
  }

  /**
   * 转换为本级用节点，固定是叶子节点不可展开
   * @param comInfo 
   */
  convertLevelItem(comInfo: OrgInfo): OrgInfo {
    return {
      ...comInfo,
      comcode: this.setLevelKeyword(comInfo.comcode),
      comcname: comInfo.comcname,
      uppercomcode: comInfo.comcode,
      isLeaf: true
    }
  }

  /**
   * 取得默认选中的机构
   * @returns 返回false表示需要全选的数据
   */
  loadInitValue() {
    if (this.defaultSelectedAll && !this.useParentShowOnly) {
      return false
      // console.error('localComcodeList', [...this.localComcodeList])
    } else {
      if (this.defaultSelected || (this.defaultSelectedAll && this.useParentShowOnly)) {
        // console.error('全选', this.useParentShowOnly ? [comCode] : [...this.optionsCodeList])
        return [this.setLevelKeyword(this.comCode)]
      } else if (this.defaultSelectedAll && this.useParentShowOnly) {
        return [this.comCode]
      }
      return []
    }
    // this.emitValue(this.nextComcodeList)
  }

}

export default TreeMixins;
