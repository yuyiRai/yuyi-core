import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import { trim } from 'lodash';

/**
 * 创建 axios 实例
 * @type {<T>(config?: import('axios').AxiosRequestConfig) => Promise<import('@/api').CommonResponse<T>>}
 */
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 20000 // 请求超时时间
})
let retringMsgFlag;
function clearMsgRetringFlag(title) {
  if (retringMsgFlag) { // 如果有重试等待提示则清除
    console.error(title + ' clear retrying')
    retringMsgFlag()
    retringMsgFlag = null
  }
}
axios.defaults.retry = 5; // 重试次数
axios.defaults.retryDelay = 500;// 重试延时
axios.defaults.shouldRetry = (error) => {
  const is500 = error.response && error.response.status === 500
  const isTimeout = error.code === 'ECONNABORTED'
  if (!is500 && isTimeout) {
    retringMsgFlag = message.loading("请求超时，正在重试...", 0)
  } else if (is500) {
    retringMsgFlag = message.loading("请求异常，正在重试...", 0)
  }
  return isTimeout || is500
}; // 重试条件，默认只要是错误都需要重试

async function retry(err) {
  // console.log(err)
  var config = err.config;
  // debugger
  // 判断是否配置了重试
  if (!config || !config.retry) return false;

  if (!config.shouldRetry || typeof config.shouldRetry !== 'function') {
    return false;
  }

  // 判断是否满足重试条件
  if (!config.shouldRetry(err)) {
    return false;
  }

  // 设置重置次数，默认为0
  if (config.__retryCount === undefined) {
    config.__retryCount = 0;
  }

  // 判断是否超过了重试次数
  if (config.__retryCount >= config.retry) {
    clearMsgRetringFlag('retry throws')
    return false;
  }

  // 重试次数自增
  config.__retryCount += 1;

  // config.baseURL = ''
  console.error('retry', config.__retryCount, err)

  // 延时处理
  await new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  // 重新发起axios请求
  return service(config);
}

const logout = () => {
  store.dispatch('Logout').then(() => {
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  })
}

function errorCatcher(error) {
  if (error.response) {
    console.error(error, error.message)
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 500) {
      notification.error({
        message: '系统异常',
        description: '500 - 服务挂了'
      })
    } else if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    } else if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        logout()
      }
    } else if (error.response.status === 400) {
      return Promise.reject(new Error('系统异常').message)
    }
  }
  return Promise.reject(error.message)
}

const err = async (error) => {
  clearMsgRetringFlag('catch error')
  const isRetry = await retry(error)
  if (isRetry) {
    return isRetry
  } else {
    // console.error('errorCatcher')
    return errorCatcher(error)
  }
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Arch6WithCloud ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  } else {
    config.headers['Authorization'] = 'Arch6WithCloud ' // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  clearMsgRetringFlag('response')
  if (["application/vnd.ms-excel", "application/octet-stream", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(response.headers['content-type']) && response.data) {
    const filename = response.headers['content-disposition'].split(';').reduce((r, i) => {
      const [type, value] = i.split('=')
      return trim(type) === 'filename' ? value.replace(new RegExp('"', 'g'), '') : r
    })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    return null
  } else if (!(response.data && response.data.responseHead)) {
    const { code, status = code } = response.data;
    if (parseInt(status) !== 0) {
      if ([-3].includes(parseInt(status))) {
        notification.error({
          message: '系统提示',
          description: response.data.statusText
        })
        return logout()
      }
      // console.error(response.data, 'code' in response.data, response.data.code !== 0, response.data.status)
      // eslint-disable-next-line no-throw-literal
      return Promise.reject(response.data.statusText)
    }
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
