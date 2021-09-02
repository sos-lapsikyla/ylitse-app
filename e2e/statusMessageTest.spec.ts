import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentor,
  APIDeleteAccounts,
  signIn,
  waitAndTypeText,
  forceLogout,
  scrollDownAndTap,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Show status message', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentor successfully', async () => {
    const mentor1 = accountFixtures.mentors[0];
    await APISignUpMentor(mentor1);
    const mentor2 = accountFixtures.mentors[2];
    await APISignUpMentor(mentor2);

    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );

    // Show status message in mentor list...
    await expect(element(by.id('components.mentorList'))).toBeVisible();

    // for active mentor
    await expect(element(by.text(mentor1.displayName))).toBeVisible();
    await expect(element(by.text(mentor1.status_message))).toBeVisible();

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    // for vacationing mentor
    await expect(element(by.text(mentor2.displayName))).toBeVisible();
    await expect(element(by.text(mentor2.status_message))).toBeVisible();

    await forceLogout();
  });
});

describe('Change status message', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for a mentor successfully', async () => {
    const mentor = accountFixtures.mentors[2];
    const newStatusMessage = 'On vacation 1.7.-20.7.';
    await APISignUpMentor(mentor);

    await signIn(mentor);

    await element(by.id('tabs.settings')).tap();

    await scrollDownAndTap(
      'main.settings.account.status.title',
      'main.settings.index.view',
    );
    await expect(element(by.text(mentor.status_message))).toBeVisible();

    await element(by.id('main.settings.account.status.input')).clearText();
    await waitAndTypeText(
      'main.settings.account.status.input',
      newStatusMessage + '\n',
    );
    await scrollDownAndTap(
      'main.settings.account.status.save',
      'main.settings.index.view',
    );

    await expect(element(by.text(newStatusMessage))).toBeVisible();

    await forceLogout();
  });
});
