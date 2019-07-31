import { Draft } from 'immer';
import { IObservableArray, IReactionDisposer } from 'mobx';
import { ITransformer } from 'mobx-utils';
import { CommonStore } from '../CommonStore';
export declare class List<T = any, TT = T> extends CommonStore {
    private originalList;
    transformList: IObservableArray<TT>;
    private customTransformer;
    private keyList;
    private strict;
    constructor(list?: T[], transformer?: ITransformer<T, TT>, strict?: boolean);
    setList(list?: T[]): void;
    /**
     * 当数组成员变更
     * @param response
     */
    onChangeResponse([orginItem, index]: [T, number]): boolean;
    private watcherList;
    readonly watcherLength: number;
    lastSnapshots: T[];
    setWatcher(): IReactionDisposer;
    setTransformer(transformer?: ITransformer<T, TT>): void;
    readonly first: TT;
    readonly last: TT;
    push(...i: T[]): void;
    pop(): T;
    set<D = Draft<T>>(index: number, i: T | ((i: D) => D)): T | false;
    update<D = Draft<T>>(index: number, i: (i: D) => D): T | false;
    /**
     * 取对应下标值（观察者下）
     * @param index
     */
    get(index: number): TT | null | undefined;
    /**
     * 取对应下标值（观察者下）
     * @param index
     * @param defaultValue 为null|undefined时提供默认值
     * @param originalDefaultType 提供的默认值是否为原始类型
     */
    get(index: number, defaultValue?: T | TT, originalDefaultType?: boolean): TT;
    /**
     * 取对应下标值（纯净值）
     * @param index
     */
    getValue(index: number, defaultValue?: TT, originalDefaultType?: boolean): TT;
    /**
     * 取对应下标值（观察者下）
     * @param index
     */
    getOriginal(index: number): T | null | undefined;
    /**
     * 取对应下标值（观察者下）
     * @param index
     * @param defaultValue 为null|undefined时提供默认值
     * @param autobind 是否在无值时自动初始化下标值（使用默认值）
     */
    getOriginal(index: number, defaultValue?: T, autobind?: boolean): T;
    /**
     * 取得指定下标值（纯净值）
     * @param index
     * @param defaultValue 为null|undefined时提供默认值
     */
    getOriginalValue(index: number, defaultValue?: T): T;
    onArrayChangeHandler(key: string, ...args: any[]): void;
    onArrayChange: any;
    registerOnArrayChange(v: any): void;
}
//# sourceMappingURL=ListStore.d.ts.map