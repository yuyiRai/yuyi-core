export * from './global'
export * from './stores'
export * from './utils'
export * from './components'
import Vue from 'vue'
import install from './install'
import 'element-theme-default';


const { VuePlugin } = require('vuera') 
Vue.use(VuePlugin)
export default install;