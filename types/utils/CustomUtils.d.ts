import CommonDto from "./CommonDto";
import { IKeyValueMap } from 'mobx';
export declare function zipEmptyData<T = any>(object: (T | undefined | null)[], isRemoveRepeat?: boolean): T[];
export declare function zipEmptyData<T = any>(object: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;
export declare const CustomUtils: {
    uuid(): string;
    createObjectKey(obj: any): string;
    pipe(data: any, ...funcArr: any[]): any;
    zipEmptyData: typeof zipEmptyData;
    zipEmptyDataNative(object: any): {};
    downloadFile(fileId: string, fileName: string): void;
    likeArray(arr: any[], array: any[]): boolean;
    getDtoOrFormValue(key: string, formOrDto: any): any;
    jsGetAge(strBirthday: string): any;
    connectTo(target: any, source: any, ...keyNames: any[]): boolean;
    getListDifferent(listA: any[], listB: any[], deep?: boolean): {
        push: any[];
        pull: any[];
    };
    createCommonDto(model: any): CommonDto<any>;
    /**
     * 代码解释器，返回getInnerWarpField解释数组
     * @param { string } keyStr
     * @param { any } defaultValue
     * @return { [][] } 二维数组
     */
    getExpressByStr(keyStr: string, defaultValue: any): any[];
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 初始值可用[成员名|初始值]的形式来自定义
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param { {} } main
     * @param  {...(string | [string, string | [] | {}])} proteryNames
     */
    getPropertyFieldByCreate(main: any, ...proteryNames: any[]): any;
    getPropByPath(obj: any, path: any, strict?: boolean): {
        o: any;
        k: any;
        v: any;
    };
};
export default CustomUtils;
