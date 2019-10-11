import { groupBy, map } from 'lodash'
import { Row } from 'ant-design-vue'
import { Vue, Prop, Component } from 'vue-property-decorator'
import { IFormItemConfig } from '../../../CommonFormBase/interface';
import { typeFilterUtils } from '@yuyi/utils';
import './AutoGroupRow.less'

@Component({})
export class AutoGroupRow extends Vue {
  @Prop({ type: Array })
  public itemList: any[];
  @Prop({ type: Object })
  public rowProps: Partial<Row>;
  @Prop({ type: String })
  public rowClass: string;
  @Prop({ type: Object })
  public rowStyle: any;

  public get itemGroupList() {
    let tmp = 0
    const list = this.itemList
    return groupBy(list, (item) => {
      const plus = this.getItemCol(item)
      var r = Math.floor(tmp / 24)
      tmp += plus
      return r
    })
  }

  public getItemCol(item: IFormItemConfig) {
    return typeFilterUtils.isNumberFilter(
      item.col,
      (item.col instanceof Object) && item.col.span,
      item.container && item.container.col,
      (item.container && item.container.col instanceof Object) && item.container.col.span,
      12
    )
  }

  public render(h: any) {
    return (
      <div>{
        map(Object.keys(this.itemGroupList), key => {
          const itemList = this.itemGroupList[key] || []
          return (
            <a-row {...{ props: this.rowProps }} class={this.rowClass} style={this.rowStyle}>{
              map(itemList, item => {
                return this.$scopedSlots.item(item)
              })
            }</a-row>
          )
        })
      }{this.$slots.footer}</div>
    )
  }
}

export default AutoGroupRow
