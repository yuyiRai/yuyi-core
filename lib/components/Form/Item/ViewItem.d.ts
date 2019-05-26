import * as React from 'react';
import { OFormItemCommon } from '../Interface';
interface IViewItemProps extends OFormItemCommon {
    value?: any;
}
declare const ViewItem: React.FunctionComponent<IViewItemProps>;
export default ViewItem;
