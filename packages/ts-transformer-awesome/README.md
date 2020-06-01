# @yuyi919/ts-transformer-awesome
[![npm](https://img.shields.io/npm/v/@yuyi919/ts-transformer-awesome.svg)](https://www.npmjs.com/package/@yuyi919/ts-transformer-awesome)
[![npm](https://img.shields.io/npm/dw/@yuyi919/ts-transformer-awesome.svg?colorB=ff0033)](https://www.npmjs.com/package/@yuyi919/ts-transformer-awesome)

## What is CustomTransformer ?

```ts
interface CustomTransformers {
  /** Custom transformers to evaluate before built-in .js transformations. */
  before?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
  /** Custom transformers to evaluate after built-in .js transformations. */
  after?: (TransformerFactory<SourceFile> | CustomTransformerFactory)[];
  /** Custom transformers to evaluate after built-in .d.ts transformations. */
  afterDeclarations?: (TransformerFactory<Bundle | SourceFile> | CustomTransformerFactory)[];
}

```
## Api

```ts
const { getCustomTransformers } = require('@yuyi919/ts-transformer-awesome')

// ts.createProgram(...)
getCustomTransformers({
  program, // ts.Program
  importLibs: [
    'lodash',
    ['@material-ui/core', {
      libraryDirectory: '',
      camel2DashComponentName: false
    }]
  ] // use ts-import-plugin
  // ...
}) // { before: [...], after: [...] }

``` 

## global env
```ts
import '@yuyi919/ts-transformer-awesome/env'

```

# Basic

## ts-nameof
```ts


```
点击[此处](https://github.com/dsherret/ts-nameof/tree/master/packages/ts-nameof)查看更多

## ts-transformer-keys

就像使用`ts-transformer-keys`一样
```ts
interface A {
  a: number;
  b: number;
}
tsKeys<A>() // => ["a", "b"]
```

点击[此处](https://github.com/kimamula/ts-transformer-keys)查看更多

### tsx-control-statements
就像使用`tsx-control-statements`一样
```tsx
// 转换前
const TsxControlStatments = () => {
  return (
    <For of={[1, 2, 3]} each="item" index="itemIndex">
      <a style={{ background: 'red' }}>{itemIndex}{item}</a>
    </For>
  );
}

// 转换后
var TsxControlStatments = () => {
  return Array.from([1, 2, 3], function (item, itemIndex) {
    return React.createElement("a", {
      style: __$hoisted_o0
      /**
       * 此处是`@avensia-oss/ts-transform-hoist-objects-in-props`在发挥作用 
       */
    }, itemIndex);
  });
}
// 自动静态化转译
var __$hoisted_o0 = {
  background: 'red'
};

```
点击[此处](https://github.com/KonstantinSimeonov/tsx-control-statements)查看更多

