import { createTsxComponent, convertTsxComponent } from '@/utils/CommonUtils/createTsxComponent';
import { Select as AntSelect } from 'ant-design-vue';
import { VCProps } from '../CommonFormBase';
const NaticeSelect = AntSelect as any
const Option = AntSelect.Option as any

export const Select = convertTsxComponent<VCProps<AntSelect>>(AntSelect);
(Select as any).Option = Option
export default Select;
