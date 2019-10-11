import { CommonFormBase, IFormItemConfig, Utils, ICommonFormInstance } from '@/components/CommonFormBase';
import { IAppendGroupPipeGroup, IItemConfigGroup } from '@/components/CommonFormBase/interface';
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { VueConstructor } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { ICommonFormBaseProps } from '../CommonFormBase/Props';
import { HintFlag } from './components/HintFlag';
import Template, { ITemplateProps } from './Template';

export function createForm(itemConfig: IFormItemConfig[] | IItemConfigGroup, initialValues?: any, appendConfigPipe?: IAppendGroupPipeGroup) {
  if (itemConfig instanceof Array) {
    itemConfig = { default: itemConfig }
  }
  // console.log(Template)
  const CommonFormMixin = CommonFormBase(itemConfig, initialValues, appendConfigPipe);
  const Base = CommonFormMixin.mixins(Template);
  @Component({
    components: { HintComponent: HintFlag }
  })
  class Form extends Base {

    @Watch('utils.lastChangedValue')
    onChanged() {
      this.emitChange();
      // console.log('this.form', this.form.getFieldsError());
    }
    // protected uuid = uuid()

    @Watch('isReadOnly')
    @Watch('itemConfig', { immediate: true })
    onReadStatusChanged(now: boolean, last: boolean) {
      // this.uuid = uuid()
      this.updateDisplayConfig()
      this.form = this.utils.formInit(this.utils.submitData, this, true)
    }

    static extends(extendClass: (base: typeof Form) => VueConstructor<(typeof Form extends VueConstructor<infer P> ? P : any)>) {
      return extendClass(Form);
    }
  }
  return Form as VueComponent<ITemplateProps & ICommonFormBaseProps, { onChange: (value: any) => any }, {}, typeof Form>;
}

export type CommonFormComponent = InstanceType<ReturnType<typeof createForm>>

export default createForm
