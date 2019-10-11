import { storiesOf } from '@storybook/vue'
import { date } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import CountDown from './CountDown.vue'
import { Button } from 'ant-design-vue'

const reset = action('reset')
const onEnd = (e) => {
  console.log('time up', e)
}
storiesOf('Components/CountDown', module)
  .addParameters({ component: CountDown })
  .add('use jsx', () => ({
    components: { CountDown },
    props: {
      myprop: {
        type: String
      }
    },
    data() {
      const next = new Date()
      next.setHours(next.getHours() + 10)
      const target = date('target', next)
      return { target, reset }
    },
    render(h) {
      const { target, reset, onEnd } = this || {}
      const props = { props: { target: new Date(target), onEnd } }
      return (
        <div>
          <CountDown {...props}></CountDown>
          <Button type='primary' onClick={reset}>重置</Button>
        </div>
      )
    },
    methods: {
      onEnd
    }
  }))
  .add('use template', () => ({
    components: { CountDown, Button },
    data() {
      const next = new Date()
      next.setHours(next.getHours() + 10)
      const target = date('target', next)
      return { target, reset }
    },
    template: `
        <div>
          <CountDown :target='target' :onEnd='onEnd' ></CountDown>
          <Button type='primary' :onClick='reset'>重置</Button>
        </div>
      `,
    methods: {
      onEnd
    }
  })
  )
