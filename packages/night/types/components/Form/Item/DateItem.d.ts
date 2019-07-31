import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker/interface';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as React from 'react';
import { ItemConfig } from '../../../stores';
import { OFormItemCommon } from '../Interface/FormItem';
export declare const useDatePickerItem: ({ code, ...other }: IDatePickerProps, ref: any) => JSX.Element;
export declare type IDatePickerProps = OFormItemCommon & DatePickerProps;
export declare const useDateRangePickerItem: ({ code, ...other }: IDateRangePickerProps, ref: any) => JSX.Element;
export declare type IDateRangePickerProps = OFormItemCommon & RangePickerProps;
export interface IDatePickerSwitchProps extends IDateRangePickerProps {
}
export default class DatePickerSwitch extends React.Component<IDatePickerSwitchProps, any> {
    readonly itemConfig: ItemConfig | any;
    readonly placeholder: any;
    readonly useTime: boolean;
    readonly dateFormatStr: any;
    render(): JSX.Element;
}
export declare const MomentUtils: {
    getDateRangeMoment(days: number): moment.Moment[];
};
export declare const defaultDateRangeList: {
    '最近一周': moment.Moment[];
    '最近一个月': moment.Moment[];
};
//# sourceMappingURL=DateItem.d.ts.map