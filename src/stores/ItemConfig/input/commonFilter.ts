/* eslint-disable */
import { parseTime } from '../../../utils/ParseUtils'
import Utils from '../../../utils';

export type FilterType = 'group' | 'check' | 'checkOne' | 'dateTime' | 'dateToDate'
export class CommonValueFilter {
  type: FilterType;
  constructor(type: FilterType) {
    this.type = type
  }
  get filter() {
    switch (this.type) {
      case 'group':
        return this.groupFilter
      case 'check':
        return this.groupFilter
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
    return this.normalFilter
  }
  get filterToValue() {
    switch (this.type) {
      case 'group':
        return this.groupFilterToValue
      case 'check':
        return this.groupFilterToValue
      case 'checkOne':
        return (v: any) => {
          return v===true ? '1' : '0'
        }
      case 'dateTime': 
        return (v: any) => Utils.isDate(v) ? v : 
                (Utils.isNotEmptyString(v) 
                  ? (v.length<11?(v+" 00:00:00"):v) 
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
    return this.normalFilter
  }

  normalFilter(value: any) {
    return Utils.isNotEmptyValueFilter(value, null)
  }
  groupFilter(string: any) {
    return Utils.isNotEmptyString(string) ? string.split(',').filter((i: string)=>Utils.isNotEmptyString(i)) : [] 
  }
  groupFilterToValue(array: any) {
    return Utils.isArrayFilter(array, []).filter(i=>Utils.isNotEmptyString(i)).join(',')
  }
  
}

export default function getFilter(type: FilterType) {
  return new CommonValueFilter(type);
}