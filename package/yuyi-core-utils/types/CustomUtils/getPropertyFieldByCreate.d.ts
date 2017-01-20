/**
 * @module PropertyUtils
 */
import { IKeyValueMap } from 'mobx';
export declare namespace PropertyUtils {
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 初始值可用[成员名|初始值]的形式来自定义
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param main 键值对
     * @param proteryNames 属性描述
     * @typeparam V 返回值类型
     *
     * @example
     * const obj = {}
     * const a = getPropertyFieldByCreate(obj, 'a', ['a'], ['a', 'b'])
     *
     * console.log(a) // 'b'
     * console.log(obj) // {"a":{"a":{"a":"b"}}}
     *
     */
    function getPropertyFieldByCreate<V = any>(main: IKeyValueMap, ...proteryNames: PrototeryMatcher[]): V;
    /**
     * 代码解释器，返回getPropertyFieldByCreate解释数组
     * @param keyStr
     * @param defaultValue
     * @return 二维数组
     * @example
     * const matcher = getExpressByStr('a[1].b[0].d', 123)
     * console.log(matcher) // [ ["a", []] , [1, {}] , ["b", []] , [0, {}] , ["d", 123] ]
     */
    function getExpressByStr(keyStr: string, defaultValue: any): PrototeryMatcher[];
    type PrototeryMatcher = string | [string, any];
}
