import { typeFilterUtils } from '@yuyi/utils';
import { computed, createComponent, provide, reactive } from 'vue-function-api';

export function createFormGroup(config: IFormGroupConfig) {
  const a = createComponent({
    props: {
      readonly: {
        type: Boolean
      },
      hasFeedback: {
        type: Boolean
      },
      colon: {
        type: Boolean
      },
      env: {
        type: null
      }
    },
    setup(props, context) {
      const state = reactive({
        initReadonly: config.readonly,
        initHasFeedback: config.hasFeedback,
        colon: config.colon,
        initEnv: config.env,
      })
      const store = computed(() => {
        return ({
          colon: typeFilterUtils.isBooleanFilter(props.colon, state.colon),
          readonly: typeFilterUtils.isBooleanFilter(props.readonly, state.initReadonly),
          hasFeedback: typeFilterUtils.isBooleanFilter(props.hasFeedback, state.initHasFeedback),
          ...(typeFilterUtils.isObjectFilter(props.env, state.initEnv) || {})
        })
      });
      provide('CFromGroup', store);
      return { store };
    },
    render(h) {
      // debugger
      return <div>{this.$slots.default}</div>;
    }
  });
  return a;
}

export interface IFormGroupConfig {
  readonly?: boolean;
  hasFeedback?: boolean;
  colon?: boolean;
  [key: string]: any;
}

export type Component<T> = (props: T & {
  props?: T;
}) => any

export const FormGroup: Component<IFormGroupConfig> = createFormGroup({}) as any
