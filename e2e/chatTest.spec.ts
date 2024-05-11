import { by, element, device, expect } from 'detox';
import { describe, it, beforeEach, expect as jestExpect } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIGetSendInfo,
  APIDeleteAccounts,
  APISendMessage,
  waitAndTypeText,
  signIn,
  forceLogout,
  detoxElementCount,
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

    const unseenDotsAmountBefore = await detoxElementCount(
      by.id('main.buddyList.button.unseenDot'),
    );
    jestExpect(unseenDotsAmountBefore).toBe(2);

    await element(by.text(mentee.displayName)).tap();
    await expect(element(by.text('Hello 0'))).toBeVisible();
    await expect(element(by.text('Hello 4'))).toBeVisible();

    await element(by.id('chat.back.button')).tap();

    const unseenDotsAmountAfter = await detoxElementCount(
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
});
