module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/src/controllers/emailConfirmation/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['./src/utils/test_setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
};
