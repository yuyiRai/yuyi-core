import { Component, Vue, Prop } from 'vue-property-decorator'

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

@Component({
  name: 'CountDown',
  props: {
    format: {
      type: Function,
      default: undefined
    },
    target: {
      type: [Date, Number],
      required: true
    },
    onEnd: {
      type: Function,
      default: () => ({})
    }
  }
})
export class CountDown extends Vue {
  dateTime = '0'
  originTargetTime = 0
  lastTime = 0
  timer = 0
  interval = 1000

  render(h) {
    return <span>{this.formatHandler(this.lastTime)}</span>
  }

  @Prop({ type: Function }) format;
  @Prop({
    type: [Date, Number],
    required: true
  }) target;
  @Prop({
    type: Function,
    default: () => ({})
  }) onEnd;

  formatHandler(time) {
    if (this.format) {
      return this.format(time)
    }
    const hours = 60 * 60 * 1000
    const minutes = 60 * 1000

    const h = Math.floor(time / hours)
    const m = Math.floor((time - h * hours) / minutes)
    const s = Math.floor((time - h * hours - m * minutes) / 1000)
    return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`
  }

  created() {
    this.initTime()
    this.tick()
  }

  initTime() {
    let lastTime = 0
    let targetTime = 0
    this.originTargetTime = this.target
    try {
      if (Object.prototype.toString.call(this.target) === '[object Date]') {
        targetTime = this.target
      } else {
        targetTime = new Date(this.target).getTime()
      }
    } catch (e) {
      throw new Error('invalid target prop')
    }
    lastTime = targetTime - new Date().getTime()
    this.lastTime = lastTime < 0 ? 0 : lastTime
  }

  tick() {
    const { onEnd } = this
    this.timer = setTimeout(() => {
      if (this.lastTime < this.interval) {
        clearTimeout(this.timer)
        this.lastTime = 0
        if (typeof onEnd === 'function') {
          onEnd()
        }
      } else {
        this.lastTime -= this.interval
        this.tick()
      }
    }, this.interval)
  }

  beforeUpdate() {
    if (this.originTargetTime !== this.target) {
      this.initTime()
    }
  }

  beforeDestroy() {
    clearTimeout(this.timer)
  }
}

export default CountDown
