const { defaults: tsjPreset, jsWithTs, jsWithBabel } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
const pkg = require("./package.json")
// console.error(pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }));
module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "jest-environment-jsdom-fourteen",
  "coverageDirectory": `../../reports/${pkg.name.split('\/')[1]}/coverage`,
  "rootDir": __dirname,
  "collectCoverageFrom": [
    "<rootDir>/src/**"
  ],
  "setupFiles": [
    require.resolve("react-app-polyfill/jsdom"),
    require.resolve("./config/dev.env.js")
  ],
  "setupFilesAfterEnv": [require.resolve("./src/Constransts.ts")],
  "testMatch": [
    "<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  "testPathIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$",
    "<rootDir>/node_modules/",
    "[/\\\\]node_modules[/\\\\]"
  ],
  "extraGlobals": [],
  "transform": {
    '^.+\\.(ts|jsx)$': 'ts-jest',
    "^.+\\.(js|jsx)$": "<rootDir>/../night/config/jest/babelTransform.js",
    "^.+\\.css$": "<rootDir>/../night/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|sass|scss|json)$)": "<rootDir>/../night/config/jest/fileTransform.js"
  },
  "transformIgnorePatterns": [
    "\\\\node_modules\\\\"
  ],
  "moduleNameMapper": {
    '^@/(.*)$': "<rootDir>/src/$1",
    '^src/(.*)$': "<rootDir>/src/$1",
  },
  "cacheDirectory": `../../reports/${pkg.name.split('\/')[1]}/jest_tmp/`,
  "coveragePathIgnorePatterns": [
    "node_modules/",
    "./node_modules/",
    "NodeUtils",
    "TestUtils",
    "WasmLoader",
    "test/"
  ],
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx",
    "json",
    "jsx",
    "node"
  ],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  globals: {
    "__DEV__": "true",
    // 'ts-jest': {
    //   compiler: 'typescript',
    //   config: 'tsconfig.json',
    //   isolatedModules: false
    // }
  }
  // "snapshotSerializers": [
  //   "<rootDir>/node_modules/jest-serializer-enzyme",
  //   "<rootDir>/node_modules/jest-serializer-vue"
  // ]
}
