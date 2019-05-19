export declare class AppStore {
    constructor();
    list: import("mobx").IObservableArray<any>;
    model: {};
    readonly displayList: {
        i: any;
    }[];
    readonly first: {
        i: any;
    };
    readonly second: {
        i: any;
    };
    push(i: any): void;
    watch: (model?: {}) => any;
}
