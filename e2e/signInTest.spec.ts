import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  signIn,
  forceLogout,
} from './helpers';

describe('SignIn', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });
  afterEach(async () => {
    await forceLogout();
  });

  it('mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();
    await expect(element(by.id('main.settings.account.userName'))).toHaveText(
      mentee.loginName,
    );
    await expect(
      element(by.id('main.settings.account.displayName')),
    ).toHaveText(mentee.displayName);
    await expect(element(by.id('main.settings.account.email'))).toHaveText(
      mentee.email,
    );
  });
});
