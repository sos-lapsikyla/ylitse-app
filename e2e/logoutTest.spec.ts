import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  scrollDownTo,
  APIDeleteAccounts,
  scrollDownAndTap,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Delete', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('account succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

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
    await scrollDownAndTap(
      'onboarding.selectTopic.skip',
      'onboarding.selectTopic.view',
    );

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
