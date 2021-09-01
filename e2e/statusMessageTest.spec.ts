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
