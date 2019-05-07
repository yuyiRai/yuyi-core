/* eslint-disable */
import { parseTime } from '../../../utils/ParseUtils'
import moment from 'moment'
import Utils, { observable, computed } from '../../../utils';
import { FormItemType } from '../interface';

export type FilterType = 'group' | FormItemType
export interface IFormValueTransform {
  F2V: (value: any) => any;
  V2F: (value: any) => any;
}
export class FormValueTransform implements IFormValueTransform {
  @observable private type: FilterType;
  constructor(type: FilterType) {
    this.type = type
  }
  @computed get F2V() {
    switch (this.type) {
      case 'group':
        return this.groupF2V
      case 'check':
        return this.groupF2V
      case 'checkOne':
        return (v: any) => v === '1';
      case 'dateTime': 
        return (v: any) => Utils.isDate(v) ? v : 
                (Utils.isNotEmptyString(v) 
                  ? (v.length<11?(v+" 00:00:00"):v) 
                  : undefined);
      case 'dateToDate':
        return (v: any) => Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i))
    }
    return this.normalF2V
  }
  @computed get V2F() {
    switch (this.type) {
      case 'group':
        return this.groupV2F
      case 'check':
        return this.groupV2F
      case 'checkOne':
        return (v: any) => {
          return v===true ? '1' : '0'
        }
      case 'dateTime': 
        return (v: any) => Utils.isDate(v) ? v : 
                (Utils.isNotEmptyString(v) 
                  ? moment(v).format('YYYY-MM-DD HH:mm:ss')
                  : undefined)
      case 'dateToDate':
        return (v: any) => {
          const [s,e] = Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i))
          if(Utils.isNotEmptyValue(s) && Utils.isNotEmptyValue(e)){
            return [`${s}${s.length<11?' 00:00:00':''}`, `${s.length<11?parseTime(new Date(new Date(e).setTime(new Date(e+' 00:00:00').getTime()-1))):''}`]
          }
          return [s,e]
        }
    }
    return this.normalF2V
  }

  private normalF2V(value: any) {
    return Utils.isNotEmptyValueFilter(value)
  }
  private groupF2V(string: any) {
    // debugger
    return Utils.isNotEmptyString(string) ? Utils.zipEmptyData(string.split(',')) : [] 
  }
  private groupV2F(array: any) {
    return Utils.toString(Utils.zipEmptyData(Utils.isArrayFilter(array, [])))
  }

}

export default function getTransform(type: FilterType | string): IFormValueTransform {
  return new FormValueTransform(type as FilterType);
}