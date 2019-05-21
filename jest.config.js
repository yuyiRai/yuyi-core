const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFiles: ['<rootDir>/src/global'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  // "snapshotSerializers": [
  //   "<rootDir>/node_modules/jest-serializer-enzyme",
  //   "<rootDir>/node_modules/jest-serializer-vue"
  // ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      compiler: 'ttypescript'
    }
  }
}
module.exports = function override(c){
  const keys = ['moduleNameMapper', 'snapshotSerializers', 'setupFiles', 'globals']
  for(const key of keys) {
    if(c[key] instanceof Array && config[key] instanceof Array) {
      c[key] = [ ...c[key], ...config[key] ]
    }
    if(c[key] instanceof Object && config[key] instanceof Object) {
      c[key] = { ...c[key], ...config[key] }
    }
    if(!c[key]) {
      c[key] = config[key]
    }
  }
  c.preset = config.preset
  // c.moduleFileExtensions = c.moduleFileExtensions.sort((a,b) => {
  //   if(a.indexOf('\.ts')) {
  //     return 1
  //   }
  //   if(b.indexOf('\.ts')) {
  //     return -1
  //   }
  //   return 0
  // })
  // c.transform = {...config.transform, ...c.transform}
  // // const a = c.transform['^.+\\.(js|jsx|ts|tsx)$']
  // // delete c.transform['^.+\\.(js|jsx|ts|tsx)$']
  // // c.transform['^.+\\.(js|jsx)$'] = a
  console.log(c)
  return c
}
module.exports.config = config;