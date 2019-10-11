/* eslint-disable */

import Vue from 'vue';
import _extends from 'babel-runtime/helpers/extends';
import Modal from 'ant-design-vue/es/modal';
import router from '@/router'
import store from '@/store/'
import classnames from 'classnames'
import './PortalModal.less'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
// import Utils from '../yuyi-core-utils/dist/index.es5'
// Utils.isArrayFilter()
export function confirm(config) {
  const { content, onCancel, onOk } = config
  var div = document.createElement('div');
  var el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);
  var currentConfig = _extends({}, config, { close: close, visible: true, class: classnames(['portal-model-dialog', config.class]) });
  var confirmDialogInstance = null;
  var confirmDialogProps = { props: {} };
  function close() {
    destroy.apply(undefined, arguments);
  }
  function update(newConfig) {
    currentConfig = _extends({}, currentConfig, newConfig);
    // console.error(newConfig);
    confirmDialogProps.props = currentConfig;
  }
  const className = 'ant-modal-confirm-content';
  function destroy() {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.$destroy();
      confirmDialogInstance = null;
      div.parentNode.removeChild(div);
    }
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var triggerCancel = args.some(function (param) {
      return param && param.triggerCancel;
    });
    if (config.onCancel && triggerCancel) {
      config.onCancel.apply(config, args);
    }
  }
  function render(props) {
    confirmDialogProps.props = props;
    return new Vue({
      el: el,
      store,
      router,
      data: function data() {
        return { confirmDialogProps: confirmDialogProps };
      },
      render: function render(h) {
        // 先解构，避免报错，原因不详
        var cdProps = _extends({
          on: {
            ok: () => onOk(destroy),
            cancel: () => onCancel(destroy)
          }
        }, this.confirmDialogProps);
        console.error(cdProps)
        return h('a-locale-provider', { props: { locale: zhCN } }, [h(Modal, cdProps, [content])])
      }
    });
  }
  confirmDialogInstance = render(currentConfig);
  return {
    destroy: close,
    update: update
  };
}
