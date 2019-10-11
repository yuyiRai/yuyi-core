import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import notice from './modules/notice'
import common from './modules/common.js'
import options from './modules/options'
import multTab from './modules/multipleTab'
import getters from './getters'

Vue.use(Vuex)
console.log({
  app,
  user,
  permission,
  notice,
  common,
  options,
  multTab
})
export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    notice,
    common,
    options,
    multTab
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
