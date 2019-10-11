import { IKeyValueMap } from '@/components/CommonDataView/createTablePage';
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IButtonProps, ThemeButton } from '../ThemeButton';
import { DefaultActionMap } from './component';
import { IActionConfig } from './interface';

type PickedButtonProps<T extends keyof IButtonProps> = Pick<IButtonProps, Exclude<keyof IButtonProps, T>>;
type ActionConfig = (string | IActionConfig)[] | IKeyValueMap<(string | IActionConfig)>;

@Component({})
export class AutoOperationBarProps extends Vue {
  public static defaultButton = ThemeButton
  public static defaultHiddenProps = {
    style: {
      padding: 0,
      width: 0,
      opacity: 0,
      margin: 0,
      overflow: 'hidden',
      border: 0,
      'transition-duration': '0.1s'
    },
    icon: null,
    role: 'hidden',
    type: 'dashed',
    ghost: true,
    disabled: true,
    collapse: true
  };

  /**
   * action配置数组
   * @model
   */
  @Prop({ type: [Array, String, Object], required: true })
  actions: ActionConfig;


  /**
   * 指定默认使用的按钮组件
   * @default ThemeButton
   */
  @Prop({ type: null, default: () => AutoOperationBarProps.defaultButton })
  public component?: VueComponent<IButtonProps>;

  /**
   * 全体按钮禁用
   */
  @Prop({ type: Boolean, default: false })
  public disabled?: boolean;

  /**
   * 指定主要按钮（使用action.name or action.type）
   * @default null
   */
  @Prop({ type: [String, Array], default: null })
  public primary?: string | string[];

  /**
   * 指定默认按钮组件的默认props
   * @default {}
   */
  @Prop({ type: null, default: () => ({}) })
  defaultProps?: PickedButtonProps<'loading'>;

  /**
   * 指定默认按钮Loading状态下的默认props
   * @default {}
   */
  @Prop({ type: null, default: () => ({}) })
  defaultLoadingProps?: PickedButtonProps<'loading'>;

  /**
   * 指定内置按钮类型的事件句柄
   * @default {}
   */
  @Prop({ type: null, default: () => ({}) })
  defaultActionHandler?: {
    [K in keyof typeof DefaultActionMap]?: () => void | Promise<any>;
  };

  /**
   * 指定针对异步事件是否可以取消
   * @default true
   */
  @Prop({ type: Boolean, default: true })
  allowCancel?: boolean;

  /**
   * 默认按钮对齐（默认为right）
   * @default "right"
   */
  @Prop({ type: String, default: 'right' })
  align?: 'left' | 'center' | 'right';

  /**
   * 采用flex布局，这将无视align属性
   * @default false
   */
  @Prop({ type: Boolean, default: false })
  flex?: boolean;

  /**
   * 隐藏按钮使用的props
   * @default IAutoOperationBarProps.defaultHiddenProps
   */
  @Prop({
    type: null, default: () => AutoOperationBarProps.defaultHiddenProps
  })
  hiddenProps?: PickedButtonProps<'loading'>;

  /**
   * 是否在异步事件中隐藏loading状态以外的按钮（不包括超时自动展示的取消按钮）
   * @default true
   */
  @Prop({ type: [Boolean, Array], default: true })
  hiddenInSpinning?: boolean | string[];

}

console.log(AutoOperationBarProps)

export default AutoOperationBarProps;
