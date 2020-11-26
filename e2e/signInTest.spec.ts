import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('SignIn', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

    await element(by.id('tabs.settings')).tap();
    await expect(element(by.id('main.settings.account.userName'))).toHaveText(
      mentee.loginName,
    );
    await expect(element(by.id('main.settings.account.nickName'))).toHaveText(
      mentee.displayName,
    );
    await expect(element(by.id('main.settings.account.email'))).toHaveText(
      mentee.email,
    );
  });
});
