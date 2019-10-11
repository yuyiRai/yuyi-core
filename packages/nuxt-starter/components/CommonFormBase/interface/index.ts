/* eslint-disable */
import { IFormGroupConfig } from '@/components/CommonDataView/createFormGroup';
import { DatePicker, Input, InputNumber, Select, Checkbox } from 'ant-design-vue';
import { FieldDecoratorOptions, WrappedFormUtils, ValidationRule } from 'ant-design-vue/types/form/form';
import { TextArea } from 'ant-design-vue/types/input/textarea';
import { RadioGroup } from 'ant-design-vue/types/radio/radio-group';
import VueC from 'vue';
import { Vue } from 'vue-property-decorator';
import { IUtils } from '../StaticUtils';
import { Utils } from '../Utils';
import { ProcessTextArea, CheckableSelect } from '../../CommonItemComponent';
import { FormItem } from 'ant-design-vue/types/form/form-item';
import { ICommonFormContainer, A } from '@yuyi/utils';
import { IAutoOperationBarProps } from '@/components/CommonButton/AutoOperationBar/interface';

export interface IColProps {
  span?: number;
  sm?: number;
  lx?: number;
  lg?: number;
  xl?: number;
}

export type ColProps = IColProps | number;

export type RequiredKeys<T, K extends keyof T | false | undefined = undefined> = K extends undefined
  ? T
  : (K extends false
    ? Partial<T>
    : {
      [Key in Exclude<keyof T, K extends false | undefined ? never : K>]+?: T[Key];
    } & {
      [Key in keyof Pick<T, K extends false | undefined ? never : K>]-?: T[Key];
    }
  )

/**
 * 截取Prop用类型
 * 第二个Type传入需要为required的Key,不传为保留原类型,传递false时全部指定不为required
 */
export type VCProps<
  T extends Vue,
  RequiredKey extends (keyof Pick<T, Exclude<keyof T, keyof Vue>>) | false | undefined = undefined
  > =
  RequiredKeys<
    RequiredKey extends undefined
    ? Pick<T, Exclude<keyof T, keyof Vue>>
    : (
      RequiredKey extends false
      ? Partial<Pick<T, Exclude<keyof T, keyof Vue>>>
      : Pick<T, Exclude<keyof T, keyof Vue>>
    ),
    RequiredKey
  >

type A = {
  A?: null;
  C?: null;
}
type B = RequiredKeys<A, 'A'>
const b: B = {
  A: null
}
export type InputProps = VCProps<Input>


export type OptionsGetter<T> = T[] | string | DynamicOptionsLoader<T>
export type RulesGetter<T> = T[] | string | DynamicOptionsLoader<T>
/**
 * 动态取得配置项
 */
export type DynamicLoader<T> = (form: any, component: Utils) => Promise<T> | T
export type DynamicOptionsLoader<T> = DynamicLoader<T[]>
export type DynamicRuleLoader = DynamicLoader<ValidationRule | ValidationRule[]>

export type InputType = typeof Input | typeof Select | typeof InputNumber
  | typeof DatePicker | typeof TextArea | typeof RadioGroup | typeof Checkbox
  | typeof ProcessTextArea | typeof CheckableSelect | unknown;
export type InputTypeAll = Input & Select & InputNumber
  & DatePicker & TextArea & RadioGroup & Checkbox
  & ProcessTextArea & CheckableSelect;

export type SafeComponentType<T, Default = typeof Input> = T extends typeof VueC ? T : Default
export type SafeComponentInstanceType<T, Default = Input> = T extends typeof VueC ? InstanceType<T> : Default

export type IInputPropsType<T extends InputType> = Partial<
  VCProps<SafeComponentInstanceType<T, InputTypeAll>>
> & {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  options?: OptionsGetter<any>;
}
export type IComponentPropsType<T extends typeof VueC> = Partial<
  Pick<InstanceType<T>, Exclude<keyof InstanceType<T>, keyof VueC>>
>


export type ComputedInputProp<TargetType> = (v?: any, form?: any, formGroup?: IFormGroupConfig, utils?: Utils) => TargetType

export type TypedInputProps<T extends InputType> = IInputPropsType<T> & {
  placeholder?: string | string[];
  [key: string]: any
}

export type OptionsPropInput<T = any> = {
  new(): {
    options: T[]
  }
}

export interface IFormItemConfig<T extends InputType = InputType, Container extends typeof VueC = typeof FormItem> {
  /**
   * 数据集中的标识
   */
  code: string;
  /**
   * 表单预设类型
   */
  type?: (string | any[])[];
  /**
   * label文本
   */
  label: string;
  /**
   * 见antd.form
   */
  itemOptions?: FieldDecoratorOptions;
  /**
   * 见antd.form
   */
  itemDecorator?: [string, FieldDecoratorOptions];
  /**
   * 使用组件
   */
  component?: undefined | T;
  /**
   * 提示文案（传入时启用label旁边的提示小图标）
   */
  hint?: string;
  rules?: (ValidationRule | string | DynamicRuleLoader)[];
  display?: boolean | ComputedInputProp<boolean>;
  required?: boolean | ComputedInputProp<boolean>;
  disabled?: boolean | ComputedInputProp<boolean>;
  inputProps?: TypedInputProps<T>;
  containerComponent?: Container;
  containerProps?: IComponentPropsType<Container>;
  container?: ICommonFormContainer;
  referenceCodes?: string[]
  // 文字插槽
  innerHTML?: string;
  col?: ColProps;
  [key: string]: any;
}

/**
 * 
 * @param options - 组件配置项
 */
export function ItemConfig<T extends InputType>(
  options: IFormItemConfig<T>
): IFormItemConfig<T> {
  return {
    ...options
  }
}
// export const iii = ItemConfig({ component: Input, label: 'code', code: 'label' })
// iii.inputProps
// // iii.inputProps

export interface IFilterFunction<InputValue = any, OutputValue = any, FormData = any> {
  (value?: InputValue, formData?: FormData): OutputValue;
  merge?: string[];
};
export type IFilter<Code extends string = any, InputValue = any, OutputValue = any> = [
  Code, IFilterFunction<OutputValue, InputValue>, IFilterFunction<InputValue, OutputValue>
]



/**
 * 管道配置函数
 */
export type AppendConfigPipeFunction<
  Params extends any[],
  T extends InputType,
  Container extends typeof VueC = typeof FormItem,
  > = (
    config: IFormItemConfig, instance: IUtils, ...args: Params
  ) => void | Partial<IFormItemConfig<T, Container>>

/**
 * 管道配置对象集合
 */
export type AppendConfigPipe<
  T extends InputType,
  Container extends typeof VueC = any,
  Params extends any[] = any[]
  > = AppendConfigPipeFunction<Params, T, Container>
  | Partial<IFormItemConfig<T, Container>>
  | string[]

export interface IItemConfigGroupKeys<T = IFormItemConfig<any>> {
  default?: T[];
  [itemConfigGroupKey: string]: T[] | undefined;
}
export type IItemConfigGroup<T = IFormItemConfig<any>> = IItemConfigGroupKeys<T> & {
  operation?: IAutoOperationBarProps;
}
export interface IAppendGroupPipeGroup {
  [appendConfigPipeKey: string]: AppendConfigPipe<InputType>;
}

export function createPipe<Params extends any[], T extends InputType, Container extends typeof VueC = typeof FormItem>(
  pipe: AppendConfigPipeFunction<Params, T, Container>
): AppendConfigPipeFunction<Params, T, Container>;
export function createPipe<T extends InputType, Container extends typeof VueC = typeof FormItem>(
  pipe: Partial<IFormItemConfig<T, Container>>
): AppendConfigPipeFunction<[], T, Container> & Partial<IFormItemConfig<T, Container>>;
export function createPipe(pipe: any) {
  return pipe;
};

export type AppendGroupPipeGroup<Keys extends string = string> = {
  [PipeKey in Keys]: AppendConfigPipe<any>;
}

export interface IDetailFormBase<T = any> extends Vue {
  /**
   * 处理表单的实用工具
   */
  utils: Utils;
  formData: T;
  form: WrappedFormUtils;
  initialValues: T;
  /**
   * 表单配置项清单
   */
  itemConfig: IItemConfigGroup;
  /**
   * 
   */
  created(): Promise<void>;
  validate(fields?: string[]): Promise<T>;
}
