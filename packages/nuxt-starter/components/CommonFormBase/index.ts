import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { VueConstructor } from 'vue';
import { VueClass } from 'vue-class-component/lib/declarations';
import { Component, Mixins } from 'vue-property-decorator';
import AutoDescriptionList from '../CommonDataView/components/Containers/AutoDescriptionList';
import AutoGroupRow from '../CommonDataView/components/Containers/AutoGroupRow';
import { CommonFormBaseMixins } from './CommonFormBaseMixins';
import { IAppendGroupPipeGroup, IItemConfigGroup } from './interface';
import { ICommonFormBaseProps } from './Props';
import { Utils } from './Utils';


export interface ICommonFormInstance<InputForm = any, OutputForm = any> extends CommonFormBaseMixins<InputForm, OutputForm> {
}

/**
 * @param itemConfig - 表单配置集合
 * @param initialValues - 初始值
 * @param appendConfigPipe - 追加自定义配置管道
 */
export function CommonFormBase(
  itemConfig: IItemConfigGroup,
  initialValues?: any,
  appendConfigPipe?: IAppendGroupPipeGroup
) {
  let utils: Utils = new Utils();
  @Component({
    name: 'DetailFormBase',
    components: { AutoGroupRow }
  })
  @Utils.registerConfig(itemConfig, initialValues, appendConfigPipe)
  class CommonFormMixins<InputForm = any, OutputForm = any> extends CommonFormBaseMixins<InputForm, OutputForm> {

    public static mixins<Mixin extends VueClass<any>, MixinC extends Mixin extends VueClass<infer C> ? C : Mixin>(
      mixins: Mixin
      // @ts-ignore
    ): VueConstructor<CommonFormMixins & MixinC>;

    public static mixins<
      Mixin extends VueClass<any>, MixinC extends Mixin extends VueClass<infer C> ? C : Mixin,
      Mixin2 extends VueClass<any>, Mixin2C extends Mixin2 extends VueClass<infer C> ? C : Mixin2
    >(
      mixins: Mixin, mixins2: Mixin2
    ): VueConstructor<CommonFormMixins & MixinC & Mixin2C>;

    public static mixins(...mixins: any[]) {
      return Mixins(...mixins, this) as any
    }
    public static utils = utils
  }
  return (CommonFormMixins) as VueComponent<ICommonFormBaseProps, {}, {}, typeof CommonFormMixins>
}

/**
 * @param itemConfig
 * @param initialValues
 * @param appendConfigPipe
 */
export function MixinFormBase(
  itemConfig: IItemConfigGroup,
  initialValues?: any,
  appendConfigPipe?: IAppendGroupPipeGroup
): [Utils, typeof DetailFormBase, typeof DetailFormBase] {
  const DetailFormBase = CommonFormBase(itemConfig, initialValues, appendConfigPipe)
  // @ts-ignore
  return [DetailFormBase.utils, DetailFormBase, DetailFormBase]
}

export * from './interface';
export { AutoGroupRow, AutoDescriptionList, Utils };

