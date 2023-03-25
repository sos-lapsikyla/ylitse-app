module.exports = {
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/e2e/init.ts'],
  bail: 1,
  testTimeout: 120000,
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  verbose: true,
  preset: 'ts-jest',
  reporters: ['detox/runners/jest/reporter'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: './babel.config.js',
      },
    ],
  },
};
