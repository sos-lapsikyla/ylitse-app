import { by, element, expect, device, waitFor } from 'detox';
import {
  describe,
  it,
  beforeEach,
  beforeAll,
  afterEach,
  expect as jestExpect,
} from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  APISignUpMentor,
  APIGetSendInfo,
  APISendMessage,
  APIUpdateMentor,
  scrollDownAndTap,
  signIn,
  forceLogout,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Browse mentors', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });
  afterEach(async () => {
    await forceLogout();
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

  it('mentors are updated when user brings app from background', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await device.sendToHome();

    // create first mentor
    const mentor1 = accountFixtures.mentors[0];
    await APISignUpMentor(mentor1);

    await device.launchApp({ newInstance: false });

    await expect(element(by.id('components.mentorList'))).toBeVisible();
    await expect(
      element(by.text(accountFixtures.mentors[0].displayName)),
    ).toBeVisible();
  });

  it('updates the chat-partner (mentor) name when refetching', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // mentee sends a msg to mentor
    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi',
      headers: menteeHeaders,
    });

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();
    await element(by.text(mentor.displayName)).atIndex(0).tap();

    const newDisplayname = 'Updated';
    const updatedMentor = { ...mentor, displayName: newDisplayname };

    // update mentor
    await APIUpdateMentor(mentor.displayName, updatedMentor);

    // go to chats
    await element(by.id('chat.back.button')).tap();

    // the name will change in the chat
    await waitFor(element(by.text(newDisplayname)).atIndex(0))
      .toBeVisible()
      .withTimeout(5000);

    // go to back to the mentors view
    await element(by.id('tabs.mentors')).tap();

    // Name is changed in mentorList
    await expect(element(by.text(newDisplayname)).atIndex(0)).toBeVisible();
  });
});
