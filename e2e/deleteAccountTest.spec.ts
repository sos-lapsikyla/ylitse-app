import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Delete account', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.other.button.deleteAccount',
      'main.settings.index.view',
    );

    await scrollDownAndTap(
      'main.settings.deleteAccount.deleteAccount',
      'main.settings.deleteAccount.view',
    );

    await device.reloadReactNative();
    await signIn(mentee);

    await expect(
      element(by.id('components.loginCard.errorMessage')),
    ).toBeVisible();
  });

  it('can be cancelled', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.other.button.deleteAccount',
      'main.settings.index.view',
    );

    await scrollDownAndTap(
      'main.settings.deleteAccount.cancel',
      'main.settings.deleteAccount.view',
    );

    await expect(
      element(by.id('main.settings.other.button.deleteAccount')),
    ).toBeVisible();
  });
});
