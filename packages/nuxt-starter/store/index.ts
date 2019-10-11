import config from '../config/theme.config'
export const state = () => ({

})
export const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  themeConfig: state => config[state.app.theme] || config.cool,
  themeColors: state => (config[state.app.theme] || config.cool).color,
  layout: state => state.app.layout,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  tabNames: state => state.multTab.names,
  userName: state => state.user.info.userName,
  // 用户代码
  userCode: state => state.user.info.userCode,
  // 用户所属机构代码
  makeCom: state => state.user.info.makeCom,
  // 用户操作机构代码
  comCode: state => state.user.info.comCode,
  // 用户操作机构名称
  comcname: state => state.user.info.comcname,
  // 用户操作机构信息
  comInfo: state => state.user.info.comInfo,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  gradeid: state => state.user.info.gradeid,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  isIe10: state => state.app.ie10,
  customSettingVisible: state => state.user.customSettingVisible,
  unreadNum: state => state.notice.unreadNum,
  hasMdlChecked: state => state.permission.currentRoute.meta.mdlCode
}
