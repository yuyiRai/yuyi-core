import { IKeyValueMap } from 'mobx';
export declare type Service = (...params: any[]) => Promise<any>;
export declare class HttpBox {
    _map: {};
    whiteList: string[];
    useKey: IKeyValueMap<string>;
    service: Service;
    constructor(service: Service, cacheWhiteList: string[], cacheKeyMap: IKeyValueMap<string>);
    getRes(param: any): Promise<unknown>;
    getReq(param: any, resolve: any, reject: any): void;
    setCahce(__res_key: string, value: any): void;
    getCahce(__res_key: string): any;
    todo(list: any[]): void;
}
