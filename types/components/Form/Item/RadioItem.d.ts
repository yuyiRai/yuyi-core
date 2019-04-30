import * as React from 'react';
import { RadioGroupProps } from 'antd/lib/radio';
import 'antd/lib/radio/style/css';
import { OFormItemCommon } from '../Interface/FormItem';
interface IAppProps extends OFormItemCommon, RadioGroupProps {
}
declare const App: React.FunctionComponent<IAppProps>;
export declare const RadioItem: any;
export default App;
