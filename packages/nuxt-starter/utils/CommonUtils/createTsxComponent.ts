import p from 'vue-strict-prop';
import "vue-tsx-support/enable-check";
import { Component, componentFactory, ofType, TsxComponent as TVFC } from 'vue-tsx-support';
import { Vue } from 'vue-property-decorator';
export const createTsxComponent = componentFactory.create;
export const mixinTsxComponent = componentFactory.mixin;
export function convertTsxComponent<TProps, TEvents = {}, TScopedSlots = {}>(obj: any) {
  return ofType<TProps, TEvents, TScopedSlots>().convert(obj);
}
export const useProps = p
export const VueComponent = Component
export type VueComponent<T, E = any, S = any, C extends typeof Vue = typeof Vue> = Pick<
  C, keyof C
> & TVFC<InstanceType<C>, T, E, S>