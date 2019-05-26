const paths = require('./paths');
const ts = require('typescript');
function getTtypescript() {
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
          "jsx": "preserve",
          "moduleResolution": "node",
          "target": "es6",
        })
        console.log(options)
        return options;
      }
    })
    return (node) => {
      const visitor = (node) => ts.visitEachChild(node, visitor, program);
      return ts.visitNode(node, visitor)
    }
  }
}
// webpack.config.js
const keysTransformer = require('ts-transformer-keys/transformer').default;
module.exports = function(){
  return {
    test: /\.(ts|tsx)$/,
    include: paths.appSrc,
    enforce: 'pre',
    use: [{
      loader: require.resolve('awesome-typescript-loader'),
      options: {
        "configFileName": paths.appTsConfigDev,
        "transpileOnly": true
      }
    }, {
      loader: require.resolve('awesome-typescript-loader'),
      options: {
        "compiler": "ttypescript",
        "useCache": true,
        "transpileOnly": true,
        "errorsAsWarnings": true,
        "forceIsolatedModules": true,
        "configFileName": paths.appTsConfig,
        getCustomTransformers: (program) => ({
          before: [
            (program) => {
              keysTransformer(program)
              program.getCompilerOptions = new Proxy(program.getCompilerOptions, {
                apply(target, thisArg, args) {
                  const options = Reflect.apply(target, thisArg, args)
                  Object.assign(options, {
                    "paths": {
                      "src/*": ["./*"],
                      "@/*": ["./*"],
                      "src": ["./"],
                      "@": ["./"]
                    }
                  })
                  options.plugins = options.plugins.filter(i=>!i.del && i.transform!=='ts-import-plugin').concat([])
                  return options;
                }
              })
              return (node) => {
                const visitor = (node) => ts.visitEachChild(node, visitor, program);
                return ts.visitNode(node, visitor)
              }
            }
          ]
        }),
      }
    }, {
      loader: require.resolve('react-docgen-typescript-loader')
    }]
  }
}