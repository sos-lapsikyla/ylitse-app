import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APISignUpMentor,
  APIDeleteAccounts,
  APISendMessage,
  APIGetSendInfo,
  signIn,
  forceLogout,
  waitAndTypeText,
} from './helpers';

describe('reportUser', () => {
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

  it('can report a mentor user', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // Lets send some messages between users
    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
      recieverHeaders: mentorHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi',
      headers: menteeHeaders,
    });

    await APISendMessage({
      sender_id: mentorId,
      recipient_id: menteeId,
      content: 'Well hello there!',
      headers: mentorHeaders,
    });

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentor.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Report')).tap();

    await expect(element(by.text('Reason for reporting *'))).toBeVisible();

    const descriptionTestId = 'main.userreport.description.input';
    const contactTestId = 'main.userreport.contact.input';
    const reportReason = 'Harrasment';
    const contactInfo = 'my@email.com';

    await waitAndTypeText(descriptionTestId, reportReason);
    await waitAndTypeText(contactTestId, contactInfo);

    await element(by.text('Send')).tap();

    // After sending we are back at the chat-view
    await expect(element(by.text(mentor.displayName))).toBeVisible();
    await expect(element(by.text('Reason for reporting *'))).not.toBeVisible();
  });

  it('can go back from user report screen', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // Lets send some messages between users
    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
      recieverHeaders: mentorHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi',
      headers: menteeHeaders,
    });

    await APISendMessage({
      sender_id: mentorId,
      recipient_id: menteeId,
      content: 'Well hello there!',
      headers: mentorHeaders,
    });

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentor.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Report')).tap();

    await expect(element(by.text('Reason for reporting *'))).toBeVisible();

    await element(by.id('main.userreport.back.button')).tap();

    await expect(element(by.text('Reason for reporting *'))).not.toBeVisible();
    await expect(element(by.text(mentor.displayName))).toBeVisible();
  });

  it('reason is mandatory for sending', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // Lets send some messages between users
    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
      recieverHeaders: mentorHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi',
      headers: menteeHeaders,
    });

    await APISendMessage({
      sender_id: mentorId,
      recipient_id: menteeId,
      content: 'Well hello there!',
      headers: mentorHeaders,
    });

    await signIn(mentee);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentor.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await element(by.text('Report')).tap();

    await expect(element(by.text('Reason for reporting *'))).toBeVisible();

    const descriptionTestId = 'main.userreport.description.input';
    const contactTestId = 'main.userreport.contact.input';
    await element(by.id(descriptionTestId)).clearText();
    await element(by.id(contactTestId)).tap();

    // Now we see error
    await expect(
      element(by.text('The reason for reporting is a mandatory field.')),
    ).toBeVisible();

    // If no reason, sending is disabled
    await element(by.text('Send')).tap();
    await expect(element(by.text('Reason for reporting *'))).toBeVisible();
  });

  it('reporting is not available for mentor-users', async () => {
    const mentor = accountFixtures.mentors[1];
    await APISignUpMentor(mentor);
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    // Lets send some messages between users
    const {
      sender_id: menteeId,
      recipient_id: mentorId,
      senderHeaders: menteeHeaders,
      recieverHeaders: mentorHeaders,
    } = await APIGetSendInfo(mentee, mentor);

    await APISendMessage({
      sender_id: menteeId,
      recipient_id: mentorId,
      content: 'Hi',
      headers: menteeHeaders,
    });

    await APISendMessage({
      sender_id: mentorId,
      recipient_id: menteeId,
      content: 'Well hello there!',
      headers: mentorHeaders,
    });

    await signIn(mentor);

    await element(by.id('tabs.chats')).tap();

    await element(by.text(mentee.displayName)).atIndex(0).tap();
    await element(by.id('main.chat.title.kebabicon')).tap();
    await expect(element(by.text('Report'))).not.toBeVisible();
  });
});
