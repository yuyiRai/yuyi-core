/**
 * @module UtilClass
 */
import { includes, last } from './LodashExtra'
import { IKeyValueMap } from './TsUtils';
import { typeFilterUtils } from './TypeLib';
import { createObjectKey } from './CustomUtils';
import { simpleTimeBufferInput } from './TimeBuffer';
export type Service = (...params: any[]) => Promise<any>
export class HttpBox {
  _map = {}
  whiteList: string[] = ['support/findListByCodeType', 'branch/listSubBranches', 'branch/listTopBranches', 'support/findImageTypeList', 'support/findHospitalListByName']
  useKey: IKeyValueMap<string> = {
    'branch/listSubBranches': 'selectTree',
    'branch/listTopBranches': 'selectTree'
  }
  service: Service
  constructor(service: Service, cacheWhiteList: string[], cacheKeyMap: IKeyValueMap<string>) {
    this.service = service
    this.whiteList = cacheWhiteList
    this.useKey = cacheKeyMap
    this.getRes = this.getRes.bind(this)
    this.getReq = this.getReq.bind(this)
    this.todo = this.todo.bind(this)
  }

  getRes(param: any) {
    const { isObjectFilter } = typeFilterUtils

    // console.time(param.url)
    param.__res_key = [param.url, createObjectKey({ ...isObjectFilter(param.params, param.data) })].join('')
    // console.timeEnd(param.url)
    // if('params' in param)
    //   param.params =zipEmptyData(param.params)
    // if('data' in param)
    //   param.data =zipEmptyData(param.data)
    return new Promise((resolve, reject) => {
      if (this.getCahce(param.__res_key)) {
        return resolve(this.getCahce(param.__res_key))
      }
      // tslint:disable-next-line: no-floating-promises
      this.getReq(param, resolve, reject)
    })
  }
  getReq(param: any, resolve: any, reject: any) {
    // tslint:disable-next-line: no-floating-promises
    simpleTimeBufferInput(param.__res_key, { param, resolve, reject }, this.todo, 20)
  }
  // tslint:disable-next-line: variable-name
  setCahce(__res_key: string, value: any) {
    this._map[__res_key] = value;
  }
  // tslint:disable-next-line: variable-name
  getCahce(__res_key: string) {
    return this._map[__res_key];
  }
  todo(list: any[]) {
    const { param: req } = last(list)
    this.service(req).then((res) => {
      if (includes(this.whiteList, req.url) && this.useKey[req.url] === req.useKey) {
        this.setCahce(req.__res_key, res)
        setTimeout(this.setCahce, 30 * 60 * 1000, req.__res_key, undefined);
      }
      for (const i of list) {
        i.resolve(res)
      }
    }).catch(function (e) {
      console.log(e, e.message, typeFilterUtils.isNotEmptyValueFilter(e.message, e))
      const message = typeFilterUtils.isNotEmptyValueFilter(e.message, e)
      for (const i of list) {
        i.reject(new Error(message))
      }
    })
  }
}