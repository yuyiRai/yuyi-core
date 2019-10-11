// import Vue from 'vue'
import { queryNoticesTitle, queryMainNotices, updateReadStatus, getUnreadNum } from '@/api/notice'
import store from '@/store'
const notice = {
  state: {
    unreadNum: 0,
    noticeInfoVisible: false
  },
  mutations: {
    SET_UNREADNUM(state, n) {
      state.unreadNum = n
    },
    TOGGLE_INFO_VISIBLE(state, n = !state.noticeInfoVisible) {
      state.noticeInfoVisible = n
    }
  },
  actions: {
    loadUnreadNum({ commit }) {
      return new Promise((resolve, reject) => {
        getUnreadNum().then(res => {
          commit('SET_UNREADNUM', res.data.counts)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    async updateUnreadNum({ commit, dispatch }, notice) {
      await updateReadStatus(store.getters.userInfo.userCode, notice.id)
      return dispatch('loadUnreadNum')
    }

  }
}

export default notice
