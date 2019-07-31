import { Observer } from "../../../hooks";
import * as React from 'react';
import { CommonFormContext } from "../CommonForm";
import { FormItemConfigContext } from './useItemConfig';
import { FormStoreContext } from './useCommonForm';
export interface ICommonFormContext {
    itemConfig: React.ContextType<typeof FormItemConfigContext>;
    form: React.ContextType<typeof CommonFormContext>;
    formStore: React.ContextType<typeof FormStoreContext>;
    Observer: typeof Observer;
}
export declare function useCommonFormItemContext(): ICommonFormContext;
export declare function useCommonFormItemContext(force: true): ICommonFormContext;
export declare function useCommonFormItemContext(force: (data: ICommonFormContext) => React.ReactElement): React.ReactElement;
//# sourceMappingURL=useCommonFormItemContext.d.ts.map