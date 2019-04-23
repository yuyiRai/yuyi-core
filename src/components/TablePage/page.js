/* eslint-disable */
import {
  Confirm,
  DeleteConfirm
} from "./confirmDialog.js"
import Vue from 'vue'
import { of, from, merge, combineLatest} from 'rxjs'
import { map, finalize, switchMap, filter, catchError, tap, debounceTime, distinctUntilChanged, share, shareReplay } from 'rxjs/operators'
import Utils from '../../utils/Utils'
import EventEmitter from "@/utils/EventEmitter.js";

export default class PageUtils {
  waitingResponse = false;
  dataList = [];
  currentData = {};
  service = {};
  $message = Vue.prototype.$message;
  additionQueryName = [];
  additionQuery = [];
  lastParam = {};
  fetchDataEmitter = new EventEmitter();
  optionsInitEmitter = new EventEmitter();

  constructor({
    service,
    formRef,
    instance,
    additionQuery,
    additionQueryList
  }) {
    this.service = service; 
    this.form = formRef;
    this.instance = instance;
    for (let i in additionQuery){
      this.additionQueryName.push(i)
      this.additionQuery.push(additionQuery[i])
    }
    this.additionQuery = this.additionQuery.concat(additionQueryList)
  } 
  registerForm = (form) => {
    this.form = form;
  }
  handleModalOpen = (data, dialog) => {
    this.setCurrentData(data);
  }
  setCurrentData = (data) => {
    console.log('setCurrentData')
    // 设置form
    if (data) {
      this.currentData = data
    } else {
      for (const i in this.currentData) {
        this.currentData[i] = null
      }
    }
  }
  
  getSelectEmitter = new EventEmitter();

  $getSelectlist = merge(
      from(this.getSelectEmitter),
      of([])
    ).pipe(
      map(resArr => Utils.isArrayFilter(resArr)),
      tap(resList => {
        if(resList.length > 0) {
          this.waitingResponse = true
        }
      }),
      switchMap(taskTypeList => combineLatest(
          ..._.map(
            Array.from(new Set(taskTypeList)),
            taskType => from(
              this.instance.$store.dispatch('GetCodeSelect', { 'codeType': taskType })
            )
          ),
          of(null)
      )),
      // map(resArr => Utils.zipEmptyData(resArr)),
      catchError(e=>{
        this.instance.$notify({ title: '失败', message: '选择项数据加载失败', type: 'error' })
      }),
      // tap(res=>console.log('select tap', res)),
      // shareReplay()
    )
  $fetchData = from(this.fetchDataEmitter).pipe(
    distinctUntilChanged((x,y) => Utils.isEqual(x, y)),
    debounceTime(10),
    switchMap(({listQuery, completed, isParamOnly}) => {
      // 获取列表数据
      this.waitingResponse = true;
      let { page, pageSize, param, tableFilterParam, lastQueryOperation } = listQuery;
      // console.log('listQuery', listQuery, isParamOnly)
      return of(Utils.isArrayFilter(this.additionQuery, [])).pipe(
        map(paramTrack => isParamOnly 
          ? paramTrack
          : [from(this.service.pageQuery(page, pageSize, param, tableFilterParam, _.cloneDeep(lastQueryOperation)))].concat(paramTrack)
        ),
        // tap(res=>console.log('tap1', res, isParamOnly)),
        map(queryTrack => Utils.zipEmptyData(queryTrack)),
        // tap(res=>console.log('tap2', res, Utils.isArrayFilter(this.additionQuery, []) )),
        switchMap(queryTrack => combineLatest(this.$getSelectlist, ...queryTrack, of(null))),
        // tap(res=>console.log('tap3',res)),
        catchError(e => {
          console.error(e)
          this.$message.error(e.message || e)
          return of(false)
        }),
        map(resArr => Utils.isArrayFilter(resArr, []).splice(1, resArr.length-2)),
        map(resArr => resArr.pop() || false),
        map(queryRes => {
          // console.log('res', queryRes)
          if(!isParamOnly && Utils.isObject(queryRes)) {
            const { pageSize, page, pageCount, list } = queryRes
            return { pageSize, page, pageCount, list };
          }
          return { list: this.dataList };
        }),
        map(({list, ...res})=>{
          this.dataList = Utils.isArrayFilter(list, []);
          this.lastParam = Utils.isObjectFilter(param, {});
          this.waitingResponse = false;
          console.log('finally', list, res, listQuery, isParamOnly)
          return {list, ...res}
        })
      )
    })
  )
  selectSub = null
  initSelect = (...taskTypes) => {
    return new Promise(resolve => {
      this.selectSub = this.$getSelectlist.subscribe((resList)=>{
        this.selectSub && this.selectSub.unsubscribe()
        this.instance.$forceUpdate();
        this.instance.$nextTick()
        resolve();
      })
      this.getSelectEmitter.emit(taskTypes)
      taskTypes = null
    })
  }
  fetchDataSub = null
  fetchData = (listQuery, completed, isParamOnly) => {
    return new Promise(r => {
      this.fetchDataSub = this.$fetchData.subscribe(res => {
        this.fetchDataSub && this.fetchDataSub.unsubscribe()
        completed(res);
        r(res)
      })
      this.fetchDataEmitter.emit({ listQuery, completed, isParamOnly })
    })
  }
  deleteData = (deleteList, done) => {
    // 删除确认
    if (!deleteList || deleteList.length < 1) {
      this.$message.error("未选择任何数据！");
    } else {
      DeleteConfirm({
        onConfirm: () => {
          return this.service.delete(deleteList).then(response => {
            console.log(response)
            if (response.indexOf("成功") > 0) {
              this.$message.success(response);
              done();
              // 关闭对话框，刷新表格
            } else {
              this.$message.error(response);
            }
          });
        }
      });
    }
  }
  submitData = (flag, done) => {
    this.waitingResponse = true;
    this.instance.$refs[this.form].validate()
      .then(data => {
        console.log(data);
        return this.service[flag](data);
      })
      .then(response => {
        if (response.indexOf("成功") > 0) {
          this.$message.success(response);
          this.setCurrentData();
          done(true);
          // 关闭对话框，刷新表格
        } else {
          this.$message.error(response);
          done(false);
        }
      })
      .catch(error => {
        console.log(error);
        done(false);
        this.$message.error(error);
      })
      .finally(() => {
        this.waitingResponse = false;
      });
  }
}
