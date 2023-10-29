import { by, element, expect, device, waitFor } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIDeleteAccounts,
  APISendMessage,
  APIGetSendInfo,
  signIn,
  forceLogout,
  APIBan,
} from './helpers';

describe('Banning', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('can ban a contact', async () => {
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

    // mentor side
    await signIn(mentor);

    // not banned yet, should show new message indicator
    await expect(element(by.id('main.tabs.unseenDot'))).toBeVisible();
    await element(by.id('tabs.chats')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).toBeVisible();

    // mentor bans the mentee
    await element(by.text(mentee.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Ban chat')).tap();
    await element(by.text('Ban')).tap();

    await expect(element(by.text(mentee.displayName))).not.toBeVisible();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();

    await forceLogout();

    // mentee sends another msg to mentor
    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Notice me Senpai!',
      headers: menteeHeaders,
    });

    // mentor should not see new message indicator
    await signIn(mentor);
    await expect(element(by.id('main.tabs.unseenDot'))).not.toBeVisible();
    await element(by.id('tabs.chats')).tap();
    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).not.toBeVisible();

    // but new msg should still be there
    await element(by.text(mentee.displayName)).atIndex(0).tap();
    await expect(element(by.text('Notice me Senpai!'))).toBeVisible();
    await forceLogout();
  });

  it('can restore banned contact', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

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

    await APIBan(mentor, mentee);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.text(mentee.displayName)).tap();

    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Restore chat')).tap();

    await element(by.text('Restore')).tap();

    await waitFor(element(by.id('main.folderedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.folderedlist.back.button')).tap();

    await expect(element(by.text(mentee.displayName))).toBeVisible();

    await forceLogout();
  });

  it('can delete banned contact', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

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

    await APIBan(mentor, mentee);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.text(mentee.displayName)).tap();

    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Delete chat')).tap();

    await element(by.text('Delete')).tap();

    // mentor should not see mentee's name in banned list
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();

    await waitFor(element(by.id('main.folderedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.folderedlist.back.button')).tap();

    // mentor should not see mentee's name in chats list
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();

    await forceLogout();

    // mentee can send another msg to mentor
    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Notice me Senpai!',
      headers: menteeHeaders,
    });

    // mentor should not see new message indicator
    await signIn(mentor);
    await expect(element(by.id('main.tabs.unseenDot'))).not.toBeVisible();
    await element(by.id('tabs.chats')).tap();
    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();
    await expect(
      element(by.id('main.buddyList.button.unseenDot')),
    ).not.toBeVisible();

    // mentor should not see mentee's name in chats list
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();

    await forceLogout();
  });

  it('can delete all banned contacts', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    const mentee2 = accountFixtures.mentees[1];
    await APISignUpMentee(mentee2);

    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Notice me Senpai!',
      headers: menteeHeaders,
    });

    const {
      sender_id: mentee2Id,
      recipient_id: mentor2Id,
      senderHeaders: mentee2Headers,
    } = await APIGetSendInfo(mentee2, mentor);

    await APISendMessage({
      sender_id: mentee2Id,
      recipient_id: mentor2Id,
      content: 'Notice me Senpai!',
      headers: mentee2Headers,
    });

    await APIBan(mentor, mentee);
    await APIBan(mentor, mentee2);

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.id('main.buddylist.kebabicon')).tap();
    await element(by.text('Banned')).tap();

    await element(by.id('main.folderedlist.kebabicon')).tap();
    await element(by.text('Delete all')).tap();

    await element(by.text('Delete')).tap();

    // mentor should not see mentees' names in banned list
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();
    await expect(element(by.text(mentee2.displayName))).not.toBeVisible();

    await waitFor(element(by.id('main.folderedlist.back.button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('main.folderedlist.back.button')).tap();

    // mentor should not see mentees' names in chats list
    await expect(element(by.text(mentee.displayName))).not.toBeVisible();
    await expect(element(by.text(mentee2.displayName))).not.toBeVisible();

    await forceLogout();
  });
});
