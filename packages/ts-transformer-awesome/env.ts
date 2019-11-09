import { keys } from 'ts-transformer-keys'
import { oc as _oc } from 'ts-optchain'
import 'ts-nameof'

declare global {
  var tsKeys: typeof keys
  var oc: typeof _oc
  var item: any
  var itemIndex: any


  /**
   * 创建一个临时宏（当前只能在同一个文件中使用）
   * @examples
   * ```ts
   * // src
   * const MAP = MACRO(
   *   <T, L>(
   *      inputConst: T[],
   *      visitor: (value: T, index?: number, input?: T[]) => L
   *  ) => {
   *    const input = inputConst;
   *    const length = input.length;
   *    const result = new Array(length) as L[];
   *    for (let i = 0; i < length; i++) {
   *      result[i] = visitor(input[i], i, input);
   *    }
   *    return result;
   *    }
   *  );
   *  declare interface Array<T> {
   *    MAP: Array<T>["map"];
   *  }
   *
   *  console.log([1, 2, 3].MAP(n => 3 * n + 1));
   * // output
   * "use strict"; 
   * const input_1 = [1, 2, 3]; 
   * const length_1 = input_1.length;
   * const result_1 = new Array(length_1);
   * for (let i_1 = 0; i_1 < length_1; i_1++) {
   * result_1[i_1] = 3 * input_1[i_1] + 1;
   * }
   * console.log(result_1);
   * //> [ 4, 7, 10 ]
   * 
   * ```
   */
  function MACRO<T>(t: T): T;

  function Choose(): any;
  function When(props: { condition: boolean; }): any;
  function Otherwise(): any;
  function If(props: { condition: boolean; }): any;
  function For<T>(props: { each: string; of: Iterable<T>; index?: string; }): any;
  function With(props: { [id: string]: any; }): any;

  interface Window {
    __DEV__: boolean;
  }

  namespace JSX {

    interface IntrinsicAttributes {
      children?: any;
    }
  }

  type FilterFunction = <T>(...args: any[]) => T
  const filters: FilterFunction

}
