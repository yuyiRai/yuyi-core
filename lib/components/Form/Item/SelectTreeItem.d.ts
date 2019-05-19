import * as React from 'react';
import { TreeSelectProps } from 'antd/lib/tree-select';
import 'antd/lib/tree-select/style/css';
import { OFormItemCommon } from '../Interface/FormItem';
interface IAppProps extends OFormItemCommon, TreeSelectProps {
}
declare const App: React.FunctionComponent<IAppProps>;
export declare const SelectTreeItem: any;
export declare function convertTreeNodeToLoadData(treeNode: any): any[];
export default App;
