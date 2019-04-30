const { override, overrideDevServer, removeModuleScopePlugin, watchAll, fixBabelImports, addBundleVisualizer, addBabelPlugins, disableEsLint } = require('customize-cra');
const statements = require('tsx-control-statements').default;
const UglifyJSPlugin= require('uglifyjs-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');

// 1. import default from the plugin module
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
// 2. create a transformer;
// the factory additionally accepts an options object which described below
const styledComponentsTransformer = createStyledComponentsTransformer();

const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const outputChange = config => {
  if (process.env.NODE_ENV === "production") {
    const custom = {
      path: resolveApp('build'),
      pathinfo: true,
      futureEmitAssets: false,
      filename: '[name].js',
      libraryExport: "default",
      library: 'yuyi-core',
      libraryTarget: 'umd'
    }
    config.entry = {
      "index": resolveApp('src/index.ts'),
      "index.min": resolveApp('src/index.ts')
    }
    config.output = custom //Object.assign(config.output, config)
    config.optimization = {
      minimize: true,
      minimizer: [
        new UglifyJSPlugin({
          include: /\.min\.js$/,
        }),
      ],
    }
    // config.plugins = []
    return addBundleVisualizer()(config);
  }
  return config
};
// 3. add getCustomTransformer method to the loader config

module.exports = {
  webpack: override(
    outputChange,
    disableEsLint(),
    useTsLoader(),
    useCDNAuto(),
    // fixBabelImports("rxjs", {
    //   libraryDirectory: "",
    //   camel2DashComponentName: false
    // }),
    // addBabelPlugin(new UglifyJsPlugin()),
    ...addBabelPlugins(
      "jsx-control-statements",
      "styled-components"
    ),
    fixBabelImports("lodash", {
      libraryName: "lodash",
      libraryDirectory: "",
      camel2DashComponentName: false
    }),
    // fixBabelImports("rxjsoperators", {
    //   libraryName: "rxjs",
    //   libraryDirectory: "_esm5/internal",
    //   camel2DashComponentName: false
    // }),
    fixBabelImports("rxjs/operator", {
      "transform": "rxjs/operator/${member}",
      "preventFullImport": true,
      "camelCase": true,
      "skipDefaultConversion": true
    }),
    fixBabelImports("element-react", {
      libraryName: "element-react",
      libraryDirectory: 'dist/npm/es6/src',
      styleLibraryName: "element-theme-default"
    }),
    fixBabelImports("element-ui", {
      libraryName: "element-ui",
      styleLibraryName: "theme-chalk"
    }),
    fixBabelImports('antd', {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: 'css',
    })
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};

function useCDNAuto() {
  return config => {
    if (process.env.NODE_ENV !== "production") {
      // config.externals = Object.assign({}, config.externals || {}, {
      //   'react': 'React',
      //   'react-dom': 'ReactDom',
      //   'vue': 'Vue',
      //   'element-ui': 'element-ui'
      // })
      config.plugins.push(new DynamicCdnWebpackPlugin({
        only: [
          'react',
          'react-dom',
          'vue'
        ]
      }));
    }
    return config;
  };
}

function useTsLoader() {
  return config => {
    config.module.rules.unshift({
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      options: {
        transpileOnly: true,
        getCustomTransformers: () => ({ before: [statements(), styledComponentsTransformer] })
      }
    });
    return config;
  };
}
