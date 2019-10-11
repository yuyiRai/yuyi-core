import { getBaseConfig } from '@/config/formItemBase';
import { castArray, cloneDeep, defaultsDeep } from 'lodash';
import { IFormItemConfig, AppendConfigPipe, InputType, AppendGroupPipeGroup } from '../interface';
import { Input } from 'ant-design-vue';
import { FormItemInputInject } from './ComponentInject';

const InjectedInput = FormItemInputInject(Input)

export function registerDefaultOptions(config: IFormItemConfig, instance: any, appendConfigPipe = {}): IFormItemConfig {
  const defaultOptions: AppendGroupPipeGroup = defaultsDeep({}, getBaseConfig(), appendConfigPipe)
  config = cloneDeep(config)
  const typeList = config && config.type
  if (typeList instanceof Array) {
    while (typeList.length > 0) {
      const type = typeList.shift();
      // 第一个为类型，其后的转化为配置项数组
      const [key, ...param] = castArray(type)
      let mergeOptions = null
      const pipe = defaultOptions[key]
      if (pipe instanceof Function) {
        // 传入本配置(可变对象)，utils实例，其它配置数组
        mergeOptions = pipe(config, instance, ...param)
      } else if (pipe instanceof Array && typeof pipe[0] === 'string') {
        typeList.unshift(pipe)
      } else {
        mergeOptions = pipe
      }
      // console.log(config.code, { ...config }, mergeOptions)
      defaultsDeep(config, mergeOptions)
    }
  }

  if (!config.component) {
    config.component = InjectedInput
  }
  // config.col = config.col || 1.5
  return config as IFormItemConfig
}