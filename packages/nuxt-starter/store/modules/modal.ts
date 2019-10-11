import { isObject } from 'lodash';
import { Modal } from 'ant-design-vue'
import { VCProps } from '@/components/CommonFormBase/interface';

export interface IModalProps extends VCProps<Modal> {
  title: string,
  okText: '确认' | string,
  cancelText: '取消' | "返回" | string,
  width: 'auto' | string,
  footer: any,
  header: any,
  formProps: { [key: string]: any }
}
export type ModalProps = Partial<IModalProps> | string;

export function convertModalProps(props: ModalProps, isSubmit: boolean = true) {
  const {
    title,
    okText = '确认',
    cancelText = isSubmit ? '取消' : "返回",
    width = 'auto',
    footer = undefined,
    header = undefined,
    formProps = {},
    ...other
  } = (isObject(props) ? props : { title: props }) as IModalProps
  return { formProps, title, okText, cancelText, width, footer, header, ...other }
}
