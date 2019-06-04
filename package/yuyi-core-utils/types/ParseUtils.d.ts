/**
 * Created by jiachenpan on 16/11/18.
 * @param time
 * @param cFormat
 */
export declare function parseTime(time: any, cFormat?: string): string;
export declare enum EDateFormatter {
    date = "YYYY-MM-DD",
    dateTime = "YYYY-MM-DD HH:mm:ss"
}
export declare type DateFormatter = EDateFormatter | string;
export declare function toDateString(value: any, formatter?: DateFormatter): Date | string;
/**
 * 获得字符串实际长度，中文占2，英文占1
 * @param str 字符串
 */
export declare function getRealLength(str: string): number;
