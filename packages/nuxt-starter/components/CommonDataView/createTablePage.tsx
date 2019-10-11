import { CommonPageRequestParams, CommonPageResponse } from '@/api';
import { STable } from '@/components';
import { useReadonly } from "@/components/CommonDataView/pipe/useReadonly";
import { IAppendGroupPipeGroup, IItemConfigGroup } from '@/components/CommonFormBase/interface';
import { Utils } from '@/components/CommonFormBase/Utils';
import { stubArray } from '@yuyi/utils';
import { map } from 'lodash';
import { Component, Prop } from 'vue-property-decorator';
import { AutoOperationBar } from '../CommonButton';
import { createForm } from "./createForm";
import { FormChildrenMixins } from './FormChildrenMixins';
import { createFormModalComponent, createFormModalComponentWithSlot, IModalAction } from './TableModalSystem';
import { ActionType } from '../CommonButton/AutoOperationBar/interface';


export interface IKeyValueMap<V = any> {
  [key: string]: V;
}

enum ActionNameType {
  "编辑" = "edit",
  "查看" = "view",
  "新增" = "add",
  "详情" = "details"
}
export enum ActionTitle {
  edit = "修改",
  view = "查看",
  add = "新增",
  details = "详情"
}

export function createTablePage(itemConfig: IItemConfigGroup, initialValues?: any, appendConfigPipe?: IAppendGroupPipeGroup) {
  const Form = createForm(itemConfig, initialValues, appendConfigPipe);

  @Component({})
  @Utils.registerConfig(itemConfig, initialValues, appendConfigPipe)
  class TableModalSystem<T extends IKeyValueMap = any> extends FormChildrenMixins {
    [key: string]: any;
    static modal = {
      value: 'value',
      event: 'change'
    };

    @Prop({ type: Object, default: null })
    actionColumn: any;

    utils: Utils = new Utils();
    Form = Form

    get displayActions(): IModalAction[] {
      return this.actions.map((action, index) => {
        if (typeof action === 'string') {
          action = { name: action };
        }
        action.props = action.props || {}
        action.props.type = "link"
        return action
      })
    }

    get configPipe() {
      return {
        [ActionNameType.详情]: (action: IModalAction, record?: T): IModalAction | false => {
          return { ...action, title: this.isReadOnly ? ActionTitle.details : ActionTitle.edit }
        },
        [ActionType.编辑]: (action: IModalAction, record?: T): IModalAction | false => {
          return !this.isReadOnly && action || false
        },
        [ActionType.删除]: (action: IModalAction, record?: T): IModalAction | false => {
          return !this.isReadOnly && {
            ...action,
            action: () => this.createActionEmit('delete')(record),
            confirm: true
          } || false
        }
      }
    }

    actionRender(v: any, record: T) {
      return (
        <div ref="action">
          <AutoOperationBar
            allowCancel={false}
            align="center"
            defaultProps={{ type: "link", size: 'small' }}
            on={{
              view: () => this.callDetailModal(record, ActionNameType.查看),
              details: () => this.callDetailModal(record, this.isReadOnly ? ActionNameType.查看 : ActionNameType.编辑),
              edit: () => this.callDetailModal(record)
            }}
            actions={
              this.displayActions.map((action, index, actions) => {
                const { name } = action;
                if (this.configPipe[name]) {
                  return this.configPipe[name](action, record)
                } else if (action.action === 'modal') {
                  const { modalProps, modalSlot, modalComponent = createFormModalComponentWithSlot(
                    this.getSlotFormRender(modalSlot),
                    action.onModalSubmit,
                    this.fromGroup.value
                  ) } = action;
                  return {
                    ...action,
                    action: () => {
                      this.callModal(modalProps, modalComponent, () => record)
                    }
                  };
                } else {
                  return action;
                }
              })
            } />
        </div>
      )
    }

    getSlotFormRender(slotName: string) {
      return this.$scopedSlots[slotName]
    }

    get itemConfig() {
      this.utils.connect(this as any)
      return this.utils.configInit();
    }

    created() {
      const column: any[] = map(this.itemConfig.default, (item) => {
        const getReadonly = useReadonly()
        const { code, label, component: Render, ...other } = item;
        const { component: Readonly } = getReadonly(item, this.utils.getGlobalConfig()) as any
        // console.log(item)
        return {
          dataIndex: code,
          title: label,
          ...other,
          customRender: (v: any) => {
            // console.log(v, code)
            return <Readonly value={v} props={{
              ...this.utils.getItemInputProps(item),
              placeholder: ""
            }} />;
          }
        };
      }).filter(item => !(item.display === false || item.display instanceof Function));
      this.column = column.concat([
        {
          title: '操作',
          customRender: this.actionRender,
          ...(this.actionColumn || {})
        }
      ]);
    }
    column: any[];

    public callAddModal(title = ActionTitle[ActionNameType.新增]) {
      return this.callModal({
        title: title,
        width: '60vw'
      }, createFormModalComponent(this.Form), async () => ({}), this.createActionEmit('add'))
    }
    public callDetailModal(data: T, type: ActionNameType = ActionNameType.编辑, title = ActionTitle[type]) {
      return this.callModal({
        title: title,
        width: '60vw'
      }, createFormModalComponent(this.Form, this.fromGroup.value), async () => data, this.createActionEmit('edit', data))
    }

    public refreshTable() {
      (this.$refs.table as any).refresh(true)
    }

    /**
     * 创建事件提交
     * @param name 事件名称
     * @param originData 行原始数据
     */
    public createActionEmit(name: string, originData: any = {}) {
      return (data: T) => {
        return new Promise((resolve, reject) => {
          // debugger
          this.$emit(name, { ...originData, ...data, ...this.primaryKey }, data => {
            // console.log('refresh')
            this.refreshTable()
            resolve(data)
          }, (e) => {
            console.error('createActionEmit', e)
            reject(new Error(e))
          })
        })
      }
    }
    public callModal(modalProps: any, component: any, loadData: any, submitData?: any) {
      // console.log(record)
      return this.$autils.callModal(
        modalProps,
        component,
        loadData,
        !this.isReadOnly && submitData
      ).then(v => {
        console.log('callModal', v)
        return v
      }).catch((e: any) => {
        console.log('callModal', e)
      }).finally(() => {
        console.log('close')
      });
    }
    @Prop({})
    loadData: (params: CommonPageRequestParams) => Promise<CommonPageResponse<any>>;
    @Prop({ type: Object })
    initialResponse: any;
    @Prop({ type: Array })
    initialData: any;
    @Prop({ type: Object })
    primaryKey: object;
    @Prop({ type: Array, default: stubArray })
    actions: ('edit' | 'delete' | IModalAction)[];
    @Prop({ default: undefined })
    showPagination: boolean;

    convertResponse(dataResponse: any) {
      if (dataResponse instanceof Array) {
        const dataList = dataResponse;
        return ({ pageNum: 1, pageSize: 5, total: dataList.length, data: dataList });
      }
      return dataResponse;
    }

    public async asynLoadData(params: CommonPageRequestParams) {
      if (this.showPagination === false) {
        // debugger;
        return this.convertResponse(this.initialData);
      } else if (this.initialResponse) {
        const { pageSize, pageNum } = this.initialResponse;
        if (pageNum === params.pageNum && pageSize === params.pageSize) {
          // for(const config of this.itemConfig.default) {
          //   if ()
          // }
          return this.convertResponse(this.initialResponse);
        }
      }
      return this.loadData({ ...params, ...this.primaryKey });
    }

    render(h) {
      return (
        <STable
          class="table-form"
          ref="table"
          size="small"
          columns={this.column}
          showPagination={this.showPagination}
          data={this.asynLoadData}
        />
      );
    }
  }
  return TableModalSystem;
}
