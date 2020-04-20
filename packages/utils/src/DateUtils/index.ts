import moment from "dayjs";
import momentType from 'moment';
import { isDate, isNum } from "../LodashExtra";
import { IsUnknown } from '../TsUtils';
import { expect$ } from "../TypeLib";

/**
 * 常用formatter模板
 */
export enum EDateFormatter {
  /**
   * 日期
   */
  date,
  /**
   * 日期时分秒
   */
  dateTime
}
const EDateFormatterValues = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'];
export type DateFormatter = EDateFormatter | string;
export type TDate = IsUnknown<
  moment.ConfigType,
  momentType.MomentInput,
  moment.ConfigType
  >;
export type TMoment = IsUnknown<
  moment.Dayjs,
  typeof momentType,
  moment.Dayjs
>


/**
 * 
 * 比较生日和当前日期取得年龄
 * @param birthday - 生日
 * @param offset - 偏移量
 * @param current - 替换当前日期
 */
export function getAge(birthday: TDate, offset?: number): number;
export function getAge(birthday: TDate, current: TDate): number;
export function getAge(birthday: TDate, current: TDate | number = new Date()) {
  const sBirthday = moment(birthday);
  const sNow = isNum(current) ? getDay(current, false) : moment(current);
  let birthYear = sBirthday.year();
  let nowYear = sNow.year();
  if (nowYear === birthYear) return 0; // 同年 则为0岁
  let birthMonth = sBirthday.month() + 1;
  let birthDay = sBirthday.date();
  let nowMonth = sNow.month() + 1;
  let nowDay = sNow.date();
  let ageDiff = nowYear - birthYear; // 年之差
  if (ageDiff > 0) {
    if (nowMonth === birthMonth) {
      let dayDiff = nowDay - birthDay; // 日之差
      return dayDiff < 0 ? (ageDiff - 1) : ageDiff;
    }
    // tslint:disable-next-line: radix
    let monthDiff = nowMonth - birthMonth; // 月之差
    return monthDiff < 0 ? (ageDiff - 1) : ageDiff;
  }
  return -1; // 返回-1 表示出生日期输入错误 晚于今天
}

export function format(value: any, formatter: EDateFormatter = EDateFormatter.dateTime): string {
  return toDateString(value, formatter);
}

/**
 * 取得日期
 * @param offset 日期偏移，大于0返回未来n天，小于0表示过去n天
 */
export function getDay(format?: DateFormatter | boolean): TMoment
export function getDay(offset: number, format?: false): TMoment
export function getDay(offset: number, format?: true | DateFormatter): string;
export function getDay(arg1: any, arg2: any = false) {
  const mode = isNum(arg1)
  const offset: number = mode ? Math.round(arg1) : 0;
  const format: boolean | DateFormatter = mode ? arg2 : arg1;
  const day = moment();
  offset !== 0 && day.set('date', day.get('date') + offset);
  return format
    ? day.format(expect$.isString.filter(format, EDateFormatterValues[format as EDateFormatter], 'YYYY-MM-DD HH:mm:ss'))
    : day
}

/**
 * 返回昨天
 * @param offset 天数偏移，传入小于等于0时也会返回昨天
 */
export function getYesterday(offset: number = 0, format?: boolean | DateFormatter) {
  return getDay(-1 - Math.max(offset, 0), format as any)
}

/**
 * 返回明天
 * @param offset 天数偏移，传入小于等于0时也会返回明天
 */
export function getFuture(offset: number = 0) {
  return getDay(1 + Math.max(offset, 0));
}

export function hoursDiff(targetDate: TDate, currentDate ?: TDate) {
  return (moment(targetDate as moment.ConfigType).diff(moment(currentDate as moment.ConfigType)) / 1000 / 60 / 60);
}

export function getDateRange(days: number, end = new Date()) {
  const start = new Date(end);
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
  return [start, end];
}

export function toDateString(value: any, formatter: EDateFormatter = EDateFormatter.dateTime): string {
  const format = EDateFormatterValues[formatter]
  if (isDate(value)) {
    return moment(value).format(format);
  } else if (expect$.isNotEmptyString(value)) {
    const date = moment(value);
    if (date.isValid()) {
      return date.format(format);
    }
  }
  return moment().format(format);
}
