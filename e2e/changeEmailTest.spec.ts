import { by, element, expect, device, waitFor } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  waitAndTypeText,
  signIn,
  forceLogout,
} from './helpers';
import accountFixtures from './fixtures/accounts.json';

describe('changeEmail', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    const newEmail = 'other@email.com';
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();
    await element(by.id('main.settings.account.email.change')).tap();

    await element(by.id('main.settings.account.email.input')).clearText();
    await waitAndTypeText('main.settings.account.email.input', newEmail);
    await expect(element(by.text('Invalid email address'))).not.toBeVisible();
    await element(by.id('main.settings.account.email.save')).tap();
    await expect(element(by.text(newEmail))).toBeVisible();
  });

  it('for a mentee with invalid email', async () => {
    await forceLogout();
    const mentee = accountFixtures.mentees[0];
    const newEmail = 'other';
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();
    await element(by.id('main.settings.account.email.change')).tap();

    await element(by.id('main.settings.account.email.input')).clearText();
    await waitAndTypeText('main.settings.account.email.input', newEmail);
    await expect(element(by.text('Invalid email address'))).toBeVisible();

    await waitFor(element(by.id('main.settings.account.email.save')))
      .toBeVisible()
      .withTimeout(500);

    await element(by.id('main.settings.account.email.save')).tap();
    await element(by.id('main.settings.account.email.cancel')).tap();
    await expect(element(by.text(mentee.email))).toBeVisible();
  });
});
