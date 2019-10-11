import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import { IFormGroupConfig } from './createFormGroup';
import { typeFilterUtils } from '@yuyi/utils';
import CommonSpinningMixin, { ICommonSpinningMixinProps } from '../CommonMixins/CommonSpinningMixin';
import { VCProps } from '../CommonFormBase';

export interface IFormChildrenMixinsProps extends VCProps<CommonSpinningMixin, false>{

}

@Component({})
export class FormChildrenMixins extends CommonSpinningMixin {
  /**
   * 是否只读
   */
  @Prop({ type: null })
  readonly?: boolean;

  /**
   * 表单组注入
   */
  @Prop({ type: null })
  @Inject({ from: 'CFromGroup', default: () => ({ value: {} }) })
  fromGroup?: {
    value: IFormGroupConfig;
  };

  /**
   * 是否只读
   * @public 
   */
  protected get isReadOnly() {
    // debugger
    return typeFilterUtils.isBooleanFilter(this.readonly, this.fromGroup.value && this.fromGroup.value.readonly);
  }
}

console.log(FormChildrenMixins)
export default FormChildrenMixins;
