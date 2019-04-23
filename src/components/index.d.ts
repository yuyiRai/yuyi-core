/* eslint-disable */
import FormComponent from './FormPage'
import Utils from '../utils/index'
import { forEach } from 'lodash'
// export * from './TablePage'


declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof Utils;
  }
}