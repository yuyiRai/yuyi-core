import { RadioGroupProps } from 'antd/lib/radio';
import 'antd/lib/radio/style/css';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
interface IAppProps extends OFormItemCommon, RadioGroupProps {
}
export declare const useRadioItem: ({ code, ...other }: {
    [x: string]: any;
    code: any;
}) => JSX.Element;
export declare const useRadioOneItem: React.FunctionComponent<IAppProps>;
export default useRadioItem;
//# sourceMappingURL=RadioItem.d.ts.map