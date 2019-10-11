import { IAutoOperationBarInjectProps } from '@/components/CommonButton';
import { VCProps } from '@/components/CommonFormBase';
import { ISimpleSpinningMixinProps } from '@/components/CommonMixins';
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { IFormChildrenMixinsProps } from '../FormChildrenMixins';
import TemplateTsx from './Template';
import TemplateVue from './Template.vue';
import TemplateProps from './TemplateProps';
import { ICommonFormBaseProps } from '../../CommonFormBase/Props';
export { IForm, ISubmitForm } from './Template';
export { TemplateProps };


export interface ITemplateProps extends
  ICommonFormBaseProps,
  VCProps<TemplateProps>,
  IFormChildrenMixinsProps,
  ISimpleSpinningMixinProps,
  IAutoOperationBarInjectProps {
}
const Template: VueComponent<ITemplateProps, {}, {}, typeof TemplateTsx> = TemplateVue as any

export default Template
