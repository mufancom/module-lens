module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['bld/**/*.js', '!bld/**/@*.js'],
  testMatch: ['<rootDir>/bld/test/*.test.js'],
};
