export namespace IOptionsUtils {

  export type SearchKey<T = any> = keyMatcher | RegExp | T[] | T
  export type keyMatcher = (key?: string, arg1?: any, arg2?: any) => boolean;

  export type RemoteSearcher = (key: string, isOnlySearch?: boolean) => Promise<Option[]>
  export type OptionSearcher = (key?: string, isOnlySearch?: boolean) => Promise<Option[]>
  /**
   * Option接口
   * @beta
   */
  export interface Option {
    value?: string,
    label?: string,
    children?: Option[],
    disabled?: boolean,
    isLeaf?: boolean,
    [key: string]: any
  }
  export type OptionBase = Option | string

  /**
   * ttttttt
   */
  export type KeyMatcherFunc = (keyMatcher: keyMatcher, item: Option) => boolean

}
