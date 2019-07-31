import { SpinProps } from 'antd/lib/spin/index';
import * as React from 'react';
export interface IUseLoading extends SpinProps {
    loading: boolean;
}
export interface IFormItemLoadingProps extends SpinProps {
    code: string;
}
export declare function useLoadingProps(props: IUseLoading): {
    delay: number;
    indicator: any;
    spinning: boolean;
    prefixCls?: string;
    className?: string;
    style?: import("react").CSSProperties;
    size?: "small" | "default" | "large";
    tip?: string;
    wrapperClassName?: string;
};
export declare function useLoading(children: any, props: IUseLoading): JSX.Element;
export declare const FormItemLoading: React.FunctionComponent<IFormItemLoadingProps>;
//# sourceMappingURL=useLoading.d.ts.map