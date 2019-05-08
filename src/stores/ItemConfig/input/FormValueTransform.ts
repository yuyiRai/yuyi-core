/* eslint-disable */
import { parseTime, DateFormatter, EDateFormatter } from '../../../utils/ParseUtils'
import Utils, { observable, computed } from '../../../utils';

export type FilterTypeKey = 'group' | 'dateTime' | 'date' | 'dateToDate'
export type FilterType = FilterTypeKey | IFormValueTransform
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
    const { type } = this;
    if (Utils.isObject(type) && type.F2V) {
      return type.F2V
    }
    switch (this.type) {
      case 'group':
        return this.groupF2V
      case 'dateTime': 
        return this.dateFormatter(EDateFormatter.dateTime);
      case 'date': 
        return this.dateFormatter(EDateFormatter.date);
      case 'dateToDate':
        return (v: any) => Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i))
    }
    return this.normalCommon
  }
  @computed get V2F() {
    const { type } = this;
    if (Utils.isObject(type) && type.V2F) {
      return type.V2F
    }
    switch (this.type) {
      case 'group':
        return this.groupV2F
      case 'dateTime': 
        return this.dateFormatter(EDateFormatter.dateTime)
      case 'date': 
        return this.dateFormatter(EDateFormatter.date);
      case 'dateToDate':
        return (v: any) => {
          const [s,e] = Utils.isArrayFilter(v, []).filter((i) => Utils.isNotEmptyValue(i))
          if(Utils.isNotEmptyValue(s) && Utils.isNotEmptyValue(e)){
            return [`${s}${s.length<11?' 00:00:00':''}`, `${s.length<11?parseTime(new Date(new Date(e).setTime(new Date(e+' 00:00:00').getTime()-1))):''}`]
          }
          return [s,e]
        }
    }
    return this.normalCommon
  }

  private normalCommon(value: any) {
    return Utils.isNotEmptyValueFilter(value)
  }

  private dateFormatter(formatter?: DateFormatter) {
    return (value: any) => Utils.toDateString(value, formatter)
  }

  private groupF2V(value: any) {
    let next: string[];
    if (Utils.isNotEmptyString(value)) {
      next = value.split(',')
    } else {
      next = Utils.castArray(value)
    }
    return Utils.zipEmptyData(next)
  }
  private groupV2F(array: any[]) {
    return Utils.toString(Utils.zipEmptyData(Utils.isArrayFilter(array, [])))
  }
}

export default function getTransform(type: FilterType | string): IFormValueTransform {
  return new FormValueTransform(type as FilterType);
}