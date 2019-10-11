// chart
import Bar from '@/components/Charts/Bar.vue'
import ChartCard from '@/components/Charts/ChartCard.vue'
import Liquid from '@/components/Charts/Liquid.vue'
import MiniArea from '@/components/Charts/MiniArea.vue'
import MiniSmoothArea from '@/components/Charts/MiniSmoothArea.vue'
import MiniBar from '@/components/Charts/MiniBar.vue'
import MiniProgress from '@/components/Charts/MiniProgress.vue'
import Radar from '@/components/Charts/Radar.vue'
import RankList from '@/components/Charts/RankList.vue'
import TransferBar from '@/components/Charts/TransferBar.vue'
import TagCloud from '@/components/Charts/TagCloud.vue'

// pro components
import AvatarList from '@/components/AvatarList'
import CountDown from '@/components/CountDown'
import Ellipsis from '@/components/Ellipsis'
import FooterToolbar from '@/components/FooterToolbar'
import NumberInfo from '@/components/NumberInfo'
import DescriptionList from '@/components/DescriptionList'
import Tree from '@/components/Tree/Tree'
import Trend from '@/components/Trend'
import STable, { NTable } from '@/components/Table'
import MultiTab from '@/components/MultiTab'
import Result from '@/components/Result'
import IconSelector from '@/components/IconSelector'
import TagSelect from '@/components/TagSelect'
import ExceptionPage from '@/components/Exception'
import StandardFormRow from '@/components/StandardFormRow'
import QuillEditor from '@/components/Editor/QuillEditor.vue'
import ArticleListContent from '@/components/ArticleListContent'

// 流程图组件
import FlowChartModal from '@/components/FlowChartModal/FlowChartModal.vue'
export { FlowChartModal }

export * from '@/components/CommonFormBase'
export * from './CommonDataView'
export * from './CommonItemComponent'
export * from './CommonButton'

// 通知公告展示滚动
export * from './NoticeLine'

// 表单提示标志

export {
  AvatarList,
  Bar,
  ChartCard,
  Liquid,
  MiniArea,
  MiniSmoothArea,
  MiniBar,
  MiniProgress,
  Radar,
  TagCloud,
  RankList,
  TransferBar,
  QuillEditor,
  Trend,
  CountDown,
  Ellipsis,
  FooterToolbar,
  NumberInfo,
  DescriptionList,
  // 兼容写法，请勿继续使用
  DescriptionList as DetailList,
  Tree,
  STable,
  NTable,
  MultiTab,
  Result,
  ExceptionPage,
  IconSelector,
  TagSelect,
  StandardFormRow,
  ArticleListContent
}
