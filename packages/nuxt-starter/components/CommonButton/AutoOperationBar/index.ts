import Vue from 'vue'
import { TsxComponent } from 'vue-tsx-support'
import AutoOperationBarC from './component'
import { IAutoOperationBarProps } from './interface'
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent'

const AutoOperationBar: VueComponent<IAutoOperationBarProps, any, any> = AutoOperationBarC as any

export { AutoOperationBar }
export default AutoOperationBar;