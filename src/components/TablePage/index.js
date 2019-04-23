/* eslint-disable */
import TablePage from './index.vue'
import Table from "./table.vue";
import BarOperaBtn from "./bar-opera-btn.vue";
import TableOperaBtn from "./table-opera-btn.vue";
import QueryBar from "./query-bar.vue";
import Pagination from "./pagination.vue";
import SimpleDialog from "./dialog.vue";
import Vue from 'vue'

Vue.component('AdminContainer', TablePage)
Vue.component('EpayTable', Table)
Vue.component('EpayOperaBar', BarOperaBtn)
Vue.component('EpayTableOpera', TableOperaBtn)
Vue.component('EpayQueryBar', QueryBar)
Vue.component('EpayPagination', Pagination)
Vue.component('EpaySimpleDialog', SimpleDialog)

export default TablePage