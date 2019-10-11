import { convertKeys2ValuesMap } from '@/utils/CommonUtils';
import { castArray, defaults, delay, forEach, isObject, merge } from 'lodash';
import { mixins } from 'vue-class-component';
import { Component, Watch } from 'vue-property-decorator';
import CommonSpinningMixin from '../../CommonMixins/CommonSpinningMixin';
import { convertArrayProps } from '../../_util/castProps';
import { getConfirmContainerComponent } from '../createConfirmButton';
import { IButtonProps } from '../ThemeButton';
import ActionNameListFilter from './filter';
import { ActionType, IActionConfig } from './interface';
import AutoOperationBarProps from './Props';
import ChildrenMixins from '../../CommonMixins/ChildrenMixins';


export const DefaultActionMap = convertKeys2ValuesMap(ActionType as typeof ActionType & Record<string, ActionType>)
// console.log((ActionNameListFilter as any).options)
forEach(DefaultActionMap, (v, k) => {
  if (/\$$/.test(v)) {
    DefaultActionMap[k] = v.replace(/\$$/, '')
  }
})
// console.log('DefaultActionMap', DefaultActionMap)

export function isDefaultActionType(type: string): type is ActionType {
  return !!DefaultActionMap[type]
}

/**
 * 取得按钮的展示文字
 * @param action 按钮动作配置
 * @param useTypeOverwrite 是否优先根据按钮类型
 */
export function getActionTitle(action: IActionConfig, useTypeOverwrite = false): string {
  if (useTypeOverwrite && action.type !== 'custom') {
    return DefaultActionMap[action.type] || action.title || action.name
  }
  return action.title ? action.title : (
    action.type === ActionType.自定义 ? action.name : DefaultActionMap[action.type]
  )
}


// export type A = keyof AntProps<InstanceType<typeof actionNameListFilter>>;

/**
 * 封装过的操作按钮栏，包含异步操作等待时隐藏其它按钮、展示loading等实用功能
 */
@Component({
  name: 'AutoOperationBar'
})
export class AutoOperationBar extends mixins(ChildrenMixins, ActionNameListFilter, AutoOperationBarProps, CommonSpinningMixin) {

  get actionList() {
    const r = convertArrayProps(this.actions, (value, key) => {
      return this.convertAction(key && value ? {
        title: value,
        name: key
      } : value);
    }, 1)
    // console.error('actionList', r)
    return r
  }


  get localPrimaryConfig() {
    return castArray(this.primary)
  }

  convertAction(a: any): IActionConfig {
    const aa = this.getActionBase(a)
    if (aa) {
      aa.render = this.getRender(aa)
    }
    return aa
  }
  get actionNameList() {
    return this.actionList.map(a => a.name)
  }

  public getComponent(action: IActionConfig<any>) {
    return action.component || this.component
  }
  public getRender(action: IActionConfig): IActionConfig['render'] {
    return action.render || (action.component ? (h: any, $emit, injectProps?: any) => {
      const { component: Button, props, confirm, type } = action
      const style = injectProps.style ? defaults(injectProps.style, action.style) : action.style
      const Confirm = confirm && getConfirmContainerComponent(confirm === true ? type : confirm.title)
      const onClick = async () => {
        const ref = (this.$refs[`confirm_${action.name}`] as any)
        try {
          ref && ref.setVisible(true);
          await onClick.event();
          ref && ref.setVisible(false);
        } catch (error) {
          ref && ref.setVisible(true);
          // debugger
        }
      }
      onClick.event = this.getActionEvent(action, $emit)
      const buttonProps: IButtonProps = merge(
        {}, this.defaultProps, props, injectProps,
        this.disabled ? { disabled: true } : {}
      )
      const btn = (
        <Button
          key={action.name}
          onClick={!Confirm && onClick}
          style={{
            ...style,
            ...action.float ? {
              // position: 'absolute', top: '4px', [action.float]: 0
              float: action.float
            } : {}
          }}
          class={injectProps.className}
          role={injectProps.role}
          {...{ props: buttonProps }}>{
            injectProps && injectProps.text || getActionTitle(action)
          }</Button>
      )
      return Confirm ? <Confirm loading={buttonProps.loading} disabled={buttonProps.disabled} ref={`confirm_${action.name}`}  {...{ props: (confirm as any).props }} onClick={onClick}>{btn}</Confirm> : btn
    } : (() => false) as any);
  }

  public isHandlerAction(action: IActionConfig): action is IActionConfig<ActionType, 'handler'> {
    return action.actionType === 'handler'
  }

  public getActionEvent<T extends 'handler' | 'event'>(action: IActionConfig<ActionType, T>, $emit = this.$emit) {
    const { name, actionType } = action
    if (this.isHandlerAction(action)) {
      // 事件句柄直接返回
      return () => {
        const act = action.action()
        const isDelay = act instanceof Promise
        if (isDelay) {
          this.spinningStart(name)
          return Promise.race([
            Promise.all([
              act,
              this.$autils.waiting(300)
            ]),
            this.waitingCancel()
          ]).catch(e => {
            console.error(e)
            throw e
          }).finally(() => {
            this.spinningEnd(name);
          })
        }
      }
    } else if (name) {
      // 事件传递，传递name对应的事件，并将action作为参数\
      action
      return async () => this.handleEmitAction(action as IActionConfig<ActionType, 'event'>)
    }
  }

  /**
   * 传递action事件
   */
  public handleEmitAction?({ name, action }: IActionConfig<ActionType, 'event'>) {
    console.error('call', name)
    // const handler = this.$listeners[name] as any
    const args = castArray(action)
    this._handleEmitOneAction(name, args)
    this._handleEmitAllAction(name, args)
  }


  private _handleEmitOneAction(name: string, args: any[]) {
    /**
     * 当action不为函数，点击按钮时传递[(action.)name]事件，参数为config中的action（数组的情况会展开）
     * @event [action.name]
     * @type {any}
     */
    this.$emit(name, ...args)
  }

  private _handleEmitAllAction(name: string, args: any[]) {
    /**
     * 也提供了用于集中处理的action事件，第一个参数为action名，之后同上
     * @event action
     * @type {string, ...any[]}
     */
    this.$emit("action", name, ...args)
  }

  public getActionHandler(config: IActionConfig<ActionType>): undefined | (() => void | Promise<any>) {
    const { action, type = config.name } = config;
    return (action instanceof Function && action) || (
      this.defaultActionHandler && this.defaultActionHandler[type] && this.defaultActionHandler[type].bind(this, ...castArray(action))
    ) || undefined
  }

  /**
   * 取得名称，无则依次使用函数名/action类型作为名称
   * @param name 
   * @param type 
   * @param action 
   */
  public getActionName(name: IActionConfig['name'], type: IActionConfig['type'], action?: IActionConfig['action']): string {
    return name || (action && (action as any).name || type || ActionType.自定义)
  }

  /**
   * 无指定类型时使用name推断，无法推断时则为自定义
   * @param type 
   * @param name 
   */
  public getActionType(type: IActionConfig['type'], name: IActionConfig['name']): ActionType {
    return type || isDefaultActionType(name) && name || ActionType.自定义
  }

  public getActionBase(config: string | IActionConfig<ActionType>): IActionConfig<ActionType, any> {
    if (typeof config === 'string') {
      return {
        type: (isDefaultActionType(config) ? config : ActionType.自定义), // 推断是否可能为默认类型
        name: config, // 作为名称
        component: this.component,
        actionType: 'event' // 类型为事件
      }
    } else if (isObject(config)) {
      const { name, type } = config
      const actionHandler = this.getActionHandler(config); // action是否配置为函数
      return {
        ...config,
        action: actionHandler,
        name: this.getActionName(name, type, actionHandler),
        type: this.getActionType(type, name),
        component: this.getComponent(config),
        actionType: actionHandler ? 'handler' : 'event'
      }
    }
    return null
  }
  created() {
    this.$emit = this.$emit.bind(this)
  }

  get localDisplayActionList(): IActionConfig<ActionType, any>[] {
    const r = []
    for (const a of this.actionList) {
      if (this.localDisplayMap[a.name]) {
        r.push(a)
      }
    }
    return r
  }

  /** 取得按钮展示的类型Prop */
  getButtonType(action: IActionConfig): any {
    const nativeType = action.props && action.props.type
    return !nativeType && (
      this.localPrimaryConfig.includes(action.name)
      || this.localPrimaryConfig.includes(action.type)
      || this.isActionSpinning(action.name)
    ) && 'primary' || nativeType
  }

  spinningWhiteList = [ActionType.取消$]

  get actionCancelBtn() {
    return this.allowCancel && this.convertAction({
      type: ActionType.取消$,
      name: ActionType.取消$
    }) || false
  }

  showActionCancel = false

  __cancelConfirmDelay: number;
  __cancelPromise: Promise<any>;

  waitingCancel() {
    if (!this.__cancelPromise) {
      this.__cancelPromise = new Promise(resolve => {
        // console.log('waitingCancel')
        this.$once(ActionType.取消$, () => {
          // console.log('waitingCancel')
          resolve()
          this.__cancelPromise = null
        })
      })
    }
    return this.__cancelPromise
  }

  @Watch('actionSpinning')
  onActionSpinningChange(spinning: any) {
    clearTimeout(this.__cancelConfirmDelay)
    this.__cancelConfirmDelay = delay((allow: boolean) => {
      this.showActionCancel = allow
    }, spinning ? 2000 : 0, spinning)
  }

  getAppendProps<T extends ActionType>(a: IActionConfig<T>) {
    if ((!this.actionSpinning && a.type !== ActionType.取消$) || (this.showActionCancel && this.actionSpinning && a.type === ActionType.取消$)) {
      return { type: this.getButtonType(a) }
    } else if (this.isActionSpinning(a.name)) {
      // console.error('display', a.title, this.isSpinning, cloneDeep(this.spinningActionMap))
      return {
        loading: this.isActionSpinning(a.name),
        type: this.getButtonType(a),
        ghost: (!a.props || a.props.type !== 'primary'),
        text: getActionTitle(a, true) + '中...',
        ...this.defaultLoadingProps
      }
    } else {
      // console.error('hidden', a.title, this.isSpinning, cloneDeep(this.spinningActionMap))
      return a.hiddenProps || this.hiddenProps
    }
  }

  get renderer() {
    const action = [...this.localDisplayActionList]
    const r = []
    if (this.actionCancelBtn) {
      action[this.align !== 'left' ? 'unshift' : 'push'](this.actionCancelBtn)
    }
    // console.error(this.isSpinning, cloneDeep(this.spinningActionMap), this.actionCancelBtn)
    for (const a of action) {
      const props = Object.assign({}, this.getAppendProps(a))
      r.push(a.render(this.$createElement, this.$emit, props))
    }
    return r
  }
  /**
   * @public
   * @type {slot} default | content
   * @example
   */
  render() {
    const content = this.getSpinningContentSlot('content')
    // console.log('children', this.children)
    const bar = (
      <div class={["operation-bar", this.flex && "flex"]} style={{ textAlign: this.align }}>
        {this.renderer}
        {this.getSpinningContentSlot('default')}
      </div >
    )
    return content ? <div>{content}{bar}</div> : bar
  }
  getSpinningContentSlot(name: string) {
    return this.$slots[name] && this.$slots[name].length > 0 && <a-spin spinning={this.isSpinning}>
      {
        /** @slot Use this slot to have a header */
        this.$slots[name]
      }
    </a-spin>
  }
}

export default AutoOperationBar