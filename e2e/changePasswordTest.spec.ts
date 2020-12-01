import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  waitAndTypeText,
  signIn,
  scrollUpTo,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('changePassword', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
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

    await scrollDownAndTap(
      'main.settings.account.password.button',
      'main.settings.index.view',
    );

    scrollUpTo(
      'main.settings.account.password.current',
      'main.settings.index.view',
    );

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

    await scrollDownAndTap(
      'main.settings.account.password.save',
      'main.settings.index.view',
    );

    // Logout the fast style
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp({ newInstance: true });

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
