const { override, overrideDevServer, addWebpackResolve, watchAll, fixBabelImports, addBundleVisualizer, addBabelPlugins, disableEsLint } = require('customize-cra');

const _ = require('lodash').default;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');


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

const getResolveConfig = () => {
  // import path resolve see https://github.com/dividab/tsconfig-paths-webpack-plugin
  const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
  return addWebpackResolve({
    plugins: [new TsconfigPathsPlugin({ configFile: resolveApp('tsconfig.dev.json') })]
  })
}



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

const statements = require('tsx-control-statements').default;
const keysTransformer = require('ts-transformer-keys/transformer').default;
// 1. import default from the plugin module
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
// 2. create a transformer;
// the factory additionally accepts an options object which described below

const ts = require("typescript");
// 3. add getCustomTransformer method to the loader config
function useTsLoader() {
  return (config, evn) => {
    config.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
          options: {
            compiler: 'ttypescript',
            configFileName: resolveApp('tsconfig.dev.json'),
            transpileOnly: true,
            getCustomTransformers: (program) => ({
              before: [
                (program) => {
                  program.getCompilerOptions = new Proxy(program.getCompilerOptions, {
                    apply(target, thisArg, args) {
                      const options = Reflect.apply(target, thisArg, args)
                      Object.assign(options, {
                        "paths": {
                          "src/*": ["./src/*"],
                          "@/*": ["./src/*"],
                          "src": ["src"],
                          "@": ["src"]
                        },
                        "outDir": "./lib",
                        "declarationDir": "./types",
                        "allowJs": false,
                        "declaration": true,
                        "module": "esnext",
                        "target": "es5",
                        "sourceMap": true,
                        "noEmit": false,
                        "jsx": "react",
                        "skipLibCheck": true,
                        "isolatedModules": false
                      })
                      return options;
                    }
                  })
                  return (node) => {
                    const visitor = (node) => ts.visitEachChild(node, visitor, program);
                    return ts.visitNode(node, visitor)
                  }
                },
                statements(),
                createStyledComponentsTransformer()
              ]
            }),
            useCache: true,
            errorsAsWarnings: true,
            forceIsolatedModules: true,
          }
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.module.rules.push({
      test: /\.stories\.(ts|tsx)$/,
      loaders: [
        {
          loader: require.resolve('@storybook/addon-storysource/loader'),
          options: { 
            parser: 'typescript', 
            prettierConfig: {
              singleQuote: false,
              trailingComma: 'es5'
            }
          }
        },
      ],
      enforce: 'pre',
    });
    return config;
  };
}

module.exports = {
  globalEntry() {
    return config => config.entry.push(resolveApp('src/global/index.ts'))
  },
  getResolveConfig,
  useTsLoader,
  useCDNAuto,
  disableEsLint,
  addBabelPlugins,
  webpack: override(
    outputChange,
    disableEsLint(),
    useTsLoader(),
    useCDNAuto(),
    getResolveConfig(),
    // fixBabelImports("rxjs", {
    //   libraryDirectory: "",
    //   camel2DashComponentName: false
    // }),
    // addBabelPlugin(new UglifyJsPlugin()),
    ...addBabelPlugins(
      "jsx-control-statements",
      "styled-components",
      "babel-plugin-ts-nameof"
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
      libraryDirectory: '../_esm5/internal/operators',
      libraryName: 'rxjs/operators',
      camel2DashComponentName: false,
      transformToDefaultImport: false
    }),
    // fixBabelImports("rxjs/observable", {
    //   libraryDirectory: '_esm5/internal/observable',
    //   libraryName: 'rxjs',
    //   camel2DashComponentName: false,
    //   transformToDefaultImport: false,
    // }),
    fixBabelImports("element-react", {
      libraryName: "element-react",
      libraryDirectory: 'dist/npm/es6/src',
      styleLibraryName: "element-theme-default"
    }),
    // fixBabelImports("element-ui", {
    //   libraryName: 'element-ui',
    //   libraryDirectory: 'lib',
    //   camel2DashComponentName: true,
    //   style: (path) =>`element-ui/lib/theme-chalk/${
    //         _.kebabCase(basename(path, '.js'))}.css`,
    // }),
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