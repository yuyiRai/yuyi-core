import * as DBUtils from './DBUtils';
declare global {
  interface Window {
    DbUtils: any;
    temp1: DBUtils.Collection;
  }
}

export {
  DBUtils
}
window.DbUtils = DBUtils