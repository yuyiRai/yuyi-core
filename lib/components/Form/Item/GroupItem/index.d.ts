import * as React from 'react';
import { OFormItemCommon } from '../../Interface';
interface IGroupItemProps extends OFormItemCommon, React.HTMLAttributes<any>, React.PropsWithChildren<any> {
}
declare const GroupItem: React.FunctionComponent<IGroupItemProps>;
export default GroupItem;
