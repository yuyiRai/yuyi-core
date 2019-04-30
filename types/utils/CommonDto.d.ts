import { IKeyValueMap } from 'mobx';
export default class CommonDto<T extends object = IKeyValueMap> {
    $$___source_dto: T;
    $$___instance: any;
    /**
     * sourceDto
     */
    constructor(dto: T);
    /**
     * get value by key
     * @param { string } keyName
     */
    get(keyNameStr: string, defaultValue?: any, useCreater?: boolean): any;
    /**
     * 创建缓存，使用安全方法
     * @param { string } keyName
     */
    createComputed(keyName: string): this & {
        [x: string]: any;
    };
    /**
     * 是否已创建缓存
     * @param { string } keyName
     */
    hasComputed(keyName: string): boolean;
    setSafeComputed(keyName: string): this & {
        [x: string]: any;
    };
    getComputed: (keyName: string) => any;
    setLastValue(keyName: string, value: any): boolean;
    /**
     * 设置值
     * @param { string } keyName
     * @param { * } value
     * @param { boolean } isSafe 安全模式
     */
    set(keyName: string, value?: any, isSafe?: boolean): boolean;
    /**
     *
     * @param { string } keyStr 指针地址
     * @param { * } defaultValue 没有取到值时默认返回并为该指针所赋的值
     */
    getAndCreateDeepPropertyByStr(keyStr: string, defaultValue: any): any;
    /**
     * 根据字符串解析指针，如果没有值或解析不正确则返回undefined
     * @param { string } keyName 例: a.b[0].c
     * @param { * } defaultValue 任何
     */
    getPropertyByStr(keyName: string, defaultValue: any): any;
    setPropertyByStr(keyName: string, value: any): boolean;
    export(): T;
    clone(): T;
    equals(dto: T, deep?: boolean): boolean;
}
export { CommonDto };
