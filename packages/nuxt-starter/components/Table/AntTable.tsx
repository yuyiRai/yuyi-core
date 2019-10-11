import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { Table } from 'ant-design-vue';
import { Column } from 'ant-design-vue/types/table/column';
import { VCProps } from '../CommonFormBase';

export interface ITableProps extends Partial<Pick<VCProps<Table>, Exclude<keyof VCProps<Table>, 'data' | 'columns'>>> {
  columns: ITableColumn[];
}
export const AntTable: VueComponent<ITableProps, {
  onChange?: any;
}, {}, typeof Table> = { ...Table } as any;
export interface ITableColumn extends Pick<VCProps<Column>, Exclude<keyof VCProps<Column>, 'customRender'>> {
  customRender?: (value?: any, row?: any, index?: number) => JSX.Element;
}

