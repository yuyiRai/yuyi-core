var __DEV__ = process.env.NODE_ENV === 'development';
global.__DEV__ = __DEV__;
window.__DEV__ = __DEV__;

global.MACRO = function (r) {
  return r
};
window.MACRO = global.MACRO;
