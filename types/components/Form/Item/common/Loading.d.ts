import * as React from 'react';
import { SpinProps } from 'antd/lib/spin/index';
import { OFormItemCommon } from '../../Interface';
interface ILoadingProps extends SpinProps {
    loading?: boolean;
}
interface IFormItemLoadingProps extends ILoadingProps, OFormItemCommon {
    context?: React.ReactElement;
}
export declare const Loading: React.FunctionComponent<ILoadingProps>;
export declare const FormItemLoading: React.FunctionComponent<IFormItemLoadingProps>;
export default Loading;
