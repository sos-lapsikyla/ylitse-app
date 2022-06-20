import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  APICreateQuestion,
  APIDeleteQuestions,
  signIn,
  forceLogout,
} from './helpers';

import { questions } from './fixtures/questions';

const accountFixtures = require('./fixtures/accounts.json');

describe('Feedback', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await APIDeleteQuestions();
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('can dismiss questions', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const firstQuestion = questions[0];
    const secondQuestion = questions[1];

    // create both questions
    await APICreateQuestion(firstQuestion);
    await APICreateQuestion(secondQuestion);

    // mentee sign in
    await signIn(mentee);

    const { titles } = firstQuestion.rules;
    // the Question is rendered on the Screen
    const titleText = element(by.text(titles.en));
    expect(titleText).toBeVisible();

    // close the question
    await element(by.id('questionModal.close.icon')).tap();

    // the title has disappeared and no questions are rendered anymore
    await expect(titleText).not.toBeVisible();
    await forceLogout();
  });

  it('can move the slider and send answer in range question', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const firstQuestion = questions[0];

    // create one question
    await APICreateQuestion(firstQuestion);

    // mentee sign in
    await signIn(mentee);

    const { titles } = firstQuestion.rules;
    // the Question is rendered on the Screen
    const titleText = element(by.text(titles.en));
    expect(titleText).toBeVisible();

    const position = 0.75;
    // adjust the slider to position
    await element(by.id('questionModal.slider')).adjustSliderToPosition(
      position,
    );

    // check the value
    await expect(element(by.id('questionModal.slider'))).toHaveSliderPosition(
      position,
    );

    // send answer
    const sendButton = element(by.text('Send'));
    await expect(sendButton).toBeVisible();
    await sendButton.tap();

    // modal is closed
    await expect(titleText).not.toBeVisible();
    await forceLogout();
  });

  it('can answer to a yes-no question', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const secondQuestion = questions[1];

    // create one question
    await APICreateQuestion(secondQuestion);

    // mentee sign in
    await signIn(mentee);

    const { titles, answer } = secondQuestion.rules;
    // the Question is rendered on the Screen
    const titleText = element(by.text(titles.en));
    expect(titleText).toBeVisible();

    // check yes and no buttons are visible
    const yesButton = element(by.text(answer.yes.labels.en));
    const noButton = element(by.text(answer.no.labels.en));
    expect(yesButton).toBeVisible();
    expect(noButton).toBeVisible();

    // send answer
    await yesButton.tap();

    // modal is closed
    await expect(titleText).not.toBeVisible();
    await forceLogout();
  });

  it('if multiple unanswered, will answer in sequence', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const firstQuestion = questions[0];
    const secondQuestion = questions[1];

    // create both questions
    await APICreateQuestion(firstQuestion);
    await APICreateQuestion(secondQuestion);

    // mentee sign in
    await signIn(mentee);

    // the first Question is rendered on the Screen
    const firstText = element(by.text(firstQuestion.rules.titles.en));
    expect(firstText).toBeVisible();

    // send answer
    const sendButton = element(by.text('Send'));
    await sendButton.tap();

    // modal is closed
    await expect(firstText).not.toBeVisible();

    // the second Question is rendered on the Screen
    const secondText = element(by.text(secondQuestion.rules.titles.en));
    expect(secondText).toBeVisible();

    const yesButton = element(
      by.text(secondQuestion.rules.answer.yes.labels.en),
    );
    // send answer
    await yesButton.tap();

    // modal is closed
    await expect(secondText).not.toBeVisible();
    await forceLogout();
  });
});
