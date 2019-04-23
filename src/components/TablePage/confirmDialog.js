/* eslint-disable */
import Vue from 'vue'
// import {
//   waitData
// } from '@/api/test.js'
// 用于模拟请求获取数据
export const waitData = (data, time, error) => {
  return new Promise((resolve,reject)=>{
      setTimeout(()=>{
          if(error)
              reject(data)
          else 
              resolve(data)
      }, time)
  })
} 

/**
 * 确认弹窗（支持回调和Promise）
 * @param {*} config 
 * title: 标题
 * tip: 提示
 * type: 'info' | 'success' | 'error' | 'warning'
 * onConfirm: 允许普通函数或返回一个promise
 * waitResponse: 是否等待onConfirm返回一个promise再关闭
 */
export const Confirm = ({
  title,
  tip,
  type = 'info',
  waitResponse,
  instance,
  onConfirm = () => {},
}) => {
  const {
    $confirm,
    $message
  } = instance || Vue.prototype
  return new Promise((resolve, reject) => {
    $confirm(tip, title, {
      type: type,
      beforeClose(action, instance, done) {
        const res = action == 'confirm';
        console.log(action,res)
        if (waitResponse && onConfirm && res) {
          instance.confirmButtonLoading = true;
          instance.showCancelButton = false;
          instance.confirmButtonText = '执行中...';
          onConfirm(res).catch(error=>Utils.isNotEmptyString(error.message || error) && $message.error(error.message || error)).finally(() => {
            instance.confirmButtonText = '完成';
            instance.confirmButtonLoading = false;
            instance.showCancelButton = true;
            resolve(res)
            done()
          })
        } else {
          onConfirm(res)
          resolve(res)
          done()
        }
      }
    }).catch(() => {
      resolve(false)
    })
  })
}

export const DeleteConfirm = ({
  title = '是否删除',
  tip = '确认要进行删除操作？',
  onConfirm = () => waitData({
    message: '成功'
  }, 1000).then(data => {
    $message({
      type: 'success',
      message: data.message
    })
  }),
  ...other
}) => {
  const {
    $message
  } = Vue.prototype
  return Confirm({
    title,
    tip,
    type: 'warning',
    waitResponse: true,
    onConfirm: (bool) => {
      if (bool) {
        return onConfirm()
      }
    },
    ...other
  }).catch(error => {
    $message.error(error)
  })
}
