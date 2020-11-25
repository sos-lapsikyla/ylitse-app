import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  waitAndTypeText,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('changePassword', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
    await device.disableSynchronization();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    const newPassword = 'newpass';
    await APISignUpMentee(mentee);

    await signIn(mentee);
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

    await element(by.id('tabs.settings')).tap();
    await element(by.id('main.settings.account.password.button')).tap();

    await waitAndTypeText(
      'main.settings.account.password.current',
      `${mentee.password}\n`,
    );
    await waitAndTypeText(
      'main.settings.account.password.new',
      `${newPassword}\n`,
    );
    await waitAndTypeText(
      'main.settings.account.password.repeat',
      `${newPassword}\n`,
    );
    await element(by.id('main.settings.account.password.save')).tap();

    // Logout the fast style
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp({ newInstance: true });
    await device.disableSynchronization();

    await signIn({ loginName: mentee.loginName, password: newPassword });
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
