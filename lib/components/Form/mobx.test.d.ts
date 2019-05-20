import { IReactionPublic } from 'mobx';
export declare class ListStore<T = any, TT = any> {
    constructor();
    list: import("mobx").IObservableArray<any>;
    model: {};
    readonly displayList: TT[];
    readonly first: TT;
    readonly second: TT;
    push(...i: any[]): void;
    watch: (model?: {}) => any;
    onAutoRun(r: IReactionPublic): void;
}
