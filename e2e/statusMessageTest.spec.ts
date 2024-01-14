import { by, element, expect, device } from 'detox';
import {
  describe,
  it,
  beforeEach,
  beforeAll,
  expect as jestExpect,
} from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentor,
  APIDeleteAccounts,
  signIn,
  waitAndTypeText,
  forceLogout,
  scrollDownAndTap,
} from './helpers';

describe('Show status message', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
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

    //@ts-ignore
    const statusMessages: Record<string, string> = {
      [mentor1.displayName]: mentor1.status_message,
      [mentor2.displayName]: mentor2.status_message,
    };

    const found = [];
    for (const mentorName of Object.keys(statusMessages)) {
      try {
        await expect(element(by.text(mentorName))).toBeVisible();
        await expect(
          element(by.text(statusMessages[mentorName])),
        ).toBeVisible();
        found.push(mentorName);
      } catch (error) {
        continue;
      }
    }

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    for (const mentorName of Object.keys(statusMessages)) {
      try {
        await expect(element(by.text(mentorName))).toBeVisible(50);
        await expect(
          element(by.text(statusMessages[mentorName])),
        ).toBeVisible();
        found.push(mentorName);
      } catch (error) {
        continue;
      }
    }

    const set = new Set(found);
    jestExpect(set.size).toEqual(2);

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
    // @ts-ignore
    await expect(element(by.text(mentor.status_message))).toBeVisible();

    await element(by.id('main.settings.account.status.input')).clearText();
    await waitAndTypeText(
      'main.settings.account.status.input',
      newStatusMessage,
      true,
    );
    await scrollDownAndTap(
      'main.settings.account.status.save',
      'main.settings.index.view',
      0.0,
      0.2,
    );

    await expect(element(by.text(newStatusMessage))).toBeVisible();

    await forceLogout();
  });
});
