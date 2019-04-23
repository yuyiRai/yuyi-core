import { map } from 'lodash'
import { ItemConfig } from '../ItemConfig';
import Utils from '../../../utils';

export const checkDateToDate = (date: any, itemConfig: ItemConfig) => ((rule: any, value: any, callback: any) => {
  const [start, end] = map(itemConfig.code.split('|'), code => itemConfig.form[code])
  if (!Utils.isNil(start) && !Utils.isNil(end) && itemConfig.type === 'dateToDate') {
    console.log('testt, check', [start, end], itemConfig)
    // console.log(start,end,value)
    if(Utils.isNotEmptyValue(end) && Utils.isNotEmptyValue(start)){
      const endTime = new Date(end).getTime()
      const startTime = new Date(start).getTime()
      if ((endTime - startTime) > 30 * 1000 * 60 * 60 * 24) {
        console.error(`${itemConfig.label}时长超出${date}天`)
        throw callback(new Error(`${itemConfig.label}时长超出${date}天！`));
      } else if(endTime < startTime){
        throw callback(new Error(`${itemConfig.label}截止时间不能早于起始时间！`));
      }
    }
  }
  // console.log('回调3', value)
  return callback();
})

export const checkFutureDate = (itemConfig: ItemConfig) => ((rule: any, value: any, callback: any) => {
  if (Utils.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
    return callback(new Error(`${itemConfig.label}不能早于当前时间`));
  }
  return callback();
})

export const getDefaultRules = function(itemConfig: ItemConfig) {
  return {
    dateToDate30: [{
      validator: checkDateToDate(30, itemConfig),
      trigger: ['change', 'blur'],
    }],
    futureDate: [{
      validator: checkFutureDate(itemConfig),
      trigger: 'blur'
    }]
  }
}

export const DateUtils = {
  getDateRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
    return [start, end]
  }
}