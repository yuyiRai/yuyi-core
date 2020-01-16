import { isDate } from "./LodashExtra";
import momentType from 'moment'
import moment from "dayjs";
import { expect$ } from "./TypeLib";
import { IsAny, IsUnknown } from './TsUtils';
// export enum EDateFormatter {
//   /**
//    * 日期
//    */
//   date = 'YYYY-MM-DD',
//   /**
//    * 日期时分秒
//    */
//   dateTime = 'YYYY-MM-DD HH:mm:ss'
// }
// export type DateFormatter = EDateFormatter | string

export type InputType = IsUnknown<moment.ConfigType, momentType.MomentInput, moment.ConfigType>
export class DateUtils {
  public static format(value: any, formatter: EDateFormatter = EDateFormatter.dateTime): string {
    return toDateString(value, formatter);
  }

  public static hoursDiff(targetDate: InputType, currentDate?: InputType) {
    return Math.round((moment(targetDate as moment.ConfigType).diff(moment(currentDate as moment.ConfigType)) / 1000 / 60 / 60))
  }

  public static getDateRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
    return [start, end];
  }
}
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
const values = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']
export type DateFormatter = EDateFormatter | string;
export function toDateString(value: any, formatter: EDateFormatter = EDateFormatter.dateTime): string {
  const format = values[formatter]
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
