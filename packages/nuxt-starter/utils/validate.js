/* eslint-disable */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor', 'Dispatcher', 'Auditor', 'Manager', 'UserManagement', 'Operations', 'SystemAdministrator']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/*非法字符 字母数字中文*/

export function charActer(value) {
  console.log(value)
  return /^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)
}

/*非法字符 字母数字*/
export function charActerEn(value) {
  console.log(value)
  return /^[A-Za-z0-9]+$/
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/* 正数（包括小数）*/
export function validatePositiveFloat(str) {
  const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
  return reg.test(str)
}

/* float（包括小数，负数）*/
export function validateFloat(str) {
  const reg = /^(-?\d+)(\.\d+)?$/
  return reg.test(str)
}

/* 两位点数*/
export function validateDot2(str) {
  const reg = /^\d+(?:\.\d{1,2})?$/
  return reg.test(str)
}

