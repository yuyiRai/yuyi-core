const { defaults: tsjPreset, jsWithTs, jsWithBabel } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
// console.error(pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }));

module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "jest-environment-jsdom-fourteen",
  // "collectCoverageFrom": [
  //   "src/**/*.{ts}",
  //   "!src/**/*.d.ts"
  // ],
  "setupFiles": [
    require.resolve("react-app-polyfill/jsdom"),
    require.resolve("./config/dev.env.js")
  ],
  "rootDir": process.cwd(),
  // "setupFilesAfterEnv": ["./src/Constransts.ts"],
  "testMatch": [
    "<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  "testPathIgnorePatterns": [
    "[/\\\\]node_modules/",
    "<rootDir>/node_modules/"
  ],
  // "extraGlobals": ["React"],
  "transform": {
    '^.+\\.(ts|jsx)$': 'ts-jest',
    "^.+\\.(js|jsx)$": "<rootDir>/../night/config/jest/babelTransform.js",
    "^.+\\.css$": "<rootDir>/../night/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|sass|scss|json)$)": "<rootDir>/../night/config/jest/fileTransform.js"
  },
  "moduleNameMapper": {
    '^@/(.*)$': "<rootDir>/src/$1",
    '^src/(.*)$': "<rootDir>/src/$1",
  },
  "cacheDirectory": "/jest_tmp/",
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/"
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
