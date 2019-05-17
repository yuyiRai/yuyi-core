import * as React from 'react';
import { onChangeHandler, LabelsConfigList } from '../../../../stores';
import 'rc-tween-one/dist/rc-tween-one.js';
export declare const TagGroup: React.FunctionComponent<ITagGroupProps>;
export interface ITagGroupProps {
    onClose: onChangeHandler;
    labelsConfig: LabelsConfigList;
}
