import { convertTsxComponent, createTsxComponent } from '@/utils/CommonUtils/createTsxComponent';
import { typeFilterUtils, waitingPromise, stubFunction, merge } from '@yuyi/utils';
import { Popconfirm as AntPopconfirm } from 'ant-design-vue';
import { VCProps } from '../CommonFormBase';
import AutoOperationBar from './AutoOperationBar';
import { IButtonProps } from './ThemeButton';

export interface IPopconfirm extends Partial<VCProps<AntPopconfirm>> {
  disabled?: boolean;
  okButtonProps?: any;
  cancelButtonProps?: any;
}
export const Popconfirm = convertTsxComponent<Partial<IPopconfirm>, any>(AntPopconfirm)

export interface IConfirmButtonProps extends IPopconfirm {
  confirm?: any;
  getContainer?: IPopconfirm['getPopupContainer'];
  loading?: IButtonProps['loading'];
}

export const StaticProps = {
  okButtonProps: { style: "display: none" },
  cancelButtonProps: { style: "display: none" }
}

export function createConfirmButton(initialConfirm: any) {
  return convertTsxComponent<IConfirmButtonProps, {
    onClick: (e: any) => any
  }>(createTsxComponent({
    functional: true,
    render(h, { props: {
      getContainer = null,
      loading = false,
      disabled = undefined,
      confirm = initialConfirm,
      okText = "确认",
      cancelText = "取消"
    } = {} as IConfirmButtonProps, data, children, listeners = {} }: any) {
      const isDisabled = typeFilterUtils.isBooleanFilter(disabled, confirm === undefined)
      // console.log(data, listeners, isDisabled);
      return (
        <Popconfirm
          {...data}
          arrowPointAtCenter
          getPopupContainer={getContainer}
          title={<a-spin spinning={loading}>{confirm}</a-spin>}
          onConfirm={listeners.click || stubFunction}
          okText={okText}
          props={{
            okButtonProps: { props: { loading } },
            cancelButtonProps: loading ? StaticProps.cancelButtonProps : {},
            ...(isDisabled ? { visible: false } : {})
          }}
          cancelText={cancelText}>{
            children
          }</Popconfirm>
      );
    }
  }));
}

export function createConfirmButtonComponent(initialConfirm: any) {
  return createTsxComponent<any, any, any>({
    functional: true,
    props: (AntPopconfirm as any).props,
    render(h, { props: {
      getContainer = null,
      disabled = undefined,
      confirm = initialConfirm,
      okText = "确认",
      cancelText = "取消"
    } = {}, data, children, listeners = {} as any }) {
      // console.log(data, listeners);
      return (
        <Popconfirm
          {...data}
          props={StaticProps}
          getPopupContainer={getContainer}
          disabled={typeFilterUtils.isBooleanFilter(disabled, confirm === undefined)}
          title={
            <AutoOperationBar primary="ok" defaultProps={{ size: 'small' }}
              defaultActionHandler={{
                ok: async (...args) => {
                  console.log(args)
                  await waitingPromise(10000)
                }
              }}
              style={{ marginBottom: '-12px', marginTop: '12px' }}
              actions={{
                cancel: cancelText,
                ok: okText
              }}
            >
              <template slot="content">{confirm}</template>
            </AutoOperationBar>
          }
          onConfirm={listeners.click || (() => { })}
        >{
            children
          }
        </Popconfirm>
      );
    }
  });
}

export const ConfirmDeleteButton = createConfirmButton('确认要删除？')
export const ConfirmAddButton = createConfirmButton('确认要新增？')
export const ConfirmEditButton = createConfirmButton('确认要修改？')

export const CommonConfirmButton = {
  delete: ConfirmDeleteButton,
  add: ConfirmAddButton,
  edit: ConfirmEditButton
}

export function getConfirmContainerComponent<K extends keyof typeof CommonConfirmButton>(config: K): (typeof CommonConfirmButton)[K]
export function getConfirmContainerComponent(config: any): ReturnType<typeof createConfirmButton>
export function getConfirmContainerComponent(config: any) {
  return CommonConfirmButton[config] || createConfirmButton(config)
}
