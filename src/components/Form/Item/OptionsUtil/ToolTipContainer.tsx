import * as React from 'react';
import { Tooltip } from 'antd';

export function ValueHintContainer({ value, children, trigger, ...other }: any) {
  return (<Tooltip trigger={Utils.isArrayFilter(trigger, ['focus', 'hover']) as any} title={value} placement="topLeft" mouseLeaveDelay={0.5} {...Utils.zipEmptyData(other)}>{children}</Tooltip>);
}