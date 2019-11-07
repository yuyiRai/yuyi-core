import _invariant from 'tiny-invariant'
import _warning from 'tiny-warning'
import { keys } from 'ts-transformer-keys'
import { oc as _oc } from 'ts-optchain'
import 'ts-nameof'

declare global {
  var invariant: typeof _invariant
  var warning: typeof _warning
  var tsKeys: typeof keys
  var oc: typeof _oc
  var test1: any
  var item: any
  var itemIndex: any

  function Choose(): any;
  function When(props: { condition: boolean; }): any;
  function Otherwise(): any;
  function If(props: { condition: boolean; }): any;
  function For<T>(props: { each: string; of: Iterable<T>; index?: string; }): any;
  function With(props: { [id: string]: any; }): any;

  interface Window {
    __DEV__: boolean;
  }

  namespace JSX {

    interface IntrinsicAttributes {
      children?: any;
    }
  }

}


