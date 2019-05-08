import { autobind } from "core-decorators";
import { map, toString } from 'lodash';
import { autorun, computed, observable, action, intercept, IObservableArray, IArraySplice } from "mobx";
import { Option, OptionBase } from "../../utils";
import { IItemConfig, ItemConfigEventHandler, CommonStore } from "./interface";
import { Debounce } from 'lodash-decorators'

export type KeyString = string;
export interface ISearchConfigConstructor {
  remoteMethod?: ItemConfigEventHandler<KeyString, Promise<OptionBase[]>>;
  allowCreate?: boolean | ItemConfigEventHandler<KeyString, Option>
  multiple?: boolean;
}
export interface ISearchConfig extends ISearchConfigConstructor {
}

export class SearchStore extends CommonStore {
  [k: string]: any;
  @observable mode: 'filter' | 'search' = 'search'
  @observable itemConfig: IItemConfig;
  @observable searchKeyHistory: IObservableArray<string> = observable.array([])
  @computed get keyWord(): string | undefined {
    const { searchKeyHistory: history } = this
    const key = history.length === 0 ? undefined : Utils.toString(history[history.length-1])
    return key==='*'?'':key
  }

  constructor(itemConfig: IItemConfig) {
    super()
    this.itemConfig = itemConfig
    autorun(() => {
      if(this.searchKeyHistory.length > 10) {
        this.searchKeyHistory.shift()
      }
      this.toSearch(this.keyWord)
      // this.itemConfig.filterOptions = [this.keyWord]
    })
    intercept(this.searchKeyHistory, (change: IArraySplice<string>) => {
      if(change.added.length > 0 && change.added[0]!==change.object[change.object.length-1]) {
        console.log(change)
        change.added = Utils.zipEmptyData(change.added)
      } else {
        change.added = []
      }
      return change
    })
    console.log('useSearchStore', this)
    this.resetKeyword()
    // this.reaction(() => this.searchName, searchName => {
    //   console.log('get searchName change', searchName);
    // }, { fireImmediately: true })
    // console.log('SearchStore 尝试搜索')
  }

  @computed.struct get searchName() {
    return this.getSearchName()
  }
  @autobind getSearchName() {
    const { nameCode, formSource: form = {}, code } = this.itemConfig;
    return Utils.isStringFilter(form[nameCode], form[code])
  }

  @computed get searchHintText() {
    return this.keyWord ? `关键字 ${this.keyWord} 的搜索结果` : ''
  }

  @observable searchResult = []
  @action.bound onSearch(keyWord: string): void {
    // console.log('want todo search', keyWord, this.mode === 'search' ? this.keyWord : this.searchName)
    this.searchKeyHistory.push(keyWord)
  }

  @action.bound toSearch(keyWord: string) {
    console.log('尝试搜索', keyWord)
    this.itemConfig.setLoading(true)
    this.remoteSearch(keyWord).then(options => {
      this.itemConfig.setOptions(options)
      this.itemConfig.setLoading(false)
    });
  }
  @action.bound resetKeyword() {
    this.onSearch('*')
  }

  @computed get remoteMethod() {
    const { i, formSource } = this.itemConfig
    if (Utils.isFunction(i.remoteMethod)) {
      return async (keyWord: string) => {
        const r = await i.remoteMethod(keyWord, formSource, this.itemConfig)
        // console.log('remoteSearch get', keyWord, r, this.i.remoteMethod)
        return r
      }
    } else {
      const { type, options } = this.itemConfig
      if (type === 'search') {
        return async (keyWord: string) => {
          return Utils.waitingPromise<Option[]>(0, options)
        }
      }
      return async (keyWord: string) => {
        return options
      }
    }
  }

  @Debounce(100)
  @autobind remoteSearch(keyWord: string) {
    if (this.itemConfig.multiple) {
      return this.multipleRemoteSearch(keyWord.split(','))
    }
    return this.remoteMethod(toString(keyWord))
  }

  @autobind async multipleRemoteSearch(keyWord: string[]) {
    const { remoteMethod } = this;
    let nextOptions: OptionBase[] = []
    if (Utils.isFunction(remoteMethod)) {
      const keyWordArr: string[] = Utils.zipEmptyData([...Utils.isStringFilter(this.searchName, '').split(','), ...keyWord]);
      if (keyWordArr.length === 0) {
        keyWordArr.push('')
      }
      console.log('todo search', keyWordArr, this.itemConfig)
      const resList = map(keyWordArr, keyWord => remoteMethod(keyWord))
      for await (const data of resList) {
        nextOptions.push(...data)
      }
    }
    return nextOptions;
  }
}