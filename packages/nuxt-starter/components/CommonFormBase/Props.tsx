import { Component, Prop, Vue } from 'vue-property-decorator';
import { VCProps } from './interface';
import CommonSpinningMixin from '../CommonMixins/CommonSpinningMixin';

@Component({
  model: {
    prop: 'submitData',
    event: 'change'
  }
})
export class CommonFormBaseProps<TForm = any> extends CommonSpinningMixin {
  /**
   * 初始值集合（已废弃）
   * @deprecated
   */
  @Prop({ default: null })
  public initialValues: TForm;
  /**
   * 初始值集合（使用Prop）
   */
  @Prop({
    type: Object, default() {
      return this.submitData;
    }
  })
  public formData: TForm;
  /**
   * 表单值集合
   * @model
   */
  @Prop({ type: Object, default: () => ({}) })
  public submitData: TForm;
}
export interface ICommonFormBaseProps<TForm = any> extends VCProps<CommonFormBaseProps<TForm>, false> {
}

export default CommonFormBaseProps
