import { device } from 'detox';

import * as j from '@jest/globals';

import { APIAdminAccessToken } from './helpers';

j.beforeAll(async () => {
  try {
    await APIAdminAccessToken();
  } catch (error) {
    console.error(
      'Cannot connect to YLITSE API. YLITSE_API_PASS=... YLITSE_MFA_SECRET=...',
    );
    process.exitCode = 1;
    throw error;
  }

  await device.launchApp({
    permissions: {
      notifications: 'YES',
    },
  });
});
