import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIDeleteAccounts,
  signIn,
  waitAndTypeText,
  forceLogout,
  APIBan,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Filter chats', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  it('for normal succesfully', async () => {
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();

    await forceLogout();
  });

  it('for banned succesfully', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    await signIn(mentee);

    await element(by.text('Read more')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', 'Hi');
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await APIBan(mentor, mentee);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await expect(element(by.text(mentee.displayName))).toBeNotVisible();

    await element(by.id('main.buddylist.menu')).tap();
    await element(by.text('Banned chats')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();
  });
});
