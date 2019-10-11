import { useProps } from '@/utils/CommonUtils/createTsxComponent'
import { action } from '@storybook/addon-actions'
import { waitingPromise } from '@yuyi/utils'
import NTable from '../NTable'

const { array } = require('@storybook/addon-knobs')
export function TableStoriesMixinsA(Table: any = NTable, dataSource: any = []) {
  return {
    components: { Table },
    props: {
      title: useProps(Array).default(array('title', ['A', 'B', 'C', 'D', 'E'])),
      dataIndex: useProps(Array).default(array('dataIndex', ['A', 'B', 'C', 'D', 'E'])),
      loadData: useProps(null).default(() => (() => waitingPromise(1000, [...dataSource])))
    },
    methods: {
      refresh(reset: boolean) {
        return this.$refs.table.refresh(reset);
      },
      onUpdateLoading: action('update:loading'),
      renderTable() {
        return <NTable ref="table" dataSource={[]} columns={this.dataIndex.map((key, index) => ({ title: 'column' + this.title[index], dataIndex: key, key: key }))} data={this.loadData} />;
      },
      renderTableData() {
        return {
          props: {
            dataSource: [],
            columns: this.dataIndex.map((key, index) => ({ title: 'column' + this.title[index], dataIndex: key, key: key })),
            data: this.loadData
          },
          ref: 'table'
        }
      }
    },
    render(h) {
      return this.renderTable();
    },
    description: {
      NTable: {
        slots: {
          customCell: `(dataIndexValue, recordData, index) => VNode[]`
        }
      }
    }
  };
}
