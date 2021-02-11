import { by, element, device, expect } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIDeleteAccounts,
  waitAndTypeText,
  signIn,
  forceLogout,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Chat', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('with new mentor', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const message_from_mentee = 'Hi!';
    const message_from_mentor = 'Hello!';

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', message_from_mentee);
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentee.displayName)).tap();

    await waitAndTypeText('main.chat.input.input', message_from_mentor);
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();
    await element(by.text(mentor.displayName))
      .atIndex(0)
      .tap();

    await expect(element(by.text(message_from_mentee))).toBeVisible();
    await expect(element(by.text(message_from_mentor))).toBeVisible();
  });
});
