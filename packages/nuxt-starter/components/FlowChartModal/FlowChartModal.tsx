import { STable } from '@/components';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FlowChartCore, AuditResult, UserRole, Steps } from './core/index';

Steps.install(Vue)
export interface ITaskVo {
  gradeId: string,
  gradeName: string,
  taskType: string
}

@Component({
  components: { STable } as any
})
export class FlowChartModal extends Vue {
  core = new FlowChartCore()
  @Prop({ default: () => ({}), type: Function })
  loadData: () => Promise<{
    dataSource: any[]
    flowChartData: any[]
  }>
  @Prop({ type: Boolean })
  completed: boolean

  @Prop({ type: String, default: 'antd' })
  component: 'antd' | 'vant'

  // 表头
  columns = [
    { title: '审核机构', dataIndex: 'comName', width: 250 },
    { title: '审核角色', dataIndex: 'queueName', customRender: this.getRenderWithEnum(UserRole) },
    { title: '审核人', dataIndex: 'endUserName' },
    {
      title: '审核结果',
      dataIndex: 'auditResult',
      customRender: this.getRenderWithEnum(AuditResult, this.getEmptyAuditResult, (v: string, record: any) => {
        return v === '排除大额可疑' ? '排除' + (({ ISTR: '可疑', HVTR: '大额' }[record.taskCatalog]) || '') : v;
      })
    },
    { title: '分析意见', dataIndex: 'analyzeOpinion', width: 300 },
    { title: '审核时间', dataIndex: 'endTime' }, ,
  ]

  getEmptyAuditResult(_v: any, record: any, index: number) {
    if (index === 0) {
      return '（' + (this.core.lastHistroyPoint === 0 ? '尚未' : '') + '发起审核）'
    } else if (index === this.core.dataSource.length - 1) {
      return `（待${record.taskTypeName || '审核'}）`
    } else if (this.core.taskVoList[0] && this.core.taskVoList[0].gradeId === record.queueName){
      return `发起审核`
    } else {
      return `同意上报`
    }
  }

  getRenderWithEnum(optionEnum: any, getDefault?: any, transform?: any) {
    const optionMap = Object.entries(optionEnum).reduce((o, [k, v]: any) => {
      return Object.assign(o, { [v]: k })
    }, {})
    return (v: any, record: any, index: any) => {
      let view = v != null ? optionMap[v] : null
      transform ? (view = transform(view, record)) : null
      return <span>{view != null ? view : (getDefault && getDefault(v, record, index))}</span>
    }
  }
  // 加载数据方法 必须为 Promise 对象
  async localLoadData() {
    return this.core.init(this.completed, this.loadData)
  }

  rowClassName(row: ITaskVo, index: number) {
    return index > 0 && index === this.core.dataSource.length - 1 ? "current" : null
  }
}

export default FlowChartModal
