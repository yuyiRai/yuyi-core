import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode { }
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
declare module 'vue-function-api/dist/ts-api/component' {
  interface ComponentOptions<PropsOptions = ComponentPropsOptions, RawBindings = Data, Props = ExtractPropTypes<PropsOptions>> {
    props?: PropsOptions;
    setup?: SetupFunction<Props, RawBindings>;
    components?: { [key: string]: any };
    render?(this: any, h: any): JSX.Element;
  }
}
