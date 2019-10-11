import AutoOperationBar from '.'
import { TableStoriesMixinsA } from '../../Table/stories/TableStoriesMixinsA'
import { createTsxStory } from '@/stories/storyOf'
// import OrgSelectTree from './TypeA.js'

const { button, object, } = require('@storybook/addon-knobs')
console.log(AutoOperationBar)
export default {
  title: 'Components/AutoOperationBar',
  component: AutoOperationBar,
  parameters: {
    componentSubtitle: '操作栏'
  }
};

export const base = createTsxStory({
  components: { AutoOperationBar },
  mixins: [TableStoriesMixinsA()],
  data() {
    // this.refresh = button('refresh', this.refresh);
    return {}
  },
  render(h) {
    return this ? (
      <div>
        <AutoOperationBar primary="query" align="center" actions={[
          { name: 'query', title: '查询', action: () => this.refresh(true) }
        ]}></AutoOperationBar>
        {this.renderTable()}
      </div>
    ) : <a></a>
  }
})
