import { keys } from 'ts-transformer-keys'
import { oc as _oc } from 'ts-optchain'
import 'ts-nameof'

declare global {
  var tsKeys: typeof keys
  var oc: typeof _oc
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


