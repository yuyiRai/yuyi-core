import { IFormGroupConfig, FormGroup } from './createFormGroup';
import { IActionConfig } from '../CommonButton/AutoOperationBar/interface';

export interface IModalAction extends IActionConfig {
  name?: 'view' | 'edit' | 'details' | 'delete';
  actionRender?: (props: any) => JSX.Element,
  modalComponent?: any;
  modalProps?: any;
  modalSlot?: string;
  onModalSubmit?: () => Promise<any>
}

export function createFormModalComponent(Form: any, formGroupInject?: IFormGroupConfig) {
  return {
    props: ['loadData'],
    components: { 'modal-form': Form },
    data() {
      return {
        formData: {},
        formGroupInject
      }
    },
    async created() {
      this.formData = await this.loadData()
    },
    render(h) {
      return (
        <FormGroup props={this.formGroupInject}>
          <modal-form ref="form" formData={this.formData} itemContainer={{
            labelCol: { span: 12, xl: 10 },
            wrapperCol: { span: 12, xl: 14 },
            colon: false
          }} />
        </FormGroup>
      )
    },
    methods: {
      async handleSubmit() {
        return this.$refs.form.handleSubmit(true)
      }
    }
  }
}

/**
 * 通过slot创建表单
 * @param scopedSlotCall 
 * @param handleSubmit 
 * @param formGroupInject 
 */
export function createFormModalComponentWithSlot(scopedSlotCall: (formData: any, formGroup?: IFormGroupConfig) => any, handleSubmit: any, formGroupInject?: IFormGroupConfig) {
  return {
    props: ['loadData'],
    data() {
      return {
        formGroupInject,
        formData: {}
      }
    },
    async created() {
      this.formData = this.loadData()
    },
    render(h) {
      return (
        <FormGroup props={this.formGroupInject}>
          {this.scopedSlotCall(this.formData, this.formGroupInject)}
        </FormGroup>
      )
    },
    methods: {
      scopedSlotCall,
      async handleSubmit() {
        return handleSubmit(true)
      }
    }
  }
}
