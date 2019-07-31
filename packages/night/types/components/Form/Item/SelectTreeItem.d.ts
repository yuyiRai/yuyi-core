import { TreeNodeValue, TreeSelectProps } from 'antd/lib/tree-select/interface';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
interface IAppProps extends OFormItemCommon, TreeSelectProps<TreeNodeValue> {
}
export declare const useSelectTreeItem: React.FunctionComponent<IAppProps>;
export declare function convertTreeNodeToLoadData(treeNode: any): any[];
export default useSelectTreeItem;
//# sourceMappingURL=SelectTreeItem.d.ts.map