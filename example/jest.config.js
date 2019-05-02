const { resolve } = require('path');

module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['jest-enzyme'],
  testEnvironment: 'enzyme',
  globalSetup: resolve(__dirname, 'setup-test.js'),
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
};
