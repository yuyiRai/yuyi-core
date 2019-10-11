// import Vue from 'vue'
import Vue from 'vue'
import { isFunction, set, merge, isArray, isObject, cloneDeep } from 'lodash'
// import router from '@/router'
import store from '@/store'
import { Modal } from 'ant-design-vue'
import { confirm } from '@/utils/Portal/PortalModal'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { convertModalProps } from './modal.ts'

export function waitingPromise(timeout, value = null) {
  return new Promise(resolve => setTimeout(resolve, timeout, value))
}

function getComponent(render) {
  return render;
}

function batchSet(obj, key, value) {
  const newObj = { ...obj }
  if (isArray(key)) {
    key.forEach(([key, value]) => {
      set(newObj, key, value)
    })
  } else if (isObject(key)) {
    return merge(newObj, key)
  } else {
    set(newObj, key, value)
  }
  return newObj
}

const common = {
  state: {
    visible: false,
    component: new Vue({
      store,
      // router,
      render(h) {
        return <span>{this.$slots.default}</span>
      }
    }),
    getContent: (props, render, loadData, submitData, forceClose, forceUpdate, h = common.state.component.$createElement) => {
      const Component = getComponent(render)
      console.log(Component, render)
      const renderer = <Component ref='modal' loadData={loadData} forceClose={forceClose} onClose={forceClose} forceUpdate={forceUpdate} submitData={submitData} {...{ $store: store, props }} />
      common.state.component.$slots.default = renderer
      common.state.component.$forceUpdate()
      return renderer
    },
    getHeader: (title, h = common.state.component.$createElement) => {
      return <div style="height: 30px">
        <div style={`
          padding: 16px 24px;
          border-radius: 4px 4px 0 0;
          background: #fff;
          color: rgba(0, 0, 0, 0.65);
          border-bottom: 1px solid #e8e8e8;
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
      `}><div class="ant-modal-title">{title}</div></div>
      </div>
    },
    getModalRef() {
      return common.state.component.$refs.modal
    }
  },
  mutations: {
    SET_VISIBLE(state, visible) {
      state.visible = visible
    },
    SET_APP_ROOT: (state, root) => {
      state.component = root
      // console.error('SET_APP_ROOT', root)
    }
  },
  actions: {
    async submitModal({ dispatch, commit, state: { component, getContent, getModalRef, getHeader }, ...other }, [props, render, loadData, submitData]) {
      commit('SET_VISIBLE', true)
      /**
       * @type {{ destory: Function, update: Function }}
       */
      let modal = null
      const isSubmit = submitData !== false
      const btnProps = { okButtonProps: { props: { locale: zhCN, loading: false } }, cancelButtonProps: { props: { locale: zhCN, disabled: false } } }
      const btnProps2 = { okButtonProps: { props: { locale: zhCN, loading: true } }, cancelButtonProps: { props: { locale: zhCN, disabled: true } } }
      const { okButtonProps, cancelButtonProps } = btnProps
      try {
        const { title, formProps, okText, cancelText, width, footer, header, ...other } = convertModalProps(props, isSubmit)

        return await new Promise((resolve, reject) => {
          const config = {
            ...other,
            title: getHeader(title),
            content: getContent(formProps, render, loadData, submitData, () => {
              // console.log(modal)
              modal && modal.destroy()
            }),
            okButtonProps: merge(cloneDeep(okButtonProps), { style: { display: isSubmit ? undefined : 'none' } }),
            closable: true,
            cancelButtonProps: cloneDeep(cancelButtonProps),
            cancelText,
            okText,
            iconType: 'none',
            width,
            scopeSlots: {
              footer, header
            },
            onOk: (doClose) => {
              modal.update(batchSet(config, btnProps2))
              // console.error(getModalRef(), modal)
              getModalRef().handleSubmit().then(data => (submitData || (data => data))(data)).then(data => {
                doClose()
                resolve(data)
              }).catch(e => {
                console.error(e)
              }).finally(() => {
                modal.update(batchSet(config, btnProps))
              })
            },
            onCancel: (doClose) => {
              if (isSubmit && isFunction(doClose)) {
                // 取消
                // doClose()
                Modal.confirm({
                  title: '提示',
                  content: '确认取消？',
                  onOk: (confirm) => {
                    confirm()
                    reject(new Error('cancel'))
                    isFunction(doClose) && doClose()
                  }
                })
              } else if (isFunction(doClose)) {
                doClose()
              } else {
                reject(new Error('close'))
              }
              // 直接右上角
              // dispatch('viewModal', [title, render])
            },
            maskClosable: true
          }
          modal = confirm(config)
          // const children = component.$refs.modal.$parent.$children
          // const confirmBtn = children.pop()
          // children.push(confirmBtn, confirmBtn)
          // component.$refs.modal.$parent.$forceUpdate()
          // console.error(component, other, children)
        })
      } catch (e) {
        console.error(e.message || e)
        // debugger
        if (!e.message === 'close' && !e.message === 'cancel') {
          throw e
        }
      } finally {
        render = null
      }
    },
    viewModal({ commit, state: { getContent } }, [title, render]) {
      commit('SET_VISIBLE', true)
      /**
       * @type {{ destory: Function, update: Function }}
       */
      let modal = null
      return new Promise((resolve, reject) => {
        modal = confirm({
          title,
          content: getContent(render),
          onCancel: (doClose) => {
            doClose()
          },
          okButtonProps: {
            style: { display: 'none' }
          },
          cancelText: '返回',
          maskClosable: true,
          autoFocusButton: 'cancel'
        })
        commit('SET_VISIBLE', false)
      }).finally(() => {
        console.error(modal)
        render = null
      })
    },
    setAppRoot({ commit }, root) {
      commit('SET_APP_ROOT', root)
    }
  }
}

export default common
