import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, expect as jestExpect } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  scrollDownAndTap,
  APISignUpMentor,
  signIn,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Browse mentors', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('without login', async () => {
    await APISignUpMentor(accountFixtures.mentors[0]);
    await APISignUpMentor(accountFixtures.mentors[1]);
    await APISignUpMentor(accountFixtures.mentors[2]);

    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );

    await expect(element(by.id('components.mentorList'))).toBeVisible();

    // Try to find a mentor from 3 possibilities. Swipe and repeat.
    // 3 mentors so we need 2 swipes.
    let mentorsFound = {
      [accountFixtures.mentors[0].displayName]: false,
      [accountFixtures.mentors[1].displayName]: false,
      [accountFixtures.mentors[2].displayName]: false,
    };
    const mentorIndexes = [0, 1, 2];
    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }
    const expectedMentors = {
      [accountFixtures.mentors[0].displayName]: true,
      [accountFixtures.mentors[1].displayName]: true,
      [accountFixtures.mentors[2].displayName]: true,
    };
    jestExpect(mentorsFound).toEqual(expectedMentors);
  });

  it('after login', async () => {
    const mentor1 = accountFixtures.mentors[0];
    await APISignUpMentor(mentor1);

    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await expect(element(by.text(mentor1.displayName))).toBeVisible();
    await element(by.text('Read more')).tap();
    await element(by.id('components.mentorTitle.chevronLeft')).tap();

    await expect(element(by.id('components.mentorList'))).toBeVisible();
  });
});
