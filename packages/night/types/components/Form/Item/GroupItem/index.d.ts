import Row from "antd/lib/row";
import "antd/lib/row/style/css.js";
import * as React from 'react';
import { OFormItemCommon } from '../../Interface';
interface IGroupItemProps extends OFormItemCommon, React.HTMLAttributes<any>, React.PropsWithChildren<any> {
}
export declare const InnerRow: import("styled-components").StyledComponent<typeof Row, any, {}, never>;
export declare const useGroupItem: (props: IGroupItemProps, ref: React.Ref<any>) => JSX.Element;
export default useGroupItem;
//# sourceMappingURL=index.d.ts.map