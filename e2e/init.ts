import { cleanup, init } from 'detox';
import { Jasmine } from 'jest-jasmine2/build/types';

const adapter = require('detox/runners/jest/adapter');
const config = require('../.detoxrc.json');

import * as j from '@jest/globals';
declare const jasmine: Jasmine;

import { APIAdminAccessToken } from './helpers';

j.jest.setTimeout(240000);
jasmine.getEnv().addReporter(adapter);

j.beforeAll(async () => {
  try {
    await APIAdminAccessToken();
  } catch (error) {
    console.error(
      'Cannot connect to YLITSE API. YLITSE_API_USER=... YLITSE_API_PASS=... YLITSE_API_URL=...',
    );
    process.exit(1);
  }

  await init(config, { initGlobals: false });
});

j.beforeEach(async () => {
  await adapter.beforeEach();
});

j.afterAll(async () => {
  await adapter.afterAll();
  await cleanup();
});
