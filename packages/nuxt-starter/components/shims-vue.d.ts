declare module '*.vue' {
  import Vue, { VueConstructor } from 'vue';
  import { Component } from 'vue-property-decorator';
  export default Vue as VueConstructor<Component & { [key: string] }> & {
    install?(vue: typeof Vue): void;
  };
}