import { AuditResult, UserRole } from './utils/common';

export interface ITaskVo {
  gradeId: string,
  gradeName: string,
  taskType: string
}
export class FlowChartCore {
  completed: boolean;
  dataSource: { queueName: any;[key: string]: any; }[] = [];
  flowChartData: any = {};
  loading: boolean = false;

  async init(completed: boolean, loadData: () => Promise<{
    dataSource: any[]
    flowChartData: any[]
  }>) {
    this.completed = completed;
    const { dataSource, flowChartData } = await loadData()
    this.dataSource = dataSource
    this.flowChartData = flowChartData
    return this.dataSource
  }

  get chartTitle() {
    return `审核流程${this.completed ? "已结束" : (this.lastHistroyPoint === 0 ? "尚未启动" : "进行中")}`
  }

  /**
   * 流程图清单
   */
  get taskVoList(): ITaskVo[] {
    return (this.flowChartData && (this.flowChartData.taskVoList instanceof Array) && this.flowChartData.taskVoList) || []
  }
  /**
   * 当前节点
   */
  get current(): any {
    return this.taskVoList.find(task => task.gradeId === this.flowChartData.nowGradeId)
  }
  /**
   * 当前节点Index
   */
  get currentPoint(): number {
    return this.taskVoList.findIndex(task => task.gradeId === this.flowChartData.nowGradeId)
  }
  /**
   * 将审核轨迹中相同步骤的节点堆栈
   */
  get trackMapTrack(): { [key: string]: any[] } {
    return this.dataSource.reduce((obj, item) => {
      const current = obj[item.queueName] || []
      return Object.assign(obj, {
        [item.queueName]: current.concat([item])
      })
    }, {})
  }

  /**
   * 审核轨迹中到达过的最靠前的审核节点
   */
  get lastHistroyPoint() {
    const sorted = this.dataSource.map(t => this.taskVoList.findIndex(vo => vo.gradeId === t.queueName)).sort((a, b) => a - b)
    // console.log(sorted)
    return sorted[sorted.length - 1]
  }

  get trackMap(): { [key: string]: any } {
    return Object.entries(this.trackMapTrack).reduce((obj, [key, itemList]) => {
      return Object.assign(obj, {
        [key]: itemList[itemList.length - 1]
      })
    }, {})
  }

  get trackMapBackTimes() {
    return Object.entries(this.trackMapTrack).reduce((obj, [key, itemList]) => {
      return Object.assign(obj, { [key]: itemList.filter(item => item.auditResult === AuditResult.退回).length })
    }, {})
  }

  /**
   * 审核流程结束（通过）
   */
  get success() {
    const r = this.completed && this.dataSource[this.dataSource.length - 1]
    return r && r.auditResult === AuditResult.审核通过
  }

  /**
   * 审核流程结束（排除/删除不同意）
   */
  get failed() {
    const r = this.completed && this.dataSource[this.dataSource.length - 1]
    return r && (r.auditResult === AuditResult.排除大额可疑 || r.auditResult === AuditResult.不同意)
  }

  get statusMap() {
    const r = {
      [AuditResult.审核通过]: "finish",
      [AuditResult.排除大额可疑]: "error",
      [AuditResult.退回]: "error",
    }
    return this.dataSource.reduce((obj, item) => {
      return Object.assign(obj, {
        [item.queueName]: r[item.auditResult] || (this.current.gradeId === item.queueName ? "process" : "finish")
      })
    }, {})
  }

  get pointConfigList() {
    return this.taskVoList.map((point, index) => {
      const title = this.getTitleWithIndex(point, index)
      const descriptions = point.gradeName.split("公司")
      return {
        ...point,
        icon: this.getItemIcon(point, index, title),
        title,
        classes: {
          [this.statusMap[point.gradeId]]: true,
          // 是否为当前节点
          current: index === this.currentPoint,
          // 是否为到达过的最后一个节点
          last: this.lastHistroyPoint === index,
          // 是否为最初的节点
          first: 0 === index,
          // 是否为当前正在进行的节点（审核中，发起操作中）
          currentAudit: title === '审核中' || (index === this.currentPoint),
          // 在被退回的路线上审核
          backAuditing: this.lastHistroyPoint > index && index >= this.currentPoint
        },
        stepProps: {
          status: this.statusMap[point.gradeId]
        },
        description: [descriptions[0] + '公司', descriptions[1]]
      }
    })
  }

  getItemIcon(point: ITaskVo, index: number, title: string) {
    if (title === '审核中') {
      return { type: 'process', hintTitle: '当前', hintVisible: true }
      // 最后的节点
    } else if (title === '已通过' || title === "已退回") {
      return {
        type: title === '已通过' ? 'checked' : 'back',
        hintVisible: this.trackMapBackTimes[point.gradeId] > 1 && !this.loading,
        hintTitle: '退回次数: ' + this.trackMapBackTimes[point.gradeId]
      }
    } else if (title === "发起") {
      return { type: 'begin' }
    } else if (title === "未交集") {
      return { type: 'skip', theme: 'filled' }
    } else if (title === "已排除") {
      return {
        type: 'abort',
        hintVisible: !this.loading,
        hintTitle: '流程结束'
      }
    } else if (title === "不同意") {
      return {
        type: 'disagree',
        hintVisible: !this.loading,
        hintTitle: '流程结束'
      }
    } else if (index === this.taskVoList.length - 1) {
      return { type: 'completed' }
    }
  }

  getTitleWithIndex(point: ITaskVo, index: number) {
    if (index === 0) {
      return '发起'
    } else if (this.trackMap[point.gradeId] && this.trackMap[point.gradeId].auditResult === AuditResult.排除大额可疑) {
      return '已排除'
    } else if (index === this.currentPoint && index === this.taskVoList.length - 1) {
      return (this.completed ? '' : '待') + '完成审核'
    } else if (index === this.currentPoint) {
      return '审核中'
    } else if (index < this.currentPoint) {
      return this.trackMap[point.gradeId] ? '已通过' : '未交集'
    } else if (this.statusMap[point.gradeId] === 'error' && index > this.currentPoint) {
      return '已退回'
    } else if (this.completed) {
      return '-'
    } else {
      return !this.trackMap[point.gradeId] && index < this.lastHistroyPoint ? '未交集' : '待流转'
    }
  }

  get tableDisplay() {
    return this.dataSource.map((data, index) => {
      return {
        ...data,
        roleName: this.getRoleName(data.queueName),
        ...this.getResult(data.auditResult, index)
      }
    })
  }

  getRoleName(gradeId: string) {
    if (!gradeId) return null
    return Object.entries(UserRole).find(r => r[1] === gradeId)[0]
  }
  getResultName(result: string, index: number) {
    if (!result) {
      return index === 0 ? '发起' : (index === this.dataSource.length - 1 ? '进行中' : null)
    }
    return Object.entries(AuditResult).find(r => r[1] + '' === result + '')[0]
  }
  getResult(result: string, index: number) {
    const resultMap = {
      审核通过: 'success',
      发起: 'success',
      进行中: 'default'
    }
    const resultName = this.getResultName(result, index)
    return {
      resultName,
      resultType: resultMap[resultName] || 'danger'
    }
  }
}
