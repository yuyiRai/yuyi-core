import { IKeyValueMap } from '../TsUtils';
export declare namespace App {
    type ParamA = number;
}
export declare function App(param1: App.ParamA): any;
/**
 * 压缩数据结构，清除所有空值
 * 对象为key-value对会删除值为空的key，如果对象为Array会挤掉空的下标，但不会影响下标顺序
 * @param target - 目标对象
 * @param isRemoveRepeat - 是否移除重复的值（浅比较）
 */
export declare function zipEmptyData<T = any>(target: Array<T | undefined | null>, isRemoveRepeat?: boolean): T[];
export declare function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;
//# sourceMappingURL=zipEmptyData.d.ts.map