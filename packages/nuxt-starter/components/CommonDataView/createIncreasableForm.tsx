import { IAppendGroupPipeGroup, IItemConfigGroup } from '@/components/CommonFormBase/interface';
import { castArray, uuid } from '@yuyi/utils';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { ConfirmDeleteButton } from '../CommonButton/createConfirmButton';
import { createForm } from "./createForm";
import { FormChildrenMixins } from './FormChildrenMixins';
import { IForm, ISubmitForm } from './Template';
import { AutoOperationBar } from '../CommonButton';

/**
 * 创建可自增加/删除的表单组序列
 * @param itemConfig 单组配置集合
 * @param initialValues 初始值
 * @param appendConfigPipe 追加配置管道
 */
export function createIncreasableForm(
  itemConfig: IItemConfigGroup | Array<IItemConfigGroup>,
  initialValues?: any,
  appendConfigPipe?: IAppendGroupPipeGroup
) {
  const [listItemConfig, topItemConfig] = castArray<IItemConfigGroup>(itemConfig)
  const hasTopItemConfig = !!topItemConfig
  @Component({
    model: {
      prop: 'data',
      event: 'change'
    },
    components: {
      'custom-form': createForm(listItemConfig, initialValues, appendConfigPipe),
      ...hasTopItemConfig ? ({
        'top-custom-form': createForm(topItemConfig, initialValues, appendConfigPipe)
      }) : ({})
    }
  })
  class IncrementForm<T extends {
    ___add?: string;
    ___delete?: boolean;
    [key: string]: any;
  } = any> extends FormChildrenMixins implements ISubmitForm {
    @Prop({ type: Array })
    data: T[];

    @Prop({})
    public itemContainer: any;

    @Prop({ type: Object, default: () => ({}) })
    public primaryKey: object;

    @Prop({ type: Boolean })
    public appendInPrimary: boolean;

    @Prop({ type: Function })
    public loadData: (key: object) => Promise<T[]>;

    @Prop({ type: Function })
    public onDelete: (data: T) => Promise<any>;


    @Prop({ type: [Boolean, Function], default: true })
    public alert: boolean | ((count: number) => JSX.Element);

    remoteLoadData() {
      this.loadData(this.primaryKey).then(data => {
        this.localDataList = data
        this.$emit('change', data)
        this.loading = false
      })
    }

    @Watch('data', { immediate: true })
    public onDataReceive(data: T[]) {
      if (data !== this.localDataList) {
        if (data instanceof Array)
          this.localDataList = [...data]
        else if (this.loadData) {
          this.loading = true
          this.remoteLoadData()
        }
      }
    }

    private loading = false

    public localDataList: T[] = []

    public $refs: {
      [key: string]: IForm;
    }

    public handleAdd() {
      this.localDataList.push({ ___add: uuid() } as T)
    }

    public async handleSubmit(): Promise<T[]> {
      let result = this.localDataList
      try {
        console.log(this.$refs)
        const result: any[] = (await Promise.all(
          this.localDataList.map((r, index) => new Promise(resolve => {
            if (r.___delete) {
              return resolve(false)
            }
            this.$refs['form-' + index].handleSubmit().then(resolve).catch(resolve)
          }))
        )).filter(r => r)
        for (const r of result) {
          if (r instanceof Error) {
            throw r;
          }
        }

        result.forEach(item => Object.assign(item, this.primaryKey))
        console.log(result)
        return result
      } catch (error) {
        throw error
      } finally {
        this.$emit('change', result)
      }
    }

    async handleDelete(index: number) {
      this.loading = true
      // await this.$autils.waiting(10000)
      if (!this.localDataList[index].___add && this.onDelete) {
        await this.$autils.$action(() => this.onDelete(this.localDataList[index]))
      }
      this.loading = false
      this.localDataList[index].___delete = true
      this.localDataList = [...this.localDataList]
      // this.localDataList = this.localDataList.filter((item, i) => i !== index)
    }

    renderItem(item: T, index: number) {
      // console.log(item)
      const key = index
      return !item.___delete && (
        <a-list-item key={key} actions={this.isReadOnly ? [] : [
          <AutoOperationBar
            align="left"
            allowCancel={false}
            defaultProps={{ size: 'small', colorInherit: true, type: 'link' }}
            defaultLoadingProps={{ type: 'link' }}
            actions={[
              { name: 'delete', confirm: true, props: { icon: 'delete' }, action: () => this.handleDelete(index) },
              // { name: 'add', confirm: true, props: { icon: 'plus' }, action: () => this.handleDelete(index) },
              // { name: 'edit', confirm: true, props: { icon: 'edit' }, action: () => this.handleDelete(index) }
            ]} />,
          // <span>{item.seqNo}</span>,
        ]}>
          <custom-form style="margin-left: 20px;" ref={"form-" + index} primaryKey={this.primaryKey} formData={item} itemContainer={this.itemContainer} />
        </a-list-item>
      )
    }


    renderAlert() {
      let { alert } = this;
      alert = alert === true ? ((v: number) => {
        if (this.$scopedSlots.alert) {
          return this.$scopedSlots.alert(v) as any;
        }
        return <span>共 <b><a>{v}</a></b> 条</span>;
      }) : alert
      return alert && (
        <div slot="header">
          <a-alert showIcon>
            <span slot="message">{alert(this.localDataList.filter(r => !r.___delete).length)}</span>
          </a-alert>
        </div>
      )
    }

    render() {
      return (
        <a-spin spinning={this.loading}>
          <a-list
            style="margin-left: 10px;"
            itemLayout="vertical"
            size="small"
            dataSource={this.localDataList}
            renderItem={this.renderItem}
          >
            {
              hasTopItemConfig && <top-custom-form />
            }
            {this.renderAlert()}
            <div slot="footer">
              {!this.isReadOnly && <a-button icon='plus' onClick={this.handleAdd}>新增</a-button>}
              {this.$slots.footer}
            </div>
          </a-list>
        </a-spin>
      )
    }
  }
  return IncrementForm
}
