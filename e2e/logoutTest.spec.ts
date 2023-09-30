import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  scrollDownTo,
  APIDeleteAccounts,
  scrollDownAndTap,
  signIn,
} from './helpers';

describe('Delete', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('account succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.other.button.logOut',
      'main.settings.index.view',
    );

    await scrollDownAndTap(
      'main.settings.logout.logout',
      'main.settings.logout.view',
    );
    await scrollDownTo(
      'onboarding.mentorlist.start',
      'main.settings.logout.view',
    );
    await expect(element(by.id('onboarding.mentorlist.start'))).toBeVisible();
  });

  it('has cancel button', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.other.button.logOut',
      'main.settings.index.view',
    );

    await scrollDownAndTap(
      'main.settings.logout.cancel',
      'main.settings.logout.view',
    );
    await expect(
      element(by.id('main.settings.other.button.logOut')),
    ).toBeVisible();
  });
});
