import { cleanup, init } from 'detox';
const adapter = require('detox/runners/jest/adapter');
const config = require('../.detoxrc.json');

// eslint-disable-next-line no-undef
jest.setTimeout(240000);
// eslint-disable-next-line no-undef
jasmine.getEnv().addReporter(adapter);

// eslint-disable-next-line no-undef
beforeAll(async () => {
  await init(config);
});

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await adapter.beforeEach();
});

// eslint-disable-next-line no-undef
afterAll(async () => {
  await adapter.afterAll();
  await cleanup();
});
