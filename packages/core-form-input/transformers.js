const tsImportPluginFactory = require('ts-import-plugin');
const transformers = [
  (service, config) => {
    
    const list = [
      require('tsx-control-statements/transformer').default(service.getProgram()),
      require('ts-transformer-keys/transformer').default(service.getProgram()),
      require('ts-optchain/transform').default(service.getProgram()),
      require('@avensia-oss/ts-transform-hoist-objects-in-props')(service.getProgram(), {
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
];
module.exports = {
  transformers
}