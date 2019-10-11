import { charActer, validatePositiveFloat } from './validate'
import { cloneDeep, repeat } from 'lodash'

/**
 * 自定义内联校验
 * @param {<Value, FormSource>(value: Value,source: FormSource) => boolean} validator 参数为整个form数据，返回校验结果
 * @param {string} message 错误信息
 */
export function compareValidator(validator, message) {
  return {
    message: message || '请检查录入值是否合法！',
    validator: (a, value, callback, allValues) => {
      // console.error(value, allValues, callback)
      return validator(cloneDeep(value), allValues) ? callback() : callback(new Error())
    }
  }
}
export function nameValidator(message) {
  return {
    message: message || '包含非法字符！',
    validator: (rules, value, callback) => {
      // console.error(value, rules, callback)
      return (!value || charActer(value)) ? callback() : callback(new Error())
    }
  }
}

export function prositiveFloatValidator(message) {
  return {
    message: message || '只能录入大于或等于0的整数！',
    validator: (rules, value, callback) => {
      // console.error(value, rules, callback)
      // console.error('test', value, validatePositiveFloat(value))
      return (!value || validatePositiveFloat(value)) ? callback() : callback(new Error())
    }
  }
}

export function useMax(length, message) {
  return {
    message,
    transform: value => {
      const next = (typeof value === 'number' && !Number.isNaN(value)) ? repeat('0', Math.ceil(value)) : value
      // console.error(next)
      return next
    },
    max: length
  }
}
