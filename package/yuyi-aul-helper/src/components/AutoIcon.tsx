import * as React from 'react';
import { Icon } from 'antd';

interface IAutoIconProps {
  type?: string | React.ReactElement;
}

export const AutoIcon: React.FunctionComponent<IAutoIconProps> = ({ type, children, ...other}) => {
  return React.isValidElement(type)?type:<Icon type={type}>{children}</Icon>;
};

export default AutoIcon;