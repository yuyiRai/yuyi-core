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
/** @internal */
export default interface LodashExtraUtils {
}
//# sourceMappingURL=ParseUtils.d.ts.map