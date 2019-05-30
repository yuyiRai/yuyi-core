import * as React from 'react';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { OFormItemCommon } from '../../Interface';
interface IAutoCompleteItemProps extends AutoCompleteProps, OFormItemCommon {
}
declare const AutoCompleteItem: React.FunctionComponent<IAutoCompleteItemProps>;
export default AutoCompleteItem;
