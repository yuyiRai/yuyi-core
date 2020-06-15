import { } from '@yuyi919/ts-transformer-awesome/env'
import { } from 'ts-nameof'
if (__DEV__) {
  window.invariant = require('tiny-invariant').default;
  window.warning = require('tiny-warning').default;

  window.tsKeys = () => [];
  window.oc = require('ts-optchain').oc;
  (window as any).test1 = function() {
    return (
      <For of={[1, 2, 3]} each="item" index="itemIndex">
        <a style={{ background: 'red' }}>{itemIndex}{item}</a>
      </For>
    );
  }
  // console.log(nameof(window))
}
