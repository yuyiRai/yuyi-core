import Select from './Select.vue';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { stubArray } from '@yuyi/utils';
const NaticeSelect = Select as any
const Option = (Select as any).Option as any
@Component({
  props: { ...(Select as any).props },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  }
})
export class CheckableSelect extends Vue {

  protected checkedAll: boolean = false;
  protected checkedAllIndeterminate: boolean = false

  @Prop({ type: Array, default: stubArray })
  options: any[]
  @Prop({ type: null })
  value: any

  @Watch('value')
  protected onValueChange() {
    if (this._safeValues.length !== this.options.length) {
      this.checkedAll = false
      this.checkedAllIndeterminate = this._safeValues.length > 0
    } else {
      this.checkedAll = true
      this.checkedAllIndeterminate = false
    }
  }

  protected handleCheckedAll(e: MouseEvent) {
    console.error('handleCheckedAll', e)
    if ((e.target as any).checked) {
      this.$emit('change', this._safeOptions.map(option => option.value))
    } else {
      this.$emit('change', undefined)
    }
    this.preventEvent(e, true);
    (this.$refs.select as any).focus();
  }

  private get _safeOptions(): any[] {
    return (this.options || [])
  }
  private get _safeValues(): any[] {
    return (this.value || []) as any[]
  }


  protected get selectedMap(): Map<string, boolean> {
    return this._safeValues.reduce((obj, v) => obj.set(v, true), new Map())
  }
  protected get unselectedCode() {
    return this._safeOptions.filter(opt => !this.selectedMap.has(opt.value)).map(opt => opt.value)
  }

  protected handleCheckReverse() {
    this.$emit('change', this.unselectedCode)
  }

  protected preventEvent(e: MouseEvent, stop: boolean = true) {
    e.preventDefault()
    stop && e.stopPropagation()
  }

  render(h) {
    const list = this._safeOptions.map(option => {
      return <Option {...{ props: option }}></Option>
    })
    return (
      <NaticeSelect {...{
        ref: "select",
        props: {
          mode: 'multiple',
          ...this.$attrs,
          ...this.$props,
        }, on: this.$listeners, attrs: this.$attrs,
        scopedSlots: {
          dropdownRender: (menu) => {
            return (
              <div>
                <div {...{
                  on: {
                    mouseup: this.preventEvent
                  }
                }}>
                  <a-checkbox
                    ref="checkbox"
                    indeterminate={this.checkedAllIndeterminate}
                    checked={this.checkedAll}
                    style="padding: 8px; cursor: pointer;"
                    {...{
                      on: {
                        change: this.handleCheckedAll
                      },
                      nativeOn: {
                        mousedown: e => this.preventEvent(e, false)
                      }
                    }}>
                    全选
                  </a-checkbox>
                  {<a {...{
                    attrs: this.checkedAllIndeterminate ? {} : {
                      disabled: true
                    },
                    on: {
                      click: this.handleCheckReverse,
                      mousedown: this.preventEvent
                    }
                  }}>
                    <a-icon type="swap"></a-icon>反选
                  </a>}
                  <a-divider style="margin: 4px 0;" />
                </div>
                <v-nodes vnodes={menu} />
              </div>
            )
          }
        }
      }}>
        {list}
      </NaticeSelect>
    )
  }
}
