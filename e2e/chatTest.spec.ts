import { by, element, device, expect } from 'detox';
import { describe, it, beforeEach, expect as jestExpect } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIGetSendInfo,
  APIDeleteAccounts,
  APIDeleteAccount,
  APISendMessage,
  waitAndTypeText,
  signIn,
  forceLogout,
  countElements,
  sleep,
  scrollUpAndFindText,
} from './helpers';

describe('Chat', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.reloadReactNative();
  });
  afterEach(async () => {
    await forceLogout();
  });

  it('with new mentor', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const message_from_mentee = 'Hi!';
    const message_from_mentor = 'Hello!';

    await signIn(mentee);

    await element(by.id('components.mentorCard.readMore')).tap();
    await element(by.id('main.mentorCardExpanded.button')).tap();

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

  const sendMultiple = async (
    from: string,
    to: string,
    headers: { Authorization: string },
    content: string,
    amount: number,
  ) => {
    for (let i = 0; i < amount; i++) {
      await APISendMessage({
        sender_id: from,
        recipient_id: to,
        content: `${content} ${i}`,
        headers,
      });
    }
  };

  it('marks message unseen', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentee2 = accountFixtures.mentees[1];
    await APISignUpMentee(mentee2);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);
    await sendMultiple(menteeId, mentorId, menteeHeaders, 'Hello', 5);

    const { sender_id: mentee2Id, senderHeaders: mentee2Headers } =
      await APIGetSendInfo(mentee2, mentor);
    await sendMultiple(mentee2Id, mentorId, mentee2Headers, 'Hello', 10);

    await signIn(mentor);
    await element(by.id('tabs.chats')).tap();

    const unseenDotsAmountBefore = await countElements(
      by.id('main.buddyList.button.unseenDot'),
    );
    jestExpect(unseenDotsAmountBefore).toBe(2);

    await element(by.text(mentee.displayName)).tap();
    await expect(element(by.text('Hello 0'))).toBeVisible();
    await expect(element(by.text('Hello 4'))).toBeVisible();

    await element(by.id('chat.back.button')).tap();

    const unseenDotsAmountAfter = await countElements(
      by.id('main.buddyList.button.unseenDot'),
    );
    jestExpect(unseenDotsAmountAfter).toBe(1);
  });

  it('marks message unseen only if fully visible', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);
    await sendMultiple(menteeId, mentorId, menteeHeaders, 'Hello', 10);

    await signIn(mentor);
    await element(by.id('tabs.chats')).tap();
    await element(by.text(mentee.displayName)).tap();

    await expect(element(by.text('Hello 0'))).not.toBeVisible();
    await expect(element(by.text('Hello 9'))).toBeVisible();

    await element(by.id('chat.back.button')).tap();
    await expect(element(by.id('main.tabs.unseenDot'))).toBeVisible();
  });

  it('loads more messages if all newest unread', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentor = accountFixtures.mentors[0];
    await APISignUpMentor(mentor);

    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);
    await sendMultiple(menteeId, mentorId, menteeHeaders, 'Hello', 20);

    await signIn(mentor);
    await element(by.id('tabs.chats')).tap();

    // wait for 2 message-polls, so all messages are fetched
    await sleep(10);
    await element(by.text(mentee.displayName)).tap();
    await expect(element(by.text('Hello 19'))).toBeVisible();
    await scrollUpAndFindText('Hello 0', 'main.buddy.messageList');
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
    await APIDeleteAccount(mentee_info.account_id, menteeHeaders);

    // new mentee
    const newMentee = accountFixtures.mentees[1];
    await APISignUpMentee(newMentee);

    const { sender_id: newMenteeId, senderHeaders: newMenteeHeaders } =
      await APIGetSendInfo(newMentee, mentor);
    await APISendMessage({
      sender_id: newMenteeId,
      recipient_id: mentorId,
      content: 'Hi second',
      headers: newMenteeHeaders,
    });

    await sleep(5);
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();
    await element(by.text(newMentee.displayName)).tap();
    await waitFor(element(by.text('Hi second')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
