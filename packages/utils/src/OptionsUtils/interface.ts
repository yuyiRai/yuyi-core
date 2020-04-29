
export type KeywordMatcher = (key?: string, arg1?: any, arg2?: any, arg3?: any) => boolean;
export type SearchKey<T = any> = KeywordMatcher | RegExp | T[] | T

export type RemoteSearcher = (key: string, isOnlySearch?: boolean) => Promise<IOption[]>
export type OptionSearcher = (key?: string, isOnlySearch?: boolean) => Promise<IOption[]>
/**
 * Option接口
 * @beta
 */
export type IOption<ValueKey extends string = 'value', DisplayKey extends string = 'label'> = {
  [K in ValueKey]: string;
} & {
  [K in DisplayKey]?: string; 
} & {
  children?: IOption<ValueKey, DisplayKey>[],
  disabled?: boolean,
  isLeaf?: boolean,
  [key: string]: any
}
export type OptionBase<ValueKey extends string = 'value', DisplayKey extends string = 'label'> = IOption<ValueKey, DisplayKey> | string

/**
 * ttttttt
 */
export type KeyMatcherFunc = (keyMatcher: KeywordMatcher, item: IOption) => boolean
