import Vue from 'vue';
import install from './install';
// import { demo }  from './demo'
// import 'tsx-control-statements/index.d'
import './global';
export * from './stores';
export * from 'yuyi-core-utils';
export * from './components';
// import 'element-theme-default/lib/message.css'
var VuePlugin = require('vuera').VuePlugin;
Vue.use(VuePlugin);
export default install;
// demo()
//# sourceMappingURL=index.export.js.map