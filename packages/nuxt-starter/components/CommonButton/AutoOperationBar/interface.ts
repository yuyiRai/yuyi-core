import { VCProps } from '../../CommonFormBase';
import { IConfirmButtonProps } from '../createConfirmButton';
import { IButtonProps } from '../ThemeButton';
import { AutoOperationBarProps } from './Props';
import { ICommonSpinningMixinProps } from '@/components/CommonMixins';
import FilterCodeListProps from '../CodeFilterPropsMixins';

export enum ActionType {
  /** 内置取消请求按钮 */
  取消$ = "cancel$",
  自定义 = "custom",
  提交 = "submit",
  确认 = "ok",
  取消 = "cancel",
  载入 = "load",
  返回 = "return",
  跳转 = "url",
  删除 = "delete",
  上传 = "upload",
  查询 = "query",
  新增 = "add",
  查看 = "view",
  详情 = "detail",
  编辑 = "edit"
}
export type T = typeof ActionType

export interface IActionConfig<T extends ActionType = ActionType, ACT extends 'event' | 'handler' = any> {
  type?: T;
  name?: string;
  title?: string;
  actionType?: ACT;
  action?: ACT extends 'event' ? string | any[] : (() => Promise<any> | void);
  render?: (h: any, $emit: (name: string, ...args: any[]) => any, injectProps?: any) => JSX.Element;
  component?: any;
  props?: IButtonProps;
  confirm?: boolean | {
    title?: string | JSX.Element;
    props?: IConfirmButtonProps;
  };
  hiddenProps?: any;
  style?: any;
  float?: 'left' | 'right';
}

export interface IAutoOperationBarProps extends VCProps<AutoOperationBarProps & ICommonSpinningMixinProps & FilterCodeListProps> {

}
type A = Partial<IAutoOperationBarProps>
