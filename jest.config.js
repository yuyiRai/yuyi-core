const config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    "^ttypescript/lib/(.*?)$": "<rootDir>/packages/ttypescript/src/$1",
    "^ttypescript$": "<rootDir>/packages/ttypescript/src/typescript",
    "^ttypescript-(.*?)$": "<rootDir>/packages/ttypescript-$1/src"
  },
  "snapshotSerializers": [
    "<rootDir>/node_modules/jest-serializer-enzyme",
    "<rootDir>/node_modules/jest-serializer-vue"
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  }
}
module.exports = function override(c){
  const keys = ['moduleNameMapper', 'snapshotSerializers', 'transform']
  for(const key of keys) {
    if(c[key] instanceof Object && config[key] instanceof Object) {
      c[key] = { ...c[key], ...config[key] }
    }
    if(c[key] instanceof Array && config[key] instanceof Array) {
      c[key] = [ ...c[key], ...config[key] ]
    }
  }
  console.log(c)
  return c
}
module.exports.config = config;