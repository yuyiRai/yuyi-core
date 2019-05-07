import { autobind } from "core-decorators";
import { map, toString } from 'lodash';
import { computed, observable, action } from "mobx";
import { Option } from "../../utils";
import { IItemConfig } from "./interface/ItemConfig";

export interface ISearchConfig {
  remoteMethod?: <T = Option>(key: string, formSource?: any, config?: this) => Promise<T[]>;
  multiple?: boolean;
}

export class SearchStore {
  [k: string]: any;
  @observable itemConfig: IItemConfig;
  @observable keyWord: string | null

  constructor(itemConfig: IItemConfig) {
    this.itemConfig = itemConfig
  }
  @computed.struct get searchName() {
    return this.getSearchName()
  }
  @autobind getSearchName() {
    const { nameCode, formSource: form = {}, code } = this.itemConfig;
    return Utils.isStringFilter(!Utils.isNil(nameCode) ? form[nameCode] : form[code])
  }

  @computed get searchHintText() {
    return this.keyWord ? `关键字 ${this.keyWord} 的搜索结果` : ''
  }

  @observable searchResult = []
  @action.bound onSearch(keyWord: string): void {
    this.keyWord = keyWord
    this.itemConfig.setLoading(true)
    this.remoteSearch(keyWord).then(options => {
      this.itemConfig.setOptions(options)
      this.itemConfig.setLoading(false)
    });
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
          return Utils.waitingPromise<Option[]>(1000, Utils.getOptionsByLabel(options, new RegExp(keyWord)))
        }
      }
      return async (keyWord: string) => {
        return options
      }
    }
  }

  @autobind remoteSearch(keyWord: string) {
    if (this.itemConfig.multiple) {
      return this.multipleRemoteSearch(keyWord.split(','))
    }
    return this.remoteMethod(toString(keyWord))
  }

  @autobind async multipleRemoteSearch(keyWord: string[]) {
    const { remoteMethod } = this;
    let nextOptions: Option[] = []
    if (Utils.isFunction(remoteMethod)) {
      const keyWordArr: string[] = Utils.zipEmptyData(Utils.castArray(keyWord));
      if (keyWordArr.length > 0) {
        const resList = map(keyWordArr, keyWord => remoteMethod(keyWord))
        for await (const data of resList) {
          Utils.arrayPush(nextOptions, data)
        }
      }
    }
    return nextOptions;
  }
}