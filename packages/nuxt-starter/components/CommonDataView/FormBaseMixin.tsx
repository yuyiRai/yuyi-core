import { IItemConfigGroup } from '@/components/CommonFormBase/interface';
import { VueClass } from 'vue-class-component/lib/declarations';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { IForm } from './Template';
import { TemplateProps } from "./Template/TemplateProps";
import { createForm } from "./createForm";
import { IterableConfigGroup } from '../CommonFormBase/StaticUtils';

@Component({})
export class FormBaseMixin extends TemplateProps {
  /**
   * 表单组件
   */
  Form: VueClass<IForm>

  @Prop({ type: Object })
  itemConfig: IterableConfigGroup

  @Prop({ type: Object })
  initialValues: IItemConfigGroup
  @Prop({})
  appendPipe: IItemConfigGroup

  @Watch('appendPipe', { immediate: true })
  @Watch('itemConfig', { immediate: true })
  @Watch('initialValues', { immediate: true })
  public initFormComponent() {
    this.Form = createForm(this.itemConfig, this.initialValues, this.appendPipe)
  }

  render(h) {
    const { Form } = this
    return <Form {...{ props: this.$props }} />
  }
}
