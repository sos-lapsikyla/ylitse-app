import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Delete account', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

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
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

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
