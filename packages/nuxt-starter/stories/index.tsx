import { Meta, Story, Preview, Props as PropsDefault } from '@storybook/addon-docs/blocks';
import { VueInReact } from 'vuera'
import { AntTable, ITableColumn } from '@/components/Table/AntTable';
import { values, groupBy, startCase } from 'lodash';
import { convertMap2UnieqArray } from '@/utils/CommonUtils';

Story.defaultProps = {
  ...(Story.defaultProps || {}),
  height: 'auto'
}
Preview.defaultProps = {
  ...(Preview.defaultProps || {}),
  withToolbar: true
}

export const type = ['props', 'events', 'slots', 'methods']
export type PipeMeta = {
  key: string;
  title: string;
  color?: string;
  col?: 'name' | 'defaultValue' | 'description';
  pre?: boolean;
}

function pipe(name: string, { title: key, content, description = content }, env: {
  model?: string;
  models: string[];
  modelsEvent: string[],
  deprecated: string[]
}): PipeMeta {
  switch (key) {
    case 'model':
      const title = !env.model && description === true ? 'v-model' : description
      const isModel = title === 'v-model'
      env.models.push(name)
      if (isModel) {
        env.model = name
      } else {
        env.modelsEvent.push('update:' + name)
      }
      return { key, title, color: isModel ? 'green' : 'blue', col: 'name' };
    case 'required':
      return { key, title: 'required', color: 'red', col: 'name' };
    case 'scopedSlot':
      return { key, title: 'scoped', color: 'blue', col: 'name' };
    case 'deprecated':
      env.deprecated.push(name)
      return { key, title: '已废弃', color: 'red', col: 'name' };
    // case 'default':
    //   return { key, title: '默认值', color: 'blue', col: 'name' };
    case 'see':
      return { key, title: '见: ' + description, col: 'description', pre: true };
    default:
      return { key, title: description };
  }
}

export const Props = VueInReact({
  props: {
    /**
     * 组件
     */
    of: {
      type: Object,
      required: true
    },
    /**
     * 展示类型
     */
    type: {
      type: String,
      default: 'props'
    },
    /**
     * 展示类型
     */
    typeList: {
      type: Array,
      default: type
    }
  },
  inject: {
    context: {
      default() { return {} }
    }
  },
  computed: {
    meta() {
      const { __docgenInfo: info = {} } = this['of']
      return info
    },
    dataList() {
      const { meta } = this
      const env = { deprecated: [], models: [], modelsEvent: [] }
      return this.typeList.map(
        type => {
          const data = convertMap2UnieqArray(meta[type], 'name')
          return data.map(data => {
            const { name, tags = {}, scoped, description, required } = data
            const nextTagsMap = tags instanceof Array ? groupBy(tags, 'title') : tags
            const tagsKeys = Object.keys(nextTagsMap)
            if (type === 'props' && !!required) {
              nextTagsMap['required'] = { title: 'required' }
              tagsKeys.unshift('required')
            }
            if (type === 'slots' && scoped) {
              nextTagsMap['scopedSlot'] = { title: 'scopedSlot', description }
              tagsKeys.unshift('scopedSlot')
            }
            if (env.modelsEvent.includes(name)) {
              nextTagsMap['model'] = { title: 'model', description: '.sync' }
              tagsKeys.unshift('model')
            }
            for (const key of tagsKeys) {
              const tag = nextTagsMap[key]
              const meta = tag instanceof Array && tag.length === 1 ? tag[0] : tag
              const r = pipe(name, meta, env)
              nextTagsMap[key] = r
            }
            const nextTags = values(nextTagsMap)
            return { ...data, tagsKeys, tags: nextTags, tagsMap: nextTagsMap }
          });
        }
      )
    },
    data() {
      console.log('getInfo', this.meta, this)
      return this.typeList.map(
        (type, index) => {
          const data = this.dataList[index]
          return ({ data, type, columns: this.columns.filter(({ key }) => key in data[0]) })
        }
      )
    }
  },
  methods: {
    pipe,
    renderTag(meta: PipeMeta) {
      const { key, color, title } = meta
      return <a-tag key={key} color={color}>{title}</a-tag>
    },
    customRender(v: string, tags: PipeMeta[], column: PipeMeta['col']) {
      const render: (string | PipeMeta)[] = v && [v] || []
      let count = 0;
      for (const tag of tags) {
        const { pre, col } = tag
        if (col === column) {
          count++
          render[pre ? 'unshift' : 'push'](tag)
        }
      }
      return count > 0 ? (
        <span>
          {render.map(r =>
            render.length > 1 && (typeof r !== 'string')
              ? this.renderTag(r)
              : ((typeof r !== 'string') && r.title || <span>{r} </span>))}
        </span>
      ) : v
    }
  },
  data() {
    return {
      columns: Object.freeze([
        {
          key: 'name', title: 'Name', width: 300, dataIndex: 'name',
          sorter: true,
          customRender: (v, record) => {
            return <b>{[
              this.customRender(v, record.tags, 'name'),
              // !!record.required && <span title="必须" style={`
              //   color: rgb(255, 68, 0);
              //   font-family: monospace;
              //   cursor: help;
              // `}>*</span>
            ]}</b>
          }
        },
        // {
        //   key: 'type', title: 'Type', dataIndex: 'type',
        //   customRender: (v) => {
        //     return v && (v.name || (v.names && v.names.join(' ')))
        //   }
        // },
        {
          key: 'params', title: 'Function', dataIndex: 'params',
          customRender: (v) => {
            return v instanceof Array && v.reduce((l, r) => [...l, l.length > 0 && ',', `${r.name}: ${r.type.name}`], [])
          }
        },
        {
          key: 'defaultValue', title: 'Default', dataIndex: 'defaultValue.value',
          customRender: (v) => {
            return ['null', 'undefined', '', null, undefined].includes(v) ? '-' : v
          }
        },
        {
          key: 'description', title: 'Description', dataIndex: 'description',
          customRender: (v, record) => {
            const [inline, ...other] = v.split('\n')
            return ([
              <a-tooltip>
                <template slot="title">{other.reduce((l, e) => [...l, <br />, e], [inline])}</template>
                {this.customRender(inline, record.tags, 'description')}
              </a-tooltip>,
              <div class="propDef" style={{ fontSize: '14px', color: '#aaa' }}>
                {record.type && (record.type.name || (record.type.names && record.type.names.join(' ')))}
              </div>
            ])
          }
        }
      ]) as ITableColumn
    }
  },
  render(h) {
    return (
      <a-tabs class="propTable">
        {
          this.data.map(({ data, type, columns, title = type }) => {
            return (
              <a-tab-pane key={type} tab={startCase(title)}>
                <AntTable rowKey="name" dataSource={data} columns={columns} pagination={false} />
              </a-tab-pane>
            )
          })
        }
      </a-tabs>
    )
  }
})
// ({ of: component, type, ...any }: { of: any, type: 'props' | 'events' | 'methods' | 'slots' }, context: any) => {
//   console.log(component, type)
//   const { __docgenInfo: info } = component
//   if (type !== 'props') {
//     component = cloneDeep(component)
//     component.__docgenInfo.props = info[type]
//   }
//   return PropsDefault({ of: component, type, ...any } as any, context)
// }
Props.defaultProps = {
  ...(Props.defaultProps || {}),
  type: 'props'
}

export const mockOptions = Array(10).fill(true).map((_, i) => ({ value: i + '', label: '选项' + i }))
export { Meta, Story, Preview }
