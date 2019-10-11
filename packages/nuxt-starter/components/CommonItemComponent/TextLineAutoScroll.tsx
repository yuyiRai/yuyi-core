import { Prop, Vue, Component } from 'vue-property-decorator'

@Component({})
export class TextLineAutoScroll extends Vue {
  @Prop({ type: Number, default: 0 })
  autoplaySpeed: number;
  @Prop({ type: Number, default: 3000 })
  speed: number;

  @Prop({ type: Array, default: null })
  data: any[]
  @Prop({ type: String, default: 'linear' })
  easing: string

  @Prop({})

  @Prop({ type: Boolean, default: true })
  allowSelfScroll: boolean;

  get scrollData() {
    let data = this.data || this.$slots.default
    if (data.length === 1 && this.allowSelfScroll) {
      data = [data[0], data[0]]
    }
    console.error('get auto list', data)
    if (this.data && this.data.length > 0) {
      return data.map(this.$scopedSlots.default)
    }
    return data || []
  }

  render() {
    return (
      <a-carousel autoplay autoplaySpeed={this.autoplaySpeed} speed={this.speed} dots={false} cssEase={this.easing}>
        {this.scrollData}
      </a-carousel>
    )
  }
}
