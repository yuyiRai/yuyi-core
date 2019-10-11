import * as Components from './index'
import Vue from 'vue'

export function install(vue: typeof Vue) {
  // debugger
  Object.entries(Components).forEach(([name, Component], index, list) => {
    // console.log('aml-install', name, Component)
    if (Component.render instanceof Function || Component.component || Component.extends || Component.mixins instanceof Array) {
      vue.component('AML' + name, Component)
      vue.component('Aml' + name, Component)
    }
  })
}
