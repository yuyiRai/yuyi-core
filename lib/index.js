import Vue from 'vue';
import install from './install';
// import { demo }  from './demo'
import moment from 'moment';
// import 'tsx-control-statements/index.d'
import './global';
export * from './stores';
export * from './utils';
export * from './components';
// import 'element-theme-default/lib/message.css';
window.moment = moment;
var VuePlugin = require('vuera').VuePlugin;
Vue.use(VuePlugin);
export default install;
// demo()
//# sourceMappingURL=index.js.map