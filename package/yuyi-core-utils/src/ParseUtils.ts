/**
 * @module ParseUtils
 */
import { isDate } from "./LodashExtra";
import moment from "moment";
import { typeUtils } from "./TypeLib";

/**
 * Created by jiachenpan on 16/11/18.
 * @param time 
 * @param cFormat 
 */
export function parseTime(time: any, cFormat?: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: any
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) {
      time = parseInt(time, 10) * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export enum EDateFormatter {
  date = 'YYYY-MM-DD',
  dateTime = 'YYYY-MM-DD HH:mm:ss'
}
export type DateFormatter = EDateFormatter | string
export function toDateString(value: any, formatter: DateFormatter = EDateFormatter.dateTime): Date | string {
  if (isDate(value)) {
    return moment(value).format(formatter)
  } else if (typeUtils.isNotEmptyString(value)) {
    const date = moment(value)
    if (date.isValid()) {
      return date.format(formatter)
    }
  }
  return moment().format(formatter)
}

/** @internal */
export default interface LodashExtraUtils {

}