import * as React from 'react';
import { CheckboxProps as MuiCheckBoxProps } from '@material-ui/core/Checkbox';
import AntdCheckBox, { CheckboxProps as AntCheckBoxProps, CheckboxGroupProps as AntCheckBoxGroupProps } from 'antd/lib/checkbox';
interface ICheckBoxProps extends AntCheckBoxProps {
    muiProps: MuiCheckBoxProps;
}
export declare function useCheckBox(props: ICheckBoxProps): JSX.Element;
export declare namespace useCheckBox {
    var group: typeof useCheckBoxGroup;
}
export declare const OAntdCheckBox: typeof AntdCheckBox;
declare const CheckBox: React.FunctionComponent<ICheckBoxProps>;
interface ICheckBoxGroupProps extends AntCheckBoxGroupProps {
    muiProps: MuiCheckBoxProps;
}
export declare function useCheckBoxGroup(props: ICheckBoxGroupProps): JSX.Element;
declare global {
    interface useCheckBox {
        group: typeof useCheckBoxGroup;
    }
}
export default CheckBox;
//# sourceMappingURL=index.d.ts.map