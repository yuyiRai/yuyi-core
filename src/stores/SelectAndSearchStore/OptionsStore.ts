import { observable, computed, action, runInAction } from 'mobx';
import { EventStoreInject } from '../../utils/EventStore';
import { ItemConfig } from '../ItemConfig';
import { autobind } from 'core-decorators';
import Utils, { Option } from '../../utils';
import { findIndex } from 'lodash'


@EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig })
export class OptionsStore {
  [k: string]: any;
  @observable
  itemConfig: ItemConfig;
  __keyMap = {};
  __optionMap = new WeakMap();
  constructor(itemConfig: ItemConfig) {
    this.itemConfig = itemConfig;
    if (this.itemConfig.allowInput) {
      console.log(this);
      this.$on('options-change', () => {
        // console.log(options, this.shadowOption.value)
        // if(this.itemConfig.label==='归属车辆')
        //   debugger
        this.setShadowOptionByValue(this.shadowOption.value, 'options-update');
      });
      // reaction(() => this.itemConfig.options, options => {
      //   // console.log(options, this.shadowOption.value)
      //   // if(this.itemConfig.label==='归属车辆')
      //   //   debugger
      //   this.setShadowOptionByValue(this.shadowOption.value, 'options-update')
      // }, { fireImmediately: true })
    }
  }
  @observable
  shadowOption: any = { key: Utils.uuid(), errorMsg: null, label: '', value: '', highlight: true };
  @computed
  get shadowOptionMode() {
    return this.itemConfig.code === this.itemConfig.nameCode ? 'text' : 'code';
  }
  /**
   * 录入值的自动转化
   * @param { string } value
   * @param { string } label
   */
  @action.bound async setShadowOptionByValue(value: string, source: any) {
    const options = await this.itemConfig.getOptionsSafe();
    // if(this.itemConfig.label==='交强险承保单位')
    //   debugger
    const label = Utils.isStringFilter(Utils.valueToLabel(options, value), this.itemConfig.searchName);
    this.shadowUpdateDispatcher(label, value, source);
  }
  /**
   * 录入值的自动转化
   * @param { string } value
   * @param { string } label
   */
  @action.bound async setShadowOption(label: string, source: any) {
    await this.itemConfig.getOptionsSafe();
    // if(this.itemConfig.label==='交强险承保单位')
    //   debugger
    const value = this.labelToValue(label);
    this.shadowUpdateDispatcher(label, value, source);
  }

  @autobind labelToValue(label: any) {
    return Utils.isStringFilter(Utils.labelToValue(this.displayOptions, new RegExp(`^(\\\[(.*)\\\]|)${label}(\\\[(.*)\\\]|)$`)), label);
  }

  @autobind async shadowUpdateDispatcher(label: any, value: any, source: any) {
    // console.log(`setShadowOption by ${source} mode: ${this.shadowOptionMode}, value: ${value}, label: ${label}`, _.cloneDeep(this.displayOptions), _.cloneDeep(this.itemConfig.options))
    try {
      if (Utils.isNotEmptyString(value)) {
        await this.itemConfig.validateHandler(value);
        // console.log(result, value)
      }
      else {
        throw new Error();
      }
      // console.error('shadowOption result', result, value)
      runInAction(() => this.updateShadowOption(value, label));
    }
    catch (error) {
      // console.log('shadowOption', error)
      if (this.shadowOption.label !== value) {
        this.shadowOption.value = value;
        this.shadowOption.label = label;
        this.shadowOption.errorMsg = error;
      }
    }
  }
  @action.bound
  @Utils.logger('testt')
  @Utils.timebuffer(10)
  updateShadowOption(value: any, label: any = undefined) {
    if (Utils.isString(this.shadowOption.errorMsg)) {
      this.shadowOption.errorMsg = null;
    }
    if (this.itemConfig.label === '交强险承保单位')
      debugger;
    if (value === this.value && this.shadowOption.value != this.value) {
      // console.log(this.selectedLablesStr)
      this.shadowOption.label = label || this.selectedLablesStr;
      this.shadowOption.value = this.value;
    }
    else if (value !== this.value) {
      const shadowOptionSafe = Utils.getOptionsByValue(this.filterOptions, value, true);
      if (shadowOptionSafe) {
        this.shadowOption.label = shadowOptionSafe.label;
      }
      else {
        const { allowCreate } = this.itemConfig;
        if (Utils.isFunction(allowCreate)) {
          const { label } = allowCreate(value);
          this.shadowOption.label = Utils.isStringFilter(label, value, '');
        }
        else {
          this.shadowOption.label = Utils.isStringFilter(label, value, '');
        }
      }
      this.shadowOption.value = value;
    }
    // debugger
    // if (value === this.value && this.shadowOption.value != this.value) {
    //   // console.log(this.selectedLablesStr)
    //   this.shadowOption.label = label || this.selectedLablesStr
    //   this.shadowOption.value = this.value
    // } else if(value !== this.value) {
    //   if (Utils.isFunction(allowCreate)) {
    //     const { label } = allowCreate(value)
    //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
    //   } else {
    //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
    //   }
    //   this.shadowOption.value = Utils.isStringFilter(value, '')
    // }
    console.log(Utils.cloneDeep(this.shadowOption));
    return this.shadowOption = { ...this.shadowOption };
  }
  @computed get isValidShadowOption() {
    return !this.itemConfig.allowInput || !Utils.isString(this.shadowOption.errorMsg);
  }

  static getOptionsKey(item: any, index: any) {
    return Utils.isStringFilter(item.id, item.key, item.value, (Utils.isObject(item) ? index : item) + '');
  }

  @computed get __optionArr(): Option[] {
    const { options } = this.itemConfig;
    const next = [];
    // this.arrayMap(this.__optionArr, this.toConvertedOption)
    for (const item of Utils.isArrayFilter(options) || []) {
      if (!Utils.isNil(item)) {
        const index: number = next.length;
        next.push(Utils.isObject<Option>(item) ? (item.__key == null ? { ...item, __key: OptionsStore.getOptionsKey(item, index) } : item) : {
            __key: OptionsStore.getOptionsKey(item, index),
            value: item
          });
      }
    }
    return next;
  }
  @autobind toConvertedOption(item: Option, index: number): Option {
    if (!this.__optionMap.get(item)) {
      if (!Utils.isNumber(this.__keyMap[item.__key])) {
        this.__keyMap[item.__key] = 0;
      }
      this.__keyMap[item.__key]++;
      this.__optionMap.set(item, {
        ...item,
        key: `${item.__key}.${this.__keyMap[item.__key]}`,
        label: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''),
        value: Utils.isStringFilter(item.value, (Utils.isObject(item) ? index : item) + '')
      });
    }
    return this.__optionMap.get(item);
  }
  @computed get convertedOption(): Option[] {
    // console.time(`2displayOptionsNative${this.itemConfig.label}`)
    const result = Utils.arrayMapDive(this.__optionArr, this.toConvertedOption);
    // console.timeEnd(`2displayOptionsNative${this.itemConfig.label}`)
    // console.time(`displayOptionsNative${this.itemConfig.label}`)
    // const result = [], array = this.__optionArr
    // while (result.length < array.length) {
    //   result[result.length] = (this.toConvertedOption(array[result.length], result.length, this.__keyMap, this.__optionMap))
    // }
    // console.timeEnd(`displayOptionsNative${this.itemConfig.label}`)
    return result;
  }
  @computed get filterOptions(): Option[] {
    // trace()
    const { filterOptions } = this.itemConfig;
    return Utils.isNotEmptyArray(filterOptions) 
      ? Utils.arrayFilterDive(this.convertedOption, (item: Option) => !filterOptions.includes(item.label)) : this.convertedOption;
  }
  @computed get selectedItemIndex(): number {
    const value = Utils.isNotEmptyValueFilter(this.shadowOption.value, this.value);
    return findIndex(this.filterOptions, ({ value: v, label }) => {
      // debugger
      return Utils.isEqual(v, value) || (Utils.isEqual(label, value));
    });
  }
  @computed get displayOptions() {
    const { allowInput } = this.itemConfig;
    const defaultOptions = this.filterOptions;
    if (allowInput) {
      // debugger
      // console.log('getShadowOption', defaultOptions, this.shadowOption)
      if (this.selectedItemIndex > -1) {
        return Utils.arrayMapDive(defaultOptions, 
          (option: Option, index: number) => this.selectedItemIndex === index ? { ...option, highlight: true } : option
        );
      }
      else if (Utils.isNotEmptyString(this.shadowOption.value) && !Utils.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
        // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
        return Utils.concat(this.shadowOption, defaultOptions);
      }
    }
    return defaultOptions;
  }
}