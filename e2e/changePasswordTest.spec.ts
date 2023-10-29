import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  waitAndTypeText,
  signIn,
  scrollUpTo,
  forceLogout,
} from './helpers';

describe('changePassword', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    const newPassword = 'newpass1';
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.account.password.change',
      'main.settings.index.view',
    );

    await scrollUpTo(
      'main.settings.account.password.current',
      'main.settings.password.view',
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
      'main.settings.password.view',
    );

    await forceLogout();

    await signIn({ loginName: mentee.loginName, password: newPassword });

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
