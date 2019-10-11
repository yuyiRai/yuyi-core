import { FormItemSpin } from '@/components/CommonDataView';
import { VCProps } from '@/components/CommonFormBase';
import SimpleLoadingMixin from '@/components/CommonMixins/SimpleLoadingMixin';
import { CreateElement } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import OrgDataLoader from './OrgDataLoader';

export type OrgInfo = {
  comcode: string;
  comcname: string;
  orglevel: string;
  uppercomcode: string;
  isLeaf?: boolean;
  [key: string]: any;
}
export interface OrgOption extends OrgInfo {
  /**
   * Disable this option
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Same usage as value. If Vue request you to set this property, you can set it to value of option, and then omit value property.
   * @type string
   */
  key: string;

  /**
   * title of Select after select this Option
   * @type string
   */
  title: string;

  /**
   * default to filter with this property
   * @type string | number
   */
  value: string;

  /**
   * additional class to option
   * @type string
   */
  class: string;

  pId: string;
  [key: string]: any;
}

export const levelKeyword = '_$$level'




export interface IOrgDataLoader {
  getInfo(comCode: string): Promise<OrgInfo>
  appendChildren(comCode: string, orglevel: string): Promise<OrgInfo[]>
}

@Component({
  model: {
    prop: 'value',
    event: 'change'
  }
})
export class TreePropsMixins extends SimpleLoadingMixin {
  /**
   * 本级机构信息
   */
  @Prop({ type: Object, required: true })
  comInfo: OrgInfo;

  /**
   * @model
   */
  @Prop({ type: [Array, String], required: false })
  value?: string | string[];

  @Prop({ type: String, default: '请选择操作机构' })
  placeholder?: string

  @Prop({ type: Boolean })
  disabled?: boolean;

  @Prop({
    type: Function,
    default: (loading: string, children: any, h: CreateElement) => {
      return (
        h(FormItemSpin, { attrs: { spinning: loading } }, [children])
      )
    }
  })
  useLoading?: (loading: boolean, children: any, h: CreateElement) => JSX.Element;

  @Prop({ type: String, default: '' })
  mode?: 'tree' | 'input';

  @Prop({ type: String, default: levelKeyword })
  levelKeyword?: string;

  @Prop({ type: Boolean })
  allowLevelKeyword?: boolean;

  /**
   * 额外处理选项是否可选
   */
  @Prop({ type: Function, default: () => false })
  disabledOption?: (org: OrgInfo) => boolean;

  /**
   * 下级最大深度
   */
  @Prop({ type: [Number], default: 0 })
  levelLimited?: number;

  /**
   * 相对于所属机构的最大机构下级数（(0|true)表示只允许当前及下级，每+1深入允许深入1级）
   */
  @Prop({ type: [Number, Boolean], default: false })
  levelRelativeLimited?: number | boolean;


  // change值翻译器，传入整个节点的数据
  @Prop({ type: Function, default: null })
  transform?: Function

  @Prop({ type: Function, default: null })
  transformFrom?: Function

  @Prop({ type: Boolean, default: true })
  multiple?: boolean;
  // 是否默认选中本级
  @Prop({ type: [Boolean], default: false })
  defaultSelected?: boolean;
  // 是否默认选中本级及下辖
  @Prop({ type: [Boolean], default: true })
  defaultSelectedAll?: boolean
  /**
   * 选择某个节点级下级节点时只显示父级节点的标签
   */
  @Prop({ type: Boolean, default: false })
  useParentShowOnly?: boolean;

  /**
   * 展示本级节点，区别本级不代表全选
   */
  @Prop({ type: Boolean, default: true })
  useLevelNode?: boolean

  /**
   * 数据加载类
   */
  @Prop({ type: Object, default: () => OrgDataLoader })
  loader?: IOrgDataLoader;

  /**
   * 自定义载入选择项
   */
  @Prop({ type: Function, default: null })
  customLoader?: (comcode: string, instance: TreePropsMixins) => Promise<{
    openKeys?: string[],
    data: OrgInfo[],
    defaultValues?: string[],
    appendLoad?: boolean
  }>

  /**
   * 在切换机构的时候重置选项为默认选项（如果设置默认选中或默认全选）
   */
  @Prop({ type: Boolean, default: true })
  switchRefresh?: boolean

  /**
   * 在下级机构切换到上级机构时，是否继承之前的机构树（如果没设置默认选中或默认全选）
   */
  @Prop({ type: Boolean, default: true })
  switchTreeExtends?: boolean;

  /**
   * 是否主动搜索不在机构树中存在的code的信息（及所属的分支树）
   */
  @Prop({ type: Boolean, default: true })
  searchUnknownCode?: boolean;

}
export interface ITreeProps extends VCProps<TreePropsMixins, 'comInfo'> {

}
export type ITreeProps2 = Pick<ITreeProps, 'value'>


export default TreePropsMixins;
