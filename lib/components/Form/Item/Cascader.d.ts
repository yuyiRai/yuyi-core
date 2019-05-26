import * as React from 'react';
import { CascaderProps } from 'antd/lib/cascader';
import 'antd/lib/cascader/style/css';
import { OFormItemCommon } from '../Interface/FormItem';
interface IAppProps extends OFormItemCommon, CascaderProps {
}
declare const App: React.FunctionComponent<IAppProps>;
export declare const CascaderItem: any;
export default App;
