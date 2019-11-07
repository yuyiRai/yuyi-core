if (__DEV__) {
  window.invariant = require('tiny-invariant').default
  window.warning = require('tiny-warning').default
  window.tsKeys = () => []
  window.oc = require('ts-optchain').oc
  window.test1 = () => (
    <For of={[1, 2, 3]} each="item" index="itemIndex">
      <a style={{ background: 'red' }}>{itemIndex}</a>
    </For>
  );
  // console.log(nameof(window))
}