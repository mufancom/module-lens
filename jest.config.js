module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['bld/**/*.js', '!bld/**/@*.js'],
  testMatch: ['bld/test/*.test.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
