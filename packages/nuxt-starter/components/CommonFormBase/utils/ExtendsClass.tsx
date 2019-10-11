/* eslint-disable */
import { VueClass } from 'vue-class-component/lib/declarations';
import Vue, { VueConstructor } from 'vue';
import { Mixins } from 'vue-property-decorator';

export class ExtendsUtils {
  public static mixins<
    Mixin extends VueClass<any>, MixinC extends Mixin extends VueClass<infer C> ? C : Mixin,
    Mixin2 extends VueClass<any>, Mixin2C extends Mixin2 extends VueClass<infer C> ? C : Mixin2
  >(
    mixins: Mixin, mixins2: Mixin2
  ): VueConstructor<MixinC & Mixin2C>;

  public static mixins<
    Mixin extends VueClass<any>, MixinC extends Mixin extends VueClass<infer C> ? C : Mixin,
    Mixin2 extends VueClass<any>, Mixin2C extends Mixin2 extends VueClass<infer C> ? C : Mixin2,
    Mixin3 extends VueClass<any>, Mixin3C extends Mixin3 extends VueClass<infer C> ? C : Mixin3
  >(
    mixins: Mixin, mixins2: Mixin2, mixins3: Mixin3
  ): VueConstructor<MixinC & Mixin2C & Mixin3C>;

  public static mixins<
    Mixin extends VueClass<any>, MixinC extends Mixin extends VueClass<infer C> ? C : Mixin,
    Mixin2 extends VueClass<any>, Mixin2C extends Mixin2 extends VueClass<infer C> ? C : Mixin2,
    Mixin3 extends VueClass<any>, Mixin3C extends Mixin3 extends VueClass<infer C> ? C : Mixin3,
    Mixin4 extends VueClass<any>, Mixin4C extends Mixin4 extends VueClass<infer C> ? C : Mixin4
  >(
    mixins: Mixin, mixins2: Mixin2, mixins3: Mixin3, mixins4: Mixin4
  ): VueConstructor<MixinC & Mixin2C & Mixin3C & Mixin4C>;

  public static mixins(...mixins: any[]) {
    return Mixins(...mixins) as any
  }
}
