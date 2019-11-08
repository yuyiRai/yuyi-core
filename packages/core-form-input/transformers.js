const tsImportPluginFactory = require('ts-import-plugin');
const transformers = ({ program }, config) => {
  const list = [
    require('tsx-control-statements/transformer').default(program),
    require('ts-transformer-keys/transformer').default(program),
    require('ts-optchain/transform').default(program),
    require('@avensia-oss/ts-transform-hoist-objects-in-props')(program, {
      propRegex: /.*/,
    }),
    require('ts-nameof'),
    tsImportPluginFactory([
      {
        libraryName: '@material-ui/core',
        libraryDirectory: '',
        camel2DashComponentName: false
      },
      {
        "style": false,
        "libraryName": "@material-ui/icons",
        "libraryDirectory": "",
        "camel2DashComponentName": false
      },
      {
        "style": false,
        "libraryName": "lodash",
        "libraryDirectory": "",
        "camel2DashComponentName": false
      }
    ])
  ];
  return ({
    before: list
  });
}
module.exports = {
  transformers
}