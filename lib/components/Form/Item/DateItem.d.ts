import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker/interface';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ItemConfig } from '../../../stores';
export declare const DatePickerItem: React.FunctionComponent<IDatePickerProps>;
export declare type IDatePickerProps = OFormItemCommon & DatePickerProps;
export declare const DateRangePickerItem: React.FunctionComponent<IDateRangePickerProps>;
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
