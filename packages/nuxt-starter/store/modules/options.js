import { set, unset, get, isError } from 'lodash'

function createEmitter() {
  let emit = null
  const init = new Promise(resolve => {
    emit = resolve
  })
  return [emit, init]
}

const [emit, init] = createEmitter()

const options = {
  state: {
    listener: init,
    emit,
    waitingInstance: [],
    optionsMap: {
      // options缓存
    },
    timeoutMap: {
      // options缓存timeout
    },
    timeoutReadyMap: {
      // timeout预缓存
    }
  },
  getters: {
    hasOptionsPreparing(state) {
      console.error(state)
      return state.waitingInstance.length > 0
    }
  },
  mutations: {
    WAITING(state, instance) {
      if (state.waitingInstance.length === 0) {
        state.emit = null
        state.listener = null
        state.waitingInstance = [instance]
      } else if (!state.waitingInstance.includes(instance)) {
        state.waitingInstance = state.waitingInstance.concat([instance])
      }
      // console.error('waiting', instance)
    },
    FINISH(state, instance) {
      state.waitingInstance = state.waitingInstance.filter(i => i !== instance)
      if (state.waitingInstance.length === 0 && state.emit) {
        state.emit()
      }
      // console.error('finished', instance)
    },
    SET_OPTIONS: (state, { key, options }) => {
      // 保持一致性，从sourceMap中取出Promise
      state.optionsMap[key] = options
      // set(state.optionsMap, key, options)
      // console.error('SET_OPTIONS', key, options)
    },
    PREPARE_WAITING: (state, { key, timeout = 5000 }) => {
      state.optionsMap[key] = new Promise((resolve, reject) => {
        const emitter = { resolve, reject }
        // timeout预缓存
        state.timeoutReadyMap[key] = { timeout, emitter }
      })
      // console.error('PREPARE_WAITING', key, timeout)
    },
    WAITING_EMIT: async (state, key) => {
      const options = await state.optionsMap[key]
      const { resolve, reject } = state.timeoutReadyMap[key].emitter
      // console.error('WAITING_EMIT', key, options)
      unset(state.timeoutReadyMap, key)
      return isError(options) ? reject(options) : resolve(options)
    },
    SET_TIMEOUT: (state, key, a) => {
      // 清理预缓存
      // timeout启动
      // console.error('SET_TIMEOUT', key)
      state.timeoutMap[key] = window.setTimeout((state) => {
        set(state.optionsMap, key, null)
        unset(state.timeoutMap, key)
      }, state.timeoutReadyMap[key].timeout, state)
    },
    CLEAR_TIMEOUT: (state, key) => {
      // timeout清理
      clearTimeout(state.timeoutMap[key])
      unset(state.timeoutMap, key)
      // console.error('CLEAR_TIMEOUT', key)
    }
  },
  actions: {
    async WaitingOptions({ commit, state, getters }) {
      console.error('wait', state.waitingInstance)
      if (state.waitingInstance.length === 0) {
        return
      }
      if (state.listener === null) {
        const [emit, init] = createEmitter()
        state.emit = emit
        state.listener = init
      }
      let time = null
      return new Promise((resolve, reject) => {
        console.error(state.listener, getters)
        time = setTimeout(() => {
          resolve()
          time = null
          resolve = null
        }, 1000 * 60)
        state.listener.then(() => {
          // window.clearInterval(time)
          if (time !== null) {
            resolve()
            window.clearTimeout(time)
            time = null
            resolve = null
          }
        })
        // time = window.setInterval(() => {
        // }, 100)
      })
    },
    async GetOptions({ commit, state }, [key, request, timeout = 3600 * 1000 / 2]) {
      let options = null
      // 从未获取过 或 缓存已被清理
      if (!(key in state.timeoutMap)) {
        // 不存在预缓存
        if (!(key in state.timeoutReadyMap)) {
          commit('PREPARE_WAITING', { key, timeout })
          try {
            options = await request()
            commit('SET_TIMEOUT', key)
          } catch (e) {
            options = e
            throw Promise.reject(e)
          } finally {
            commit('SET_OPTIONS', { key, options })
            commit('WAITING_EMIT', key)
          }
        }
      }
      options = get(state.optionsMap, key)
      return options
    }
  }
}

export default options
