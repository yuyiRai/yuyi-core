import { debounce } from 'lodash'
import { createBEM } from '@/components/_util/bem';
import './NoticeBar.less'
import { createTsxComponent, convertTsxComponent, mixinTsxComponent } from '@/utils/CommonUtils/createTsxComponent';
import { SlotsMixin } from '@/components/CommonMixins';

const bem = createBEM('aml-notice-bar');

export const TextRollMatcher = createTsxComponent({
  props: {
    text: String,
    mode: String,
    color: String,
    leftIcon: String,
    wrapable: Boolean,
    background: String,
    width: {
      type: [Number],
      default: 0
    },
    delay: {
      type: [Number, String],
      default: 1
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 50
    },
    autoHidden: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      wrapWidth: 0,
      // 首次滚动
      firstRound: true,
      lastNeedRoll: null,
      duration: 0,
      status: 'stop',
      offsetWidth: 0,
      preOffsetLeft: 0,
      // offsetTemp: [],
      useEllipsis: false,
      animationClass: ''
    };
  },

  watch: {
    text: {
      handler() {
        this.$nextTick(() => {
          this.init()
        });
      }
    }
  },
  mounted() {
    // console.error('notice-bar.mounted')
    this.init()
    window.addEventListener('resize', this.init)
  },
  beforeDestroy() {
    // console.error('notice-bar.destroy')
    window.removeEventListener('resize', this.init)
  },
  methods: {
    startRoll(wrapWidth: number, offsetWidth: number) {
      if (this.anmWillStarted) {
        clearTimeout(this.anmWillStarted)
      }
      this.wrapWidth = wrapWidth;
      this.offsetWidth = offsetWidth;
      this.duration = offsetWidth / this.speed;
      this.animationClass = bem('play');
      this.firstRound = true
      this.status = 'needRoll'
      this.useEllipsis = true
      this.anmWillStarted = setTimeout(() => {
        this.status = 'rolling'
        this.useEllipsis = false
      }, this.delay * 1000);
    },
    stop() {
      Object.assign(this.$data, {
        wrapWidth: 0,
        firstRound: true,
        duration: 0,
        offsetWidth: 0,
        animationClass: ''
      })
      this.useEllipsis = this.status === 'needRoll'
      // this.offsetTemp[1] = this.$refs.content.getBoundingClientRect().x
      // this.preOffsetLeft = (this.offsetTemp[1] - this.offsetTemp[0]) + this.contentPadding
      // console.error(this.offsetTemp, this.preOffsetLeft)
    },
    stopRoll(wrapWidth: number = this.wrapWidth, offsetWidth: number = this.offsetWidth) {
      if (this.anmWillStarted) {
        clearTimeout(this.anmWillStarted)
      }
      this.status = this.scrollable && this.isNeedRoll(wrapWidth, offsetWidth) ? 'needRoll' : 'stop'
      // console.log('stopRoll', this.firstRound, wrapWidth, offsetWidth, this.status)
      this.stop()
    },
    isNeedRoll(wrapWidth: number, offsetWidth: number, contentPadding: number = this.contentPadding) {
      const lastNeedRoll = wrapWidth > 0 && wrapWidth > 0 && (offsetWidth - contentPadding) + 2 > wrapWidth
      this.lastNeedRoll = lastNeedRoll
      return lastNeedRoll
    },
    init() {
      this.lastNeedRoll = null
      if (this.anmWillStarted) {
        clearTimeout(this.anmWillStarted)
      }
      // console.error('notice-bar.init')
      const { wrap, content } = this.$refs;
      if (!wrap || !content) {
        return;
      }
      const wrapWidth = this.width || wrap.getBoundingClientRect().width;
      const offsetWidth = content.getBoundingClientRect().width;
      const contentPadding = parseInt(content.style.paddingLeft)
      this.contentPadding = contentPadding
      if (this.scrollable && this.isNeedRoll(wrapWidth, offsetWidth, contentPadding)) {
        // console.error('continue', offsetWidth, wrapWidth, this.$refs, this.$el)
        // this.offsetTemp[0] = content.getBoundingClientRect().x + this.contentPadding
        this.startRoll(wrapWidth, offsetWidth)
      } else {
        this.stopRoll(wrapWidth, offsetWidth)
      }
    },
    onAnimationEnd(e) {
      this.firstRound = false;
      this.preOffsetLeft = 0
      this.$nextTick(() => {
        this.duration = (this.offsetWidth + this.wrapWidth) / this.speed;
        this.animationClass = bem('play--infinite');
      });
    },
    LeftIcon() {
      const replaceSlot = this.status !== 'stop' && this.slots('left-icon-rolling');
      if (replaceSlot) {
        return replaceSlot;
      }
      const slot = this.slots('left-icon');
      if (slot) {
        return slot;
      }
      return false;
    },
    RightIcon() {
      const replaceSlot = this.status !== 'stop' && this.slots('right-icon-rolling');
      if (replaceSlot) {
        return replaceSlot;
      }
      const slot = this.slots('right-icon');
      if (slot) {
        return slot;
      }
      // const iconName = mode === 'closeable' ? 'cross' : mode === 'link' ? 'arrow' : '';
      // if (iconName) {
      //   return <Icon class={bem('right-icon')} name={iconName} onClick={onClickIcon} />;
      // }
      return false;
    }
  },

  render() {
    if (this.autoHidden && this.lastNeedRoll === false) {
      return <span>{this.slots() || this.text}</span>
    }
    const { slots, mode, leftIcon, onClickIcon } = this;

    const barStyle = {
      color: this.color,
      background: this.background
    };

    const rollContentSlot = this.slots('rolling')

    const contentStyle = {
      paddingLeft: this.firstRound ? 0 : this.wrapWidth + 'px',
      animationDelay: (this.firstRound ? this.delay : 0) + 's',
      animationDuration: this.duration + 's'
    };


    return (
      <div
        role="alert"
        class={bem({ wrapable: this.wrapable })}
        style={barStyle}
        onClick={event => {
          this.$emit('click', event);
        }}
        onMouseenter={() => this.$refs.content.style.animationPlayState = 'paused'}
        onMouseleave={() => this.$refs.content.style.animationPlayState = 'running'}
      >
        {this.LeftIcon()}
        <div ref="wrap" class={bem('wrap')} role="marquee">
          <div
            ref="content"
            class={[
              bem('content'),
              this.animationClass,
              { 'aml-ellipsis': this.useEllipsis || !this.scrollable && !this.wrapable },
              { rolling: this.status === 'rolling' }
            ]}
            style={contentStyle}
            onAnimationend={this.onAnimationEnd}
          >
            {this.status !== 'stop' && rollContentSlot ? rollContentSlot : this.slots() || this.text}
          </div>
        </div>
        {this.RightIcon()}
      </div>
    );
  }
}).mixin(convertTsxComponent(SlotsMixin));
export default TextRollMatcher
