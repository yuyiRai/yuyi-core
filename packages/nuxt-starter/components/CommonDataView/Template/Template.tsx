
/* eslint-disable */
import { AutoDescriptionList, AutoGroupRow } from '@/components';
import { IDetailFormBase, IFormItemConfig, IItemConfigGroup } from '@/components/CommonFormBase/interface';
import { Utils } from '@/components/CommonFormBase/Utils';
import { typeFilterUtils, castComputed } from '@yuyi/utils';
import { Form } from 'ant-design-vue';
import { cloneDeep, get, memoize, merge, set } from 'lodash';
import { mixins } from 'vue-class-component';
import { Component, Watch } from 'vue-property-decorator';
import AutoOperationBarInjectMixins from '../../CommonButton/AutoOperationBar/InjectMixins';
import CommonFormPropsAndEvent from '../../CommonFormBase/PropsAndEvents';
import { IterableConfigGroup, IUtils } from '../../CommonFormBase/StaticUtils';
import { trueOrArrayProps } from '../../_util/castProps';
import FormChildrenMixins from '../FormChildrenMixins';
import { useReadonly } from '../pipe/useReadonly';
import TemplateProps from './TemplateProps';


export interface ISubmitForm<T = any> {
  handleSubmit(validate?: boolean, onError?: (e: Error) => any): Promise<T>
  clearValidate?(fields?: string[]): Promise<void>
}

export interface IForm<T = any> extends ISubmitForm<T>, IDetailFormBase {
}

const readOnly = useReadonly()
@Component({
  components: {
    AutoDescriptionList,
    AutoGroupRow
  },
  provide() {
    return {
      CFormState: this.utils
    }
  }
})
export class Template extends mixins(CommonFormPropsAndEvent, AutoOperationBarInjectMixins, FormChildrenMixins, TemplateProps) {
  public itemConfig: IterableConfigGroup;
  [key: string]: any;
  public utils: Utils;
  public localDescriptionList: {
    title?: string;
    termMap?: {
      [key: string]: string
    }
  };

  @Watch('spinningActionMap', { deep: true })
  onSpinningActionMapChanged() {
    // console.log('this.spinningAction', this.spinningAction)
    if (this.spinningAction.length === 0) {
      this.setActionSpinningThreshold(4)
    }
  }

  get useOperation() {
    return this.operation || this.itemConfig.operation
  }

  get isHasFeedback() {
    return this.hasFeedback || (this.fromGroup && this.fromGroup.value.hasFeedback)
  }
  get isDisabledList() {
    const { disabled } = this;
    return trueOrArrayProps(disabled, this.utils.codeList)
  }

  public getItemInputProps(item: IFormItemConfig) {
    const base = this.utils.getItemInputProps(item)
    base.disabled = this.getIsDisabled(item, base.disabled)
    if (this.isReadOnly) {
      base.placeholder = item.readonlyPlaceholder
    }
    return base
  }

  public getItemContainerProps(item: IFormItemConfig) {
    const base = { ...item.containerProps }
    base.label = this.getItemLabelNative(item) ? item.label : undefined
    if (this.utils.isOptionsLoading(item)) {
      base.validateStatus = "validating"
    }
    return base
  }

  public getIsDisabled(item: IFormItemConfig, defaultValue: boolean) {
    // console.log(this.isDisabledList, this.disabled)
    if (this.isDisabledList.length > 0 && this.isDisabledList.includes(item.code)) {
      return true
    }
    return this.castComputed(item, 'disabled', defaultValue)
  }

  public castComputed(item: IFormItemConfig, field: 'display' | 'disabled', defaultValue: any = undefined) {
    const target = item[field];
    return item.code && item[field] ? castComputed(target, get(this.utils.localFormData, item.code), this.utils.localFormData, this.fromGroup.value, this.utils) : defaultValue
  };

  get description() {
    return this.descriptionList || this.localDescriptionList
  }

  protected getReadonlyComponent = memoize((baseConfig: IFormItemConfig, utils: IUtils) => {
    const readonlyConfig = cloneDeep(baseConfig)
    merge(readonlyConfig, readOnly(readonlyConfig, utils))
    set(readonlyConfig, 'inputProps.placeholder', '-')
    return readonlyConfig
  }, config => config);

  public updateDisplayConfig(readonly = this.isReadOnly) {
    // this.getReadonlyComponent.cache.clear()
    this.displayItemConfigBase = Utils.mapConfigGroup(this.itemConfig, (config, index, key) => {
      config = cloneDeep(config)
      config.container = this.utils.getItemContainer(config, this.formItemContainerDefault)
      config.containerProps = merge({},
        config.containerProps,
        config.container
      )
      // console.log(config, config.containerProps, config.container)
      config.containerProps.hasFeedback = config.containerProps.hasFeedback !== false ? (!readonly && this.isHasFeedback) : false
      if (readonly) {
        // console.log(this.utils.getOptions)
        merge(config, readOnly(config, this.utils.getGlobalConfig()))
        set(config, 'inputProps.placeholder', ' ')
      }
      return config
    })
    console.log('displayItemConfigBase', this.displayItemConfigBase)
  }

  displayItemConfigBase: IItemConfigGroup = {};

  async created() {
    this.getReadonlyComponent.cache = new WeakMap()
  }

  getItemLabelNative(item: IFormItemConfig) {
    return this.isReadOnly || (item.type && item.type.includes('readonly'))
  }

  get configDisplayMap() {
    return Utils.filterConfigGroup(this.displayItemConfigBase, item => {
      return this.castComputed(item, 'display', true)
    })
  }

  get configHiddenList() {
    const hiddenList: IFormItemConfig[] = []
    Utils.forEachConfigGroup(this.displayItemConfigBase, item => {
      if (!this.castComputed(item, 'display', true)) hiddenList.push(item)
    })
    return hiddenList
  }

  @Watch('configHiddenList')
  onHiddenMapUpdate(newValue = [], old = []) {
    // const type = newValue.length > old.length ? 'hidden' : 'display'
    // const [hidden, re] = type === 'display' ? [old, newValue] : [newValue, old]
    // const diff = difference(hidden, re)
    // console.log('configHiddenList', type, diff.map(c => c.code))
    // if (diff.length > 0) {
    //   this.displayItemConfigBase = { ...this.displayItemConfigBase }
    // }
  }

  configConfirm = {
    display: this.configDisplayMap,
    hidden: this.configHiddenList
  }

  protected defaultContainerComponent = Form.Item

  public get formItemContainerDefault() {
    return merge(
      this.utils.formItemContainerDefault,
      this.isReadOnly ? {
        colon: true
      } : {},
      this.itemContainer
    )
  }

  public get itemGroupKeys() {
    return Object.keys(this.configDisplayMap)
  }

  /**
   * （校验并）提交表单
   * @param validate 是否校验
   * @param onError 错误时的回调，传入函数时不会抛出异常
   * @return Promise<submitData>
   * @async
   * @public
   */
  public async handleSubmit(validate = true, onError?: (e: Error) => any) {
    try {
      if (validate) {
        const value = await this.validate();
        console.log('handleSubmit', this.utils.submitData, value);
      }
      await this.clearValidate()
      return this.utils.submitData;
    } catch (e) {
      // debugger
      if (!(e instanceof Error)) {
        const messageList: string[] = []
        for (const [code, errors] of Utils.getErrorIterator(e.errors)) {
          const config = this.utils.codeConfigMap.get(code)
          for (const error of errors) {
            messageList.push(`[${config.label}]${error.message}`)
          }
        }
        console.error(e.errors, messageList.join('\n'), this.form)
        e = new Error(messageList.length > 0 ? messageList.join('\n') : '校验错误')
      }

      if (onError instanceof Function) {
        return onError(e);
      }
      throw e;
    }
  }
  // protected uuid = uuid()

}

export default Template
