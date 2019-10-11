import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { cloneDeep, get } from 'lodash';
import isEqual from 'lodash/isEqual';
import { Component, Watch } from 'vue-property-decorator';
import { IDetailFormBase } from './interface';
import CommonFormPropsAndEvent from './PropsAndEvents';
import { IterableConfigGroup } from './StaticUtils';
import { Utils } from './Utils';

const emptyConfig = Object.freeze({})


export * from './PropsAndEvents';

@Component({})
export class CommonFormBaseMixins<InputForm = any, OutputForm = any> extends CommonFormPropsAndEvent<InputForm, OutputForm> implements IDetailFormBase {

  beforeDestroy() {
    console.log('destroy');
    this.utils = null;
  }
  /**
   * 处理表单的实用工具
   */
  public utils = new Utils<InputForm, OutputForm>();
  /**
   * antd表单工具集
   */
  public form: WrappedFormUtils = null;
  /**
   * 初始值集合（使用Data）
   */
  public localInitialValues: OutputForm = null;
  /**
   * 记录创建时的初始值集合
   */
  public get _initialValues(): OutputForm {
    return this.utils.initialValues
  }
  public get computedInitialValues() {
    return this.initialValues || this._initialValues
  }
  /**
   * 表单配置项清单
   */
  public get itemConfig(): IterableConfigGroup {
    return this.utils.getGlobalItemConfig() || emptyConfig as any
  }
  protected formInited: boolean = false;


  _lastReceiveInitialValues = null
  /**
   *
   * @param update
   * @param last
   * @internal
   */
  @Watch('localInitialValues', {})
  public __onInitialValuesReceive(update: OutputForm) {
    // debugger
    if (update != this._lastReceiveInitialValues) {
      console.error('表单数据' + (update === this._initialValues ? '初始化' : '重载'), update, this.utils.$$$key);
      this.emitChange()
      this._lastReceiveInitialValues = update;
    }
  }

  __lastChangedEmit: OutputForm

  /**
   * 向上传递表单更新事件
   */
  public emitChange() {
    // console.error('change', this.utils.submitData, this.__lastChangedEmit)
    this.__lastChangedEmit = this.utils.submitData
    // console.error('submitData:update', this.utils.localSubmitData, this.utils.localFormData);
    this.onChange(this.utils.submitData, this.utils.localFormData);
  }

  /**
   *
   */
  public async created() {
    this.formInited = false;
  }
  public async clearValidate(fields: string[] = this.utils.codeList) {
    console.error('clearValidate')
    // return await (this.form as any).clearField(fields)
  }

  public getFieldValue(code: string, defaultValue?: any) {
    return get(this.utils.submitData, code, defaultValue)
  }

  /**
   * 校验表单
   * @param fields - 要校验的字段列表
   * @public
   */
  public async validate<Data = any>(fields: string[] = this.utils.codeList, scroll: boolean = true) {
    // fields = fields || 
    await this.$autils.$waitingOptions()
    // debugger
    return new Promise<Data>((resolve, reject) => {
      this.form.validateFields(fields, {
        force: true,
        scroll: scroll ? {
          container: () => document.body
        } : null
      }, (errors, values) => {
        // console.log('validateFieldsAndScroll', fields, errors, values);
        if (!errors) {
          resolve(values);
        } else {
          /* eslint-disable-next-line */
          reject({ errors, values });
        }
      });
    });
  }


  resetFields(name?: string[]) {
    return this.form.resetFields(name)
  }

  _lastReceiveFormData: OutputForm = null
  /**
   * 当载入一个新的表单
   * @param nextData 
   */
  nextFormDataReceive(nextData: OutputForm) {
    this.utils.connect(this)
    this.utils.configInit()
    // console.error('formData change')
    if (this._lastReceiveFormData != nextData) {
      if (this.localInitialValues !== nextData && !isEqual(this.localInitialValues, nextData)) {
        console.error('__onFormDataReceive4', this.utils.$$$key, cloneDeep(nextData), this.computedInitialValues)
        const { utils } = this
        this.form = utils.formInit(nextData, this, true)
        this.localInitialValues = cloneDeep(nextData)
        // this.$emit('formData:update', updatedFormData)
        this.form.resetFields()
        // debugger
      }
      this._lastReceiveFormData = nextData
      // else if (this.localInitialValues === nextData) {
      //   this.utils.formDataUpdate(nextData)
      // }
    }
  }

  /**
   *
   * @param formData
   * @internal
   */
  @Watch('formData', { immediate: true })
  public __onFormDataReceive(formData: OutputForm = this.submitData) {
    this.nextFormDataReceive(formData)
  }


}

export default CommonFormBaseMixins
