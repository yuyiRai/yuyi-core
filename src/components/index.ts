/* eslint-disable */
import FormComponent from './FormPage'
import Utils from 'src/utils/index'
import { forEach } from 'lodash'
import * as _ from 'lodash'
import './index'
// export * from './TablePage'
(window as any)._ = _;

export default function install(Vue: any) {
  // locale.use(opts.locale);
  // locale.i18n(opts.i18n);

  forEach(FormComponent, (component, key) => {
    Vue.component(component.name || key, component);
  });

  // Vue.use(Loading.directive);

  // Vue.prototype.$ELEMENT = {
  //   size: opts.size || '',
  //   zIndex: opts.zIndex || 2000
  // };

  Vue.prototype.$utils = Utils
  /**
   * @param { boolean | object } paramSource true为历史记录后退，false为不确认后退，对象为详细配置
   */
  Vue.prototype.$goBack = function(paramSource: boolean = true) {
    let { confirm, useBack = false, ...params} = Utils.isObjectFilter(paramSource) || { confirm: paramSource } 
    if(confirm === false) {
      return this.$utils.pathReturn(this, params, false, useBack)
    }
    this.$confirm(confirm===true ? '是否要离开当前页？' : confirm ).then(() => {
      this.$utils.pathReturn(this, params, true, useBack)
    })
  }
  // Vue.prototype.$loading = Loading.service;
  // Vue.prototype.$msgbox = MessageBox;
  // Vue.prototype.$alert = MessageBox.alert;
  // Vue.prototype.$confirm = MessageBox.confirm;
  // Vue.prototype.$prompt = MessageBox.prompt;
  // Vue.prototype.$notify = Notification;
  // Vue.prototype.$message = Message;

};