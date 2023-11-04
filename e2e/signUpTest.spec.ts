import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APIDeleteAccounts,
  scrollDownAndTap,
  waitAndTypeText,
  forceLogout,
} from './helpers';

describe('SignUp', () => {
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

  it('mentee succesfully', async () => {
    const mentee = accountFixtures.mentees[0];
    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.up', 'onboarding.mentorlist.view');

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}\n`,
    );
    await waitAndTypeText('onboarding.signUp.password', `${mentee.password}\n`);
    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
    );

    await element(by.id('onboarding.displayName.inputTitle')).clearText();
    await waitAndTypeText(
      'onboarding.displayName.inputTitle',
      `${mentee.displayName}`,
    );
    await scrollDownAndTap(
      'onboarding.displayName.nextButton',
      'onboarding.displayName.view',
    );

    await waitAndTypeText('onboarding.email.inputTitle', `${mentee.email}\n`);
    await scrollDownAndTap(
      'onboarding.email.nextButton',
      'onboarding.email.view',
    );

    await scrollDownAndTap(
      'onboarding.age.switch',
      'onboarding.privacyPolicy.view',
    );

    await scrollDownAndTap(
      'onboarding.privacyPolicy.switch',
      'onboarding.privacyPolicy.view',
    );

    await scrollDownAndTap(
      'onboarding.privacyPolicy.nextButton',
      'onboarding.privacyPolicy.view',
    );

    await element(by.id('tabs.settings')).tap();
    await expect(element(by.id('main.settings.account.userName'))).toHaveText(
      mentee.loginName,
    );
    await expect(
      element(by.id('main.settings.account.displayName')),
    ).toHaveText(mentee.displayName);
    await expect(element(by.id('main.settings.account.email'))).toHaveText(
      mentee.email,
    );
  });

  it('password is validated by rules', async () => {
    const mentee = accountFixtures.mentees[0];
    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.up', 'onboarding.mentorlist.view');

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}\n`,
    );
    await waitAndTypeText('onboarding.signUp.password', `menteementee!\n`);

    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
    );

    await expect(
      element(
        by.text(
          'New password should be a minimum of eight characters in length, include one uppercase letter, one lowercase letter and a special character',
        ),
      ),
    ).toBeVisible();
  });

  it('cannot go past displayname if display_name is erased', async () => {
    const mentee = accountFixtures.mentees[0];
    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.up', 'onboarding.mentorlist.view');

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}\n`,
    );
    await waitAndTypeText('onboarding.signUp.password', `${mentee.password}\n`);
    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
    );

    await element(by.id('onboarding.displayName.inputTitle')).clearText();
    await waitAndTypeText('onboarding.displayName.inputTitle', ``);
    await scrollDownAndTap(
      'onboarding.displayName.nextButton',
      'onboarding.displayName.view',
    );
    await expect(
      element(by.id('onboarding.displayName.inputTitle')),
    ).toBeVisible();
  });
});
