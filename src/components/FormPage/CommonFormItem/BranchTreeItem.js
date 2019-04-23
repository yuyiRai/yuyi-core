/* eslint-disable */
import request from '@/utils/request'
export default class BranchTreeItem {
  options = []
  type = 'selectTree'
  code = 'claimCompanyCode'
  valueCode = 'branchCode'
  nameCode = 'branchName' 
  label = '机构'
  loading = true
  
  constructor(config, level, topBranchCode){
    for(const key in config){
      this[key] = config[key]
    }
    this.getDataTree(level, topBranchCode, 'constructor')
  }

  getDataTree = async (level = 1, topBranchCode, source) => {
    this.loading = true
    const tree = await this.getBranchCode(level, topBranchCode)
    this.options = [...tree]
    this.loading = false
    // console.log('options update', tree, source);
  }

  getBranchCode = async(level, topBranchCode) => {
    return await this.getTree(Utils.isString(topBranchCode) ? [await request({
      url: 'branch/get',
      params: { branchCode: topBranchCode }
    })] : null, {
      getKey: 'branchCode',
      queryKey: 'upperBranchCode',
      onListUpdate: () => {
        // console.log('options update', this.options);
        // this.options = [...this.options]
      }
    }, level)
  }

  getTree = async(
    list,
    queryConfig = {},
    parentLevel = 1
  ) => {
    const {
      getKey = 'id',
        queryKey = 'parentId',
        childrenKey = 'children',
        getParams = Utils.stubObject,
        onListUpdate = () => {}
    } = queryConfig
    const topList = list || (await request({
      url: 'branch/listTopBranches',
      useKey: 'selectTree'
    }))
    // if(list!=topList)
    //   console.log(list, topList, parentLevel)
    if (parentLevel > 0) {
      const response = Utils.arrayMapDive(topList,
        ({
          [getKey]: query,
          ...other
        }, index, list) => 
          request({
            url: 'branch/listSubBranches',
            params: {
              [queryKey]: query,
              ...getParams(other)
            },
            useKey: 'selectTree'
          }).then(data => data instanceof Array && data.length > 0 ? list[index][childrenKey] = data && data : undefined)
          .catch(e=>{
            // console.error(e)
          })
      );
      // console.log('testt', topList, response)
      const responseList = (await Promise.all(response))
      console.log('testt', responseList)
      for (const childrenList of responseList) {
        // console.log('testt', childrenList)
          childrenList!==undefined && this.getTree(childrenList, queryConfig, parentLevel - 1).catch(e=>{
            // console.error(e)
          }).finally(()=>{
            // console.log('options update', topList)
            onListUpdate()
          })
      }
    }
    return [...topList];
  }
}
