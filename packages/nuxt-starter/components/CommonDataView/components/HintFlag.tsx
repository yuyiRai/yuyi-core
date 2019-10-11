/* eslint-disable */
import { IFormItemConfig } from '@/components/CommonFormBase/interface';
import { Component, Prop, Vue } from 'vue-property-decorator';
import './HintFlag.less'
import { TextRollMatcher } from '@/components/NoticeLine';

@Component({})
export class HintFlag extends Vue {
  @Prop({ type: Boolean, default: false })
  public disabled: boolean;
  @Prop({})
  public item: IFormItemConfig;
  @Prop({ type: Object, default() { return <a-icon theme="outlined" class="hint-icon" type="question-circle-o" />; } })
  public icon: JSX.Element;
  public get hint() {
    return this.convertTextMuitiple(this.item.hint);
  }
  public convertTextMuitiple(text: string) {
    return typeof text === 'string' && text.split('\n').map((i, index) => [index > 0 ? <br /> : false, i]);
  }
  public renderHint({ icon, hint, slot }: {
    icon: JSX.Element;
    hint: any;
    slot?: string
  }) {
    return (
      <a-popover slot={slot} getPopupContainer={() => document.body}>
        <span slot="title">{icon}&nbsp;提示</span>
        <div slot="content" style="max-width: 400px;min-width: 50px;">{hint}</div>
        <span>{this.icon}</span>
      </a-popover>
    );
  }

  public renderLabelAndHint(item: IFormItemConfig) {
    const { icon, hint, disabled } = this;
    return (
      <span class={['hint-label-container', { disabled }]}>
        <TextRollMatcher>
          {this.$slots.default}&nbsp;{
            hint && !disabled && [
              this.renderHint({ icon, hint }),
              <span slot='rolling'>{this.$slots.default}</span>,
              this.renderHint({ icon, hint, slot: 'right-icon-rolling' })
            ]}
        </TextRollMatcher>
      </span>
    );
  }
  public render(h) {
    return this.renderLabelAndHint(this.item);
  }
}

const Ellipsis = `
text-overflow: ellipsis;
overflow: hidden;
word-break: break-all;
white-space: nowrap;
vertical-align: middle;line-height: 1.5;
`
