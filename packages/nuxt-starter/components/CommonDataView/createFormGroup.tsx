import { typeFilterUtils } from '@yuyi/utils';
import { computed, createComponent, provide, value, Wrapper } from 'vue-function-api';

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
      const initReadonly = value(config.readonly);
      const initHasFeedback = value(config.hasFeedback);
      const colon = value(config.colon);
      const initEnv = value(config.env);
      const store: Wrapper<IFormGroupConfig> = computed(() => {
        return ({
          colon: typeFilterUtils.isBooleanFilter(props.colon, colon.value),
          readonly: typeFilterUtils.isBooleanFilter(props.readonly, initReadonly.value),
          hasFeedback: typeFilterUtils.isBooleanFilter(props.hasFeedback, initHasFeedback.value),
          ...(typeFilterUtils.isObjectFilter(props.env, initEnv.value) || {})
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
