import * as React from 'react';
import { InputNumberProps } from 'antd/lib/input-number';
import 'antd/lib/input-number/style/css';
import { OFormItemCommon } from '../Interface/FormItem';
export interface IInputNumberProps extends InputNumberProps, OFormItemCommon {
}
declare const App: React.FunctionComponent<IInputNumberProps>;
export declare const InputNumberItem: React.FunctionComponent<IInputNumberProps>;
export default App;
