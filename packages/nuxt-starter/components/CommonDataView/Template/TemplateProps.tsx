
/* eslint-disable */
import { AutoDescriptionList } from '@/components';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AutoOperationBar } from '../../CommonButton';
import { LabelWidthFormContainer } from '../components/LabelWidthForm';
import { IFormItemConfig } from '@/components/CommonFormBase';

@Component({
  components: {
    AutoOperationBar,
    AutoDescriptionList,
    LabelWidthFormContainer
  }
})
export class TemplateProps extends Vue {
  /**
   * 整体设置默认的item.container
   * 优先度低于itemConfig中个别设置
   */
  @Prop({ type: Object, default: () => ({}) })
  public itemContainer?: IFormItemConfig['container'];

  /**
   * 指定表单展现的最小宽度
   * @default "auto"
   */
  @Prop({ type: String, default: 'auto' })
  public width?: string;
  /**
   * 设置label的宽度(px)，不设置或≤0时使用itemContainer中的gird配置
   * 目前只能整体设置，优先度最高
   * @default 0
   */
  @Prop({ type: Number, default: 0 })
  public labelWidth?: number;

  /**
   * 渲染模式（待开发）
   * @default false
   */
  @Prop({ type: Boolean, default: false })
  public draw?: boolean;

  /**
   * 表单展现形式 目前只有 [default]、[card] 两种
   * @default 'default'
   */
  @Prop({ type: String, default: 'default' })
  public viewMode?: 'default' | 'card';

  // @Prop({ type: Object, default: () => ({}) })
  // public primaryKey?: object;

  /**
   * 配置展示descriptionList
   */
  @Prop({
    type: Object,
    default: undefined
  })
  public descriptionList?: {
    title?: string;
    termMap?: {
      [key: string]: string;
    };
  };

  /**
   * 整体设置展示校验标志，见item.hasFeedback
   */
  @Prop({ type: Boolean, default: false })
  hasFeedback?: boolean;

  /**
   * 指定禁用表单项
   */
  @Prop({ type: [Boolean, Object, Array], default: () => [] })
  disabled?: string[] | Object | boolean;
}

export default TemplateProps
