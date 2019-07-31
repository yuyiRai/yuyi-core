import { FormComponentProps } from 'antd/lib/form';
import { PropsWithChildren } from 'react';
import { IFormProps } from './Form';
export declare function filterToValue(v: any, defaultValue?: any): any;
export declare function deepMemoExpect<P extends PropsWithChildren<any>>({ children: ca, ...a }: P, { children: cb, ...b }: P): boolean;
/**
 * React.memo 深度比较
 * @param Component
 * @param allowChildren 是否忽略children比较（默认是）
 */
export declare function deepMemo(Component: any, allowChildren?: boolean): import("react").MemoExoticComponent<any>;
export declare const form: import("antd/lib/form/interface").FormWrappedProps<IFormProps<object> & FormComponentProps<any>>;
//# sourceMappingURL=util.d.ts.map