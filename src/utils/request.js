import axios from 'axios'
import Utils from '../utils/Utils'
import { MessageBox } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // console.warn(config)
  // if (store.getters.token) {
  //   让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  //   config.headers['X-Token'] = getToken()
  // }
  return config
}, error => {
  // Do something with request error
  // console.warn(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  ({ data: response, ...other }) => {
    // console.warn({ data: response, ...other })
    if (response && response.success === false) {
      if (response.errorCode === 'unauthorized') {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        return Promise.reject(`${response.errorCode} - ${response.errorMessage}`)
      } else if (response.errorCode === 'runtime') {
        console.error('系统异常')
        return Promise.reject(`${response.errorCode} - ${response.errorMessage}`)
      } else {
        return Promise.reject(`${response.errorCode} - ${response.errorMessage}`)
      }
    } else if (response && response.data && response.success === true) {
      return response.data
    } else if (response !== null) {
      return response
    } else {
      return {}
    }
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
/* eslint-disable */
  error => {
    // console.warn('err' + error) // for debug
    // Utils.$message({
    //   msg: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  })

const getReq = function(param, resolve, reject) {
  Utils.simpleTimeBufferInput(param.__res_key, param, function(req) {
    service(Utils.last(req)).then(function(res){
      resolve(res)
    }).catch(function(e){
      reject(e)
    })
  }, 30)
}

export class HttpBox {
  _map = {}
  whiteList = ['support/findListByCodeType', 'branch/listSubBranches', 'branch/listTopBranches', 'support/findImageTypeList', 'support/findHospitalListByName']
  useKey = {
    'branch/listSubBranches': 'selectTree',
    'branch/listTopBranches': 'selectTree'
  }
  constructor() {
  }
  getRes = (param) => {
    const { isObjectFilter, createObjectKey } = Utils
    // console.time(param.url)
    param.__res_key = [param.url, createObjectKey({...isObjectFilter(param.params, param.data)})].join('')
    // console.timeEnd(param.url)
    // if('params' in param)
    //   param.params = Utils.zipEmptyData(param.params)
    // if('data' in param)
    //   param.data = Utils.zipEmptyData(param.data)
      Utils.createSimpleTimeBufferInput()
    return new Promise((resolve, reject) => {
      if(this.getCahce(param.__res_key)){
        return resolve(this.getCahce(param.__res_key)) 
      }
      this.getReq(param, resolve, reject)
    })
  }
  getReq = (param, resolve, reject) => {
    Utils.simpleTimeBufferInput(param.__res_key, {param, resolve, reject}, this.todo, 20)
  }
  setCahce = (__res_key, value) => {
    this._map[__res_key] = value;
  }
  getCahce = (__res_key) => {
    return this._map[__res_key];
  }
  todo = (list) => {
    const { param: req } = Utils.last(list)
    service(req).then((res) => {
      if(this.whiteList.includes(req.url) && this.useKey[req.url]==req.useKey){
        this.setCahce(req.__res_key, res)
        setTimeout(this.setCahce, 30*60*1000, req.__res_key, undefined);
      }
      for(const i of list){
        i.resolve(res)
      }
    }).catch(function(e){
      console.log(e, e.message, Utils.isNotEmptyValueFilter(e.message, e))
      for(const i of list){
        i.reject(new Error(Utils.isNotEmptyValueFilter(e.message, e)))
      }
    })
  }
} 
const http = new HttpBox()

export default http.getRes
export const request = service
