import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach, beforeAll } from '@jest/globals';
import accountFixtures from './fixtures/accounts.json';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  signIn,
  getAdminCredentials,
  scrollDownAndTap,
  waitAndTypeText,
  forceLogout,
} from './helpers';

describe('SignIn', () => {
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
    await APISignUpMentee(mentee);

    await signIn(mentee);

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

  it('admin succesfully', async () => {
    const signInView = element(by.id('onboarding.signIn.view'));

    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.in', 'onboarding.mentorlist.view');

    await element(by.text('Admin-login')).tap();

    const { user, pass, token } = getAdminCredentials();

    await waitAndTypeText('onboarding.signUp.userName', `${user}`, true);

    await signInView.tap({ x: 1, y: 1 });

    await waitAndTypeText('onboarding.signUp.password', `${pass}`, true);

    await signInView.tap({ x: 1, y: 1 });

    await waitAndTypeText('onboarding.signIn.mfa', `${token}`, true);

    await signInView.tap({ x: 1, y: 1 });

    await waitFor(element(by.id('onboarding.signUp.button')))
      .toBeVisible()
      .withTimeout(5000);

    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
      0,
      0,
    );
    await element(by.id('tabs.settings')).tap();
    await expect(element(by.id('main.settings.account.userName'))).toHaveText(
      user,
    );
  });

  it('mentee can login even if fill mfa', async () => {
    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);

    const signInView = element(by.id('onboarding.signIn.view'));

    await scrollDownAndTap(
      'onboarding.welcome.button',
      'onboarding.welcome.view',
    );
    await scrollDownAndTap(
      'onboarding.mentorlist.start',
      'onboarding.mentorlist.view',
    );
    await scrollDownAndTap('onboarding.sign.in', 'onboarding.mentorlist.view');

    await element(by.text('Admin-login')).tap();

    await waitAndTypeText(
      'onboarding.signUp.userName',
      `${mentee.loginName}`,
      true,
    );

    await signInView.tap({ x: 1, y: 1 });

    await waitAndTypeText(
      'onboarding.signUp.password',
      `${mentee.password}`,
      true,
    );

    await signInView.tap({ x: 1, y: 1 });

    await waitAndTypeText('onboarding.signIn.mfa', `000000`, true);

    await signInView.tap({ x: 1, y: 1 });

    await waitFor(element(by.id('onboarding.signUp.button')))
      .toBeVisible()
      .withTimeout(5000);

    await scrollDownAndTap(
      'onboarding.signUp.button',
      'onboarding.signUp.view',
      0,
      0,
    );

    await expect(
      element(by.id('main.settings.account.displayName')),
    ).toHaveText(mentee.displayName);
    await expect(element(by.id('main.settings.account.email'))).toHaveText(
      mentee.email,
    );
  });
});
