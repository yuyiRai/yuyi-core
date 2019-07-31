import { Utils } from "../../../../utils";
import Tooltip from "antd/lib/tooltip";
import "antd/lib/tooltip/style/css.js";
import { TooltipProps } from 'antd/lib/tooltip';
import * as React from 'react';
export interface IValueHintContainerProps extends Pick<TooltipProps, 'trigger' | 'style' | 'className' | 'visible'> {
    value: any;
    children: React.ReactElement<any, any>;
    changeEventName?: string;
}
export declare function useValueHint(eventHandlers: React.AllHTMLAttributes<any>, trigger: TooltipProps['trigger'], warpRef: React.Ref<Tooltip>, hasValue: boolean): {
    readonly ref: React.RefObject<Tooltip>;
    inputChanged: boolean;
    isFocus: boolean;
    inhertTrigger: any;
    warpEventHandlers: React.AllHTMLAttributes<any>;
};
export declare function useChangeToFirst(when: (() => void | typeof Utils.stubFunction), expect: () => boolean): (warpOut?: boolean) => void;
export declare const useFirstChangeToRefresh: typeof useChangeToFirst;
export declare const ValueHintContainer: React.SFC<IValueHintContainerProps>;
//# sourceMappingURL=ToolTipContainer.d.ts.map