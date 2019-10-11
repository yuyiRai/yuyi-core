import STable from '../STable'
import { TableStoriesMixinsA } from './TableStoriesMixinsA'
import { createTsxStory } from '@/stories/storyOf'
// import OrgSelectTree from './TypeA.js'
const { button, object, } = require('@storybook/addon-knobs')

export default {
  title: 'Components/STable',
  component: STable,
  parameters: {
    componentSubtitle: '通用表格'
  }
}

export const base = createTsxStory({
  mixins: [TableStoriesMixinsA(STable)],
  components: { STable },
  data() {
    // this.refresh = button('refresh', this.refresh);
    return {}
  },
  render(h) {
    return (
      <STable {...{
        props: {
          dataSource: [],
          columns: this.dataIndex.map((key, index) => ({ title: 'column' + this.title[index], dataIndex: key, key: key })),
          data: this.loadData
        },
        ref: 'table'
      }} />
    )
  }
})