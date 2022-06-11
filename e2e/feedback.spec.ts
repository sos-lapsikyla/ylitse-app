import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  APICreateQuestion,
  signIn,
  forceLogout,
} from './helpers';

import { questions } from './fixtures/questions';

const accountFixtures = require('./fixtures/accounts.json');

describe('Feedback', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('can dismiss a question', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const firstQuestion = questions[0];

    // create one question
    await APICreateQuestion(firstQuestion);

    // mentee sign in
    await signIn(mentee);

    const { titles } = firstQuestion.rules;
    // the Question is rendered on the Screen
    expect(element(by.text(titles.en))).toBeVisible();

    // close the question
    await element(by.id('questionModal.close.icon')).tap();

    // the title has disappeared
    await expect(element(by.text(titles.en))).not.toBeVisible();
    await forceLogout();
  });
});
