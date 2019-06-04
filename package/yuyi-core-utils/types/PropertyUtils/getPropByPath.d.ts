/**
 * @module PropertyUtils
 */
/**
 *
 * @param obj 对象
 * @param path 解析路径
 * @param strict 是否严格模式，obj解析出错时弹出错误
 */
export declare function getPropByPath(obj: any, path: string, strict?: boolean): {
    o: any;
    k: string;
    v: any;
};
