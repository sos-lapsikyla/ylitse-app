import { by, element, waitFor } from 'detox';
import fetch from 'node-fetch';

import * as config from './config.json';

/**
 * Scrolls view down if needed and taps the given element
 */
export async function scrollDownAndTap(elementId: string, viewId: string) {
  await scrollDownTo(elementId, viewId);
  await element(by.id(elementId)).tap();
}

/**
 * Scrolls view down until element is found
 */
export async function scrollDownTo(elementId: string, viewId: string) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(viewId))
    .scroll(100, 'down');
}

/**
 * Waits until input is visible and then types given text
 */
export async function waitAndTypeText(elementId: string, text: string) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id(elementId)).typeText(text);
}

/**
 * Sign in user
 */
export async function signIn(details: any) {
  await scrollDownAndTap(
    'onboarding.welcome.button',
    'onboarding.welcome.view',
  );
  await scrollDownAndTap(
    'onboarding.mentorlist.start',
    'onboarding.mentorlist.view',
  );
  await scrollDownAndTap('onboarding.sign.in', 'onboarding.mentorlist.view');

  await waitAndTypeText('onboarding.signUp.nickName', `${details.loginName}\n`);
  await waitAndTypeText('onboarding.signUp.password', `${details.password}\n`);

  await waitFor(element(by.id('onboarding.signUp.button')))
    .toBeVisible()
    .withTimeout(5000);
  await scrollDownAndTap('onboarding.signUp.button', 'onboarding.signUp.view');
}

/**
 * Get access_token for admin
 */
export async function APIAdminAccessToken() {
  return await APIAccessToken(
    config.ylitseAPI.admin.login_name,
    config.ylitseAPI.admin.password,
  );
}

/**
 * Get access_token
 */
export async function APIAccessToken(login_name: string, password: string) {
  const loginResponse = await fetch(`${config.ylitseAPI.url}/login`, {
    method: 'POST',
    body: JSON.stringify({ login_name: login_name, password: password }),
  });
  const tokens: any = await loginResponse.json();
  return tokens.tokens.access_token;
}

/**
 * Get users from API
 */
export async function APIUsers(access_token: string) {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const usersResponse = await fetch(`${config.ylitseAPI.url}/users`, {
    method: 'GET',
    headers: headers,
  });
  const users: any = await usersResponse.json();
  return users.resources;
}

/**
 * Makes HTTP API calls to delete all users except those with role 'admin'
 */
export async function APIDeleteAccounts() {
  const access_token = await APIAdminAccessToken();
  const users: any = await APIUsers(access_token);

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  for (const user of users) {
    if (user.role === 'admin') {
      continue;
    }
    await fetch(`${config.ylitseAPI.url}/accounts/${user.account_id}`, {
      method: 'DELETE',
      headers: headers,
    });
  }
}

/**
 * SignUp new mentee
 */
export async function APISignUpMentee(mentee: any) {
  await fetch(`${config.ylitseAPI.url}/accounts`, {
    method: 'POST',
    body: JSON.stringify({
      password: mentee.password,
      account: {
        role: mentee.role,
        login_name: mentee.loginName,
        email: mentee.email,
      },
    }),
  });
  const access_token = await APIAccessToken(mentee.loginName, mentee.password);
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const myUserRes = await fetch(`${config.ylitseAPI.url}/myuser`, {
    method: 'GET',
    headers: headers,
  });
  const myuser: any = await myUserRes.json();

  await fetch(`${config.ylitseAPI.url}/users/${myuser.user.id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      display_name: mentee.displayName,
      role: mentee.role,
      account_id: myuser.account.id,
      id: myuser.user.id,
    }),
  });
}

/**
 * SignUp new mentor
 */
export async function APISignUpMentor(mentor: any) {
  const admin_access_token = await APIAdminAccessToken();
  const admin_headers = {
    Authorization: `Bearer ${admin_access_token}`,
  };
  await fetch(`${config.ylitseAPI.url}/accounts`, {
    method: 'POST',
    headers: admin_headers,
    body: JSON.stringify({
      password: mentor.password,
      account: {
        role: mentor.role,
        login_name: mentor.loginName,
        email: mentor.email,
        phone: mentor.phone,
      },
    }),
  });
  const access_token = await APIAccessToken(mentor.loginName, mentor.password);
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const myUserRes = await fetch(`${config.ylitseAPI.url}/myuser`, {
    method: 'GET',
    headers: headers,
  });
  const myuser: any = await myUserRes.json();

  await fetch(`${config.ylitseAPI.url}/users/${myuser.user.id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      display_name: mentor.displayName,
      birth_year: mentor.birthYear,
      role: mentor.role,
      account_id: myuser.account.id,
      id: myuser.user.id,
      active: true,
    }),
  });

  await fetch(`${config.ylitseAPI.url}/mentors/${myuser.mentor.id}`, {
    method: 'PUT',
    headers: admin_headers,
    body: JSON.stringify({
      birth_year: mentor.birthYear,
      display_name: mentor.displayName,
      gender: mentor.gender,
      languages: mentor.languages,
      region: mentor.region,
      skills: mentor.skills,
      story: mentor.story,
      communication_channels: mentor.communication_channels,
      account_id: myuser.account.id,
      user_id: myuser.user.id,
      id: myuser.mentor.id,
    }),
  });
}
