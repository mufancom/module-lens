module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['bld/**/*.js', '!bld/**/@*.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
      isolatedModules: true,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/test/*.test.(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
