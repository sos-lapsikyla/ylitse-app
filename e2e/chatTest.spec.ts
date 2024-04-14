import { by, element, device, expect } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIGetSendInfo,
  APISendMessage,
  APIDeleteAccounts,
  APIDeleteAccount,
  waitAndTypeText,
  signIn,
  forceLogout,
} from './helpers';

describe('Chat', () => {
  beforeAll(async () => {
    await device.launchApp();
    jest.setTimeout(200000);
  });
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });

  xit('with new mentor', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const message_from_mentee = 'Hi!';
    const message_from_mentor = 'Hello!';

    await signIn(mentee);

    await element(by.text('Show mentor')).tap();
    await element(by.text('Chat')).tap();

    await waitAndTypeText('main.chat.input.input', message_from_mentee, true);
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentee.displayName)).tap();

    await waitAndTypeText('main.chat.input.input', message_from_mentor, true);
    await element(by.id('main.chat.input.button')).tap();

    await forceLogout();

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();
    await element(by.text(mentor.displayName)).atIndex(0).tap();

    await expect(element(by.text(message_from_mentee))).toBeVisible();
    await expect(element(by.text(message_from_mentor))).toBeVisible();
  });

  it('if buddy with most recent message deletes account, can receive still messages from other users', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    // mentee sends a msg to mentor
    const {
      sender_id: menteeId,
      sender_info: mentee_info,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);
    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi first',
      headers: menteeHeaders,
    });

    await signIn(mentor);
    await element(by.id('tabs.chats')).tap();
    await element(by.text(mentee.displayName)).tap();
    await element(by.id('chat.back.button')).tap();

    // delete mentee account
    await APIDeleteAccount(mentee_info.account_id, menteeHeaders)

    // new mentee
    const newMentee = accountFixtures.mentees[1];
    await APISignUpMentee(newMentee);
    const {
      sender_id: newMenteeId,
      senderHeaders: newMenteeHeaders,
    } = await APIGetSendInfo(newMentee, mentor);
    await APISendMessage({
      sender_id: newMenteeId,
      recipient_id: mentorId,
      content: 'Hi second',
      headers: newMenteeHeaders,
    });
  });
});
