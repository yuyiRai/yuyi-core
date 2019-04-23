
/* eslint-disable */
import { Confirm, DeleteConfirm } from "./confirmDialog.js";
import CommonPage from './index.vue'
import Table from "./table.vue";
import BarOperaBtn from "./bar-opera-btn.vue";
import TableOperaBtn from "./table-opera-btn.vue";
import QueryBar from "./query-bar.vue";
import Pagination from "./pagination.vue";
import SimpleDialog from "./dialog.vue";
import EventEmitter, { SimpleMixin } from '@/utils/EventEmitter.js'
import {merge, of} from 'rxjs';
import { bufferTime, map, filter, tap, distinctUntilChanged } from 'rxjs/operators'

export default {
  components: { 
    'AdminContainer': CommonPage,
    'EpayTable': Table,
    'EpayOperaBar': BarOperaBtn,
    'EpayTableOpera': TableOperaBtn,
    'EpayQueryBar': QueryBar,
    'EpayPagination': Pagination,
    'EpaySimpleDialog': SimpleDialog
  },
  mixins: [SimpleMixin({
    init() {
      console.log('***********',this)
      // if(this.isDataInit){
      //   console.log(this.listQuery,'dataInit');
      // }
      // this.getData(!this.isDataInit);
      merge(
        of(!this.isDataInit),
        this.fetchDataEmitter
      ).pipe(
        // distinctUntilChanged((a,b)=>_.isEqual(a,b)),
        map((req) => {
          if(!_.isObject(req)) {
            return { isParamOnly: req || false, type: 'other'}
          }
          if(
            _.findLastIndex(this.fetchOperationTrack, ({type}) => type==='filter') > _.findLastIndex(this.fetchOperationTrack, ({type}) => type==='filterOut') && 
            !['filter', 'filterOut'].includes(req.type)
          ){
            req.type = req.type.replace(/(\+filter|)$/,`+filter`)
          }
          return req;
        }),
        tap(req => this.fetchOperationTrack.push(req)),
        map(req=>req.isParamOnly),
        bufferTime(50),
        filter(list => list.length > 0), // 这段时间至少有一次请求的场合
        map(list => list.some(i=>i)) // 是否只需要获取参数（这几次请求里只要有一次需要就算作需要）
      ).subscribe(req => this.getData(req))
      if(this.closeDialogEmitter)
        this.closeDialogEmitter.subscribe(() => this.closeDialogHandler())
      if(this.toDoEmitter)
        this.toDoEmitter.subscribe(({source, type, rowData, filter}) => this.operaTodo(source, type, rowData, filter))
    }
  })],
  computed: {
    tableColSlots() {
      return this.dataConfig.map(i=>i.slot).filter(slot=>slot);
    },
    permissions() {
      // console.log(this.$router.currentRoute.meta.permissions);
      // return this.$router.currentRoute.meta.permissions.filter(
      //   item => item.type == "button"
      // );
      return this.operaBtnConfig || []
    },
    listQuery() {
      return {
        ...this.listPageConfig,
        param: this.listQueryParam,
        tableFilterParam: this.tableFilterParam,
        lastQueryOperation: _.last(this.fetchOperationTrack) || {}
      };
    },
    dataList() {
      return this.data;
    },
    operaToDialog(e) {
      // console.log("first", e);
      return ["add", "edit", ...this.dialogOpera];
    },
    tableFilterParam() {
      return _.reduce(this.tableFilterParamMap, function(obj, value, key) {
        return Object.assign(obj, _.isObject(value) ? value : {[key]: value})
      }, {})
    }
  },
  watch:{
    '$route.path': {
      handler(current, pre) {
        if(_.isNil(pre) && !_.isNil(current)) {
          this.corePath = current;
        } if (current === this.corePath) {
          console.log('route change', current, pre)
          this.fetchDataEmitter.emit(false)
        }
      },
      immediate: true
    },
    listQueryParam:{
      handler(param, last) {
        this.$emit('onParamChange', param)
      },
      deep: true,
      immediate: true
    },
    // '$route.query.tpp':{
    //   async handler(tpp) {
    //     if(this.checkTpp) {
    //       console.error(await Utils.waitingPromise(200, tpp))
    //       this.listPageConfig = {
    //         ...this.listPageConfig,
    //         page: Utils.isNotNaNFilter(parseInt(tpp), 1)
    //       }
    //       console.error({...this.listPageConfig})
    //       this.pageChange(this.listPageConfig)
    //     }
    //   },
    //   immediate:true
    // }
  },
  props: {
    checkTpp: Boolean,
    editableRows: { type: Array },
    toDoEmitter: { type: EventEmitter, }, 
    fetchDataEmitter: { type: EventEmitter, default: () => new EventEmitter() }, 
    closeDialogEmitter: { type: EventEmitter, },
    // 表格数据
    data: { type: Array, default: Utils.stubArray },
    small: { type: Boolean },
    dataKey: { type: String, required: true },
    tabConfig: { required: false, default: null },
    currentTab: {requred: false, default: null },
    useQuery: { type: Boolean, default: true },
    useOperation: { type: Boolean, default: true },
    usePagation: { type: Object, default: () => ({
      page: 1,
      pageSize: 5,
      pageCount: 1
    }) },
    operaBtnConfig: { type: Array, default: ()=>([]) },
    // 禁用
    disabled: { type: Boolean, default: false },
    // 是否进入页面立即初始化数据
    isDataInit: { type: Boolean, default: true },
    // 可以打开dialog的操作
    dialogOpera: { type: Array, default: () => ["add", "edit"] },
    dataConfig: { type: Array, required: true },
    queryConfig: { type: Array },
    dialogConfig: {
      type: Object,
      default: () => ({
        titleMap: { add: "新增", edit: "编辑", pass: "修改密码" }, 
        submitTextMap: { add: "确定", edit: "修改", pass: "确认修改" }, 
        cancelTextMap: { dispatcher: "返回" }
      })
    }
  },
  data() {
    return {
      corePath: '',
      fetchOperationTrack: [],
      selectedList: [], // 表格已选择列
      dialogType: "close", // dialog类型 默认：close-关闭 add-新增 edit-修改
      filterName: null,
      listQueryParam: {},
      tableFilterParamMap: {},
      listPageConfig: {
        page: 1,
        pageSize: 5,
        pageCount: 1,
        show: true,
        ...this.usePagation
      }
    };
  },
  methods: {
    isNotNil(value) {
      return !Utils.isNil(value)
    },
    getData(isParamOnly) {
      console.log('getFetch', this.listQuery)
      if(this.listQuery.lastQueryOperation.type=='paramsQuery') {
        this.listPageConfig.page = 1
      }
      this.$emit(
        "fetch-data",
        this.listQuery,
        ({ page, pageSize, pageCount }) => {
          // console.log(page,pageSize,'getRes')
          const lastConfig = this.lastListPageConfig || {}
          this.listPageConfig = {
            ...this.listPageConfig,
            page: Utils.isNumberFilter(page, lastConfig.page  || 1),
            pageSize: Utils.isNumberFilter(pageSize, lastConfig.pageSize  || 5),
            pageCount: Utils.isNumberFilter(pageCount, lastConfig.pageCount || 0)
          };
          // console.log(this.$route.query)
          this.listQueryParam = { ...this.listQueryParam };
          this.lastListPageConfig = {...this.listPageConfig}
          // this.$router.push({
          //   path: this.$route.path,
          //   query: {
          //     ...this.$route.query,
          //     tpp: this.listPageConfig.page
          //   }
          // })

          return this.listQueryParam;
        },
        isParamOnly
      );
    },
    filterHandler(param, isReset) {
      console.log({...param})
      this.listQueryParam = { ...param };
      this.$emit("param", this.listQueryParam)
      if (!isReset) {
        this.emmitFetch('paramsQuery');
      }
    },
    emmitFetch(type, isParamOnly = false) {
      this.fetchDataEmitter.emit({isParamOnly, type});
    },  
    pageChange(queryConfig) {
      this.emmitFetch('pageChange');
      this.lastQueryOperation = 'pageChange'
      this.$emit('pageChange', queryConfig)
    },
    submit(dialogType, done) {
      this.$emit("submit", dialogType, close => {
        if (close) this.emmitFetch('refresh');
        done(close);
      });
    },
    operaTodo(source, type, responseData, filter) {
      // 是否打开dialog
      const isDialog = this.operaToDialog.indexOf(type) > -1 || this.permissions.filter(i => i.code === type && i.showDialog).length > 0;
      // 过滤操作数据 
      const fiterData = filter ? filter(responseData, this.selectedList) : responseData
      if (isDialog && fiterData) {
        this.openDialogHandler(type)
        console.log(this.dialogType, this.$refs.dialog);
      }
      if (type === "delete") {
        this.onDelete(source, fiterData);
      } else {
        console.log(source,type)
        this.$emit(type, fiterData || this.selectedList, isDialog ? this.closeDialogHandler : false);
      }
    },
    onDelete(source, responseData) {
      console.log(responseData);
      let data = source === "inline" ? [responseData] : this.selectedList;
      this.$emit("delete", data, () => {
        this.emmitFetch('refresh');
      });
    },
    onSelect(selectedList) {
      // 当表格行被选中
      this.selectedList = selectedList;
      // console.log(selectedList);
      this.$emit("onSelect", selectedList);
    },    
    onSortChange(propName, method) {
      // 当任意列进行排序操作
      this.$emit("onSortChange", propName, method);
    },
    onCurrentChange(currentRow, oldRow) {
      this.$emit('onCurrentChange', currentRow, oldRow)
    },
    onColumnFilter(columnName, data) {
      this.tableFilterParamMap = {...this.tableFilterParamMap, [columnName]: data}
      this.lastQueryOperation = 'filter'
      console.log('onColumnFilter', this.tableFilterParamMap, this.tableFilterParam)
      this.emmitFetch(Utils.isEmptyData(this.tableFilterParam)?'filterOut':'filter')
      this.$emit('onColumnFilter', columnName, data)
    },
    onDialogClose() {
      this.dialogType = "close";
      this.$emit("onDialogClose");
    },
    openDialogHandler(type) {
        this.dialogType = type; // 将dialog类型设置为操作类型
    },
    closeDialogHandler(done) {
      this.$refs.dialog.closeDialog(done)
    },
    toggleRowSelection(row, check) {
      this.$refs.tableInstance.toggleRowSelection(row, check);
    },
    toggleRowExpansion(row, expaned) {
      this.$refs.tableInstance.toggleRowExpansion(row, expaned)
    },
    onTabClick({label, name}) {
      console.log(label, name)
      if (!this.disabled) {
        this.$emit('onTabClick', name)
      }
    }
  }
};