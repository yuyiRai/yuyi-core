import { isNaN, isNumber } from '@yuyi/utils';
import { Input, Progress } from 'ant-design-vue';
import { isString, get } from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { VCProps } from '../CommonFormBase';
const { TextArea } = Input as any

@Component({})
export class ProcessTextArea extends Vue {
  $refs: {
    area: Vue & { $el: HTMLElement },
    progress: Vue & { $el: HTMLElement },
    container: HTMLElement
  }

  @Prop({ type: [Number, Array], default: () => 0 })
  length: number | number[];
  @Prop({ type: null })
  value: string;
  @Prop({ type: Function })
  getNormalizeValue?: (v: any) => string;
  @Prop({ type: String, default: 'change' })
  eventName?: string;
  @Prop({ type: Boolean, default: false })
  disalowLonger?: boolean;
  @Prop({ type: Boolean, default: true })
  useProgress?: boolean;

  /**
   * 输入组件
   * @type {Object}
   */
  @Prop({ type: null, default: () => TextArea })
  component: any;

  /**
   * 输入组件的Props
   * @type {Object}
   */
  @Prop({ type: null, default: () => ({}) })
  componentProps: Object;
  /**
   * 进度条Props
   * @type {VCProps<Progress>}
   */
  @Prop({ type: null, default: () => ({}) })
  progressProps: Object;

  protected get isEnableProgress() {
    return this.useProgress && (this.minLength > 0 || this.useMaxLength)
  }

  protected emitValue(value: string) {
    if (this._lastValue !== value) {
      this._lastValue = value
      this.$emit(this.eventName, value)
    }
  }
  protected _watchError: Function;
  @Watch('value', { immediate: true })
  protected _onValueReceive(value: string) {
    if (this._watchError) {
      this._watchError()
    }
    if (this.currentValue !== value) {
      this.currentValue = value
    }
    this._watchError = this.$watch(() => this.isError, (error, last) => {
      if (error !== last) {
        this.emitValue(this.currentValue)
      }
    }, { immediate: true })
  }

  protected get minLength() {
    return Array.isArray(this.length) ? this.length[0] : this.length
  }
  protected get maxLength() {
    return Array.isArray(this.length) ? this.length[1] : Infinity
  }


  protected _container: HTMLElement;
  protected updated() {
    const container = this.$refs.container
    if (container && container.parentElement && this.$refs.area && this.$refs.progress) {
      const parent = container.parentElement || container
      if (parent !== container) {
        parent.appendChild(this.$refs.area.$el)
        parent.appendChild(this.$refs.progress.$el)
        parent.removeChild(container)
      }
      this._container = parent
      // console.log(parent)
    }
  }
  protected beforeDestroy() {
    console.error('area beforeDestroy', this)
  }

  protected _lastValue: any;
  protected currentValue: any = '';

  protected hoverProcess = false
  protected focusProcess = false

  protected get showProgress() {
    return this.hoverProcess || this.focusProcess
  }
  protected get nativeOn() {
    return {
      mouseover: (e) => {
        this.hoverProcess = true
        // console.log('in', e)
      },
      mouseout: (e) => {
        this.hoverProcess = false
        // console.log('out', e)
      }
    }
  }
  protected get on() {
    return {
      ...this.$listeners,
      [this.eventName]: (e: any) => {
        console.log(this.eventName)
        const eventValue = get(e, 'target.value', e)
        if (!this.useMaxLength || !this.disalowLonger || this.getSafeValue(eventValue).length <= this.maxLength) {
          this.currentValue = eventValue
        }
        // console.error(eventValue, this.getSafeValue(eventValue).length < this.maxLength)
        // this._lastValue = e.target.value
      },
      focus: () => this.focusProcess = true,
      blur: (e) => {
        this.$emit('blur', e)
        const value = get(e, 'target.value', e)
        this.focusProcess = false
        this.emitValue(value)
      }
    }
  }
  protected get style() {
    const containerHeight = this._container && this._container && this._container.offsetHeight
    const areaHeight = this.$refs.area && this.$refs.area.$el.offsetHeight
    const top = areaHeight - containerHeight
    // console.log(containerHeight, areaHeight, top)
    return {
      marginTop: '-10px',
      position: 'absolute',
      left: '1px',
      top: (this.showProgress && isNumber(top) ? -top : 0) + 'px',
      // bottom: this.hoverProcess ? '-19px' : '-9px',
      opacity: this.showProgress ? 1 : 0,
      width: 'calc(100% + 29px) !important',
      pointerEvents: 'none',
      transition: 'all 0.5s'
    }
  }

  protected getSafeValue(value: any) {
    return isString(value) ? value : ''
  }
  protected get safeValue() {
    const v = this.getNormalizeValue ? this.getNormalizeValue(this.currentValue) : this.currentValue
    return this.getSafeValue(v)
  }

  protected get currentPercent() {
    // debugger
    const native = this.safeValue.length / this.minLength * 100
    // console.log(this.safeValue.length / this.minLength)
    return isNaN(native) ? 0 : native;
  }
  protected get percent() {
    return Math.min(this.currentPercent, 100);
  }

  protected get isSuccess() {
    const currentLength = this.safeValue.length;
    const { minLength, maxLength } = this
    return currentLength >= minLength && (!this.useMaxLength || (this.useMaxLength && currentLength <= maxLength))
  }

  protected get isError() {
    return !this.isSuccess || this.safeValue.length < this.minLength
  }

  // @Watch('isError')
  // onIsErrorStateChange() {
  //   console.log('isError', this.isError)
  // }

  protected get successPercent() {
    // 比最小长度长，超过最大长度的话一样不展示
    return this.isHigher && !this.isError ? (
      (this.useMaxLength  // 使用最大长度
        ? this.safeValue.length / this.maxLength
        : this.minLength / this.safeValue.length) * 100
    ) : 0
  }

  protected min2MixColor(percent: number) {
    // 245, 255, 103 //yellow
    // 82, 196, 26 //green
    // 245, 34, 45 //red
    percent = percent > 1 ? percent / 100 : percent
    return `rgb(${
      82 + (245 - 82) * percent
      }, ${
      196 + (255 - 196) * percent
      }, ${
      26 + (103 - 26) * percent
      })`
  }
  protected zero2minColor(percent: number) {
    percent = percent > 1 ? percent / 100 : percent
    return `rgb(${
      245 - (245 - 82) * percent
      }, ${
      34 + (196 - 34) * percent
      }, ${
      45 - (45 - 26) * percent
      })`
  }
  protected get color() {
    if (this.currentPercent <= 100) {
      return this.zero2minColor(this.percent)
    }
    return this.useMaxLength && this.isSuccess
      ? this.min2MixColor(this.successPercent)
      : undefined
  }

  protected get isHigher() {
    return this.currentPercent > this.percent
  }

  protected get useMaxLength() {
    return this.maxLength - 1 !== this.maxLength
  }

  protected get areaData() {
    return { attrs: this.$attrs, props: this.$attrs, on: this.on, nativeOn: this.nativeOn }
  }

  protected format() {
    return `${this.safeValue.length}/${this.useMaxLength && this.isHigher ? this.maxLength : this.minLength}`
  }

  protected get localProgressProps() {
    return {
      percent: (this.useMaxLength && this.successPercent) || this.percent,
      successPercent: !this.useMaxLength ? this.successPercent : undefined,
      status: this.isError ? 'exception' : 'active',
      format: this.format,
      strokeColor: this.color,
      size: 'small',
      ...this.progressProps
    }
  }

  protected render(h) {
    const Component = this.component
    const area = <Component ref="area" value={this.currentValue} {...this.areaData} />
    return this.isEnableProgress ? (
      <span ref="container">
        {area}
        <Progress
          style={this.style}
          ref="progress"
          {...{ props: this.localProgressProps }}
        />
      </span>
    ) : area
  }
}

export default ProcessTextArea