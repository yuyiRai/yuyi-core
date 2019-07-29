import * as zango from 'zangodb'
import { Utils } from '@yuyi/utils'
import { chunk } from 'lodash'

export enum EDbFilterOperator {
  $and,
  $or,
  $not,
  $nor,
  $eq,
  $ne,
  $gt,
  $gte,
  $lt,
  $lte,
  $in,
  $nin,
  $elemMatch,
  $regex,
  $exists
}
export enum EDbExpressionOperator {
  $literal,
  $add,
  $subtract,
  $multiply,
  $divide,
  $mod,
  $abs,
  $ceil,
  $floor,
  $ln,
  $log10,
  $pow,
  $sqrt,
  $trunc,
  $concat,
  $toLower,
  $toUpper,
  $concatArrays,
  $dayOfMonth,
  $year,
  $month,
  $hour,
  $minute,
  $second,
  $millisecond
}
export enum EDbUpdateOperator {
  $set,
  $unset,
  $rename,
  $inc,
  $mul,
  $min,
  $max,
  $push,
  $pop,
  $pullAll,
  $pull,
  $addToSet
}
export enum EDbGroupOperator {
  $sum,
  $avg,
  $min,
  $max,
  $push,
  $addToSet
}
export type DBEnum$<T> = { [key in keyof T]: key }
export type Test = DBEnum$<EDbGroupOperator>
function express<T>(e: any): DBEnum$<T> {
  return Utils.reduce(e, (map: any, item: string, key: string | number) => {
    if (!Utils.isNumber(parseInt(key + ''))) {
      map[key] = key
    }
    return map
  }, {})
}
export const $group = express<typeof EDbGroupOperator>(EDbGroupOperator)
export const $filter = express<typeof EDbFilterOperator>(EDbFilterOperator)
export const $update = express<typeof EDbUpdateOperator>(EDbUpdateOperator)
export const $expression = express<typeof EDbExpressionOperator>(EDbExpressionOperator)

export class SelectPipe<T = any> {
  constructor(private collection: zango.Collection, private query = {}, private group = {}, private project = {}) {

  }
  public ifEqual(keyPath: string, value: any) {
    this.query[keyPath] = { [$filter.$eq]: value }
    return this;
  }
  public completed() {
    let query = this.collection.find(this.query)
    if (Utils.isNotEmptyObject(this.group)) {
      query = query.group(this.group)
    }
    if (Utils.isNotEmptyObject(this.project)) {
      query = query.project(this.project)
    }
    return getResult<T>(query)
  }
}

// console.log(Object.entries(EDbExpressionOperator));
export async function insert(data: any, into: zango.Collection): Promise<boolean> {
  try {
    if (!Utils.isObject(data)){
      throw new Error('data is not Object/Array!')
    }
    if(Utils.isEmptyArray(data)) {
      throw new Error('dataset is not Empty!')
    }
    await into.insert(Utils.castArray(data), console.log);
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
export function select<T = any>(from: zango.Collection, filter: object): SelectPipe<T> {
  return new SelectPipe<T>(from, filter)
}
export async function selectAll<T = any>(from: zango.Collection): Promise<T[]> {
  return getResult<T>(from.find({}))
}
export async function selectById<T = any>(from: zango.Collection, id: any): Promise<T[]> {
  const express = { _id: transformParam(id) }
  return getResult<T>(from.find(express))
}

export async function selectByFields<T = any>(from: zango.Collection, ...fieldPath_value: any[]): Promise<T[]> {
  const express = Utils.reduce(chunk(fieldPath_value, 2), (obj, [field, value]) => {
    obj[field] = transformParam(value)
    return obj
  }, {})
  return getResult<T>(from.find(express))
}

function transformParam(value: string) {
  return { [$filter.$eq]: value }
}

export async function getResult<T = any>(query: zango.Cursor): Promise<T[]> {
  let result: any;
  try {
    const res = await query;
    result = await res.toArray()
    return result as any
  } catch (e) {
    console.error('catch: ', e)
  } finally {
    console.log('result: ', result)
  }
}

export * from 'zangodb'