import { CommonPageRequestParams } from '@/api';
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';
import { Component as TsxComponent } from 'vue-tsx-support';
import SimpleLoadingMixin, { ISimpleLoadingMixinProps } from '../CommonMixins/SimpleLoadingMixin';
import { AntTable, ITableProps } from './AntTable';

export interface ISTableProps extends ITableProps, ISimpleLoadingMixinProps {
  rowKey?: string | Function;
  dataSource?: any[]
  data: (args?: CommonPageRequestParams) => Promise<any>
  pageNum?: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  size?: 'small' | 'default';
  alert?: {
    show: true,
    clear: Function
  } | boolean;
  rowSelection?: any;
  selectedRowKeys?: string[]
  selectedRows?: any[]
  showPagination?: boolean | 'auto';
  pageURI?: boolean;
}

@Component({
  props: { ...(AntTable as any).props } as any
})
export class STableProps extends mixins(SimpleLoadingMixin, TsxComponent) {
  /**
   * 行key
   */
  @Prop({ type: [String, Function], default: 'key' })
  rowKey?: string | Function;

  /**
   * 是否立即加载表格数据
   */
  @Prop({ type: Boolean, default: true })
  initialLoad: boolean

  /**
   * @model .sync
   */
  @Prop({ type: Array, default: () => [] })
  dataSource?: Array<any>

  @Prop({ type: Function, required: true })
  data: (args?: CommonPageRequestParams) => Promise<any>

  @Prop({ type: Number, default: 1 })
  pageNum?: number;

  @Prop({ type: Number, default: 5 })
  pageSize?: number;

  @Prop({ type: Boolean, default: true })
  showSizeChanger?: boolean;

  @Prop({ type: String, validator: v => ['small', 'default'].includes(v) })
  size?: 'small' | 'default';

  /**
   * alert: {
   *   show: true,
   *   clear: Function
   * }
   */
  @Prop({ type: [Object, Boolean], default: null })
  alert?: {
    show: true,
    clear: Function
  } | boolean;

  @Prop({ type: Object, default: null })
  rowSelection?: any;

  /**
   * @model
   */
  @Prop({ type: Array, default: null })
  selectedRowKeys?: string[]

  /**
   * @model .sync
   */
  @Prop({ type: Array, default: null })
  selectedRows?: any[]

  @Prop({ type: [String, Boolean], default: true })
  showPagination?: boolean | 'auto';

  /**
   * 预加载函数
   */
  @Prop({
    type: Function, default() {
      // debugger
      return this.$store && this.$store.dispatch('WaitingOptions')
    }
  })
  preLoader?: () => Promise<any>;

  render(h) {
    return <a></a>
  }
}
console.log(STableProps)

export type TypedTable = VueComponent<ISTableProps, { onChange?: any;[key: string]: any; }>
export default STableProps
