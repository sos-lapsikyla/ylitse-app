import { by, element, waitFor, device } from 'detox';
import fetch from 'node-fetch';

const API_URL = process.env.YLITSE_API_URL || 'http://localhost:8080';
const API_USER = process.env.YLITSE_API_USER || 'admin';
const API_PASS = process.env.YLITSE_API_PASS || 'secret';

/**
 * Scrolls view down if needed and taps the given element
 */
export async function scrollDownAndTap(elementId: string, viewId: string) {
  await scrollDownTo(elementId, viewId);

  // App has big sticky toolbar at the bottom
  // Scroll down little bit more to be able to tap the element
  try {
    await element(by.id(viewId)).scroll(100, 'down', 0.1, 0.2);
  } catch (error) {
    // Do nothing, cannot scroll down anymore
  }

  await element(by.id(elementId)).tap();
}

/**
 * Scrolls view down until element is found
 */
export async function scrollDownTo(elementId: string, viewId: string) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(viewId))
    // Needs to scroll from x=0.1, y=0.2
    // because of the big sticky toolbar
    .scroll(200, 'down', 0.1, 0.2);
}

/**
 * Scrolls view up until element is found
 */
export async function scrollUpTo(elementId: string, viewId: string) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(viewId))
    // Needs to scroll from x=0.1, y=0.2
    // because of the big sticky toolbar
    .scroll(100, 'up', 0.1, 0.2);
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
 * Logout by reinstalling and launching app
 */
export async function forceLogout() {
  await device.uninstallApp();
  await device.installApp();
  await device.launchApp({
    newInstance: true,
    permissions: {
      notifications: 'YES',
    },
  });
}

/**
 * Get access_token for admin
 */
export async function APIAdminAccessToken() {
  return await APIAccessToken(API_USER, API_PASS);
}

/**
 * Get access_token
 */
export async function APIAccessToken(login_name: string, password: string) {
  const loginResponse = await fetch(`${API_URL}/login`, {
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
  const usersResponse = await fetch(`${API_URL}/users`, {
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
    await fetch(`${API_URL}/accounts/${user.account_id}`, {
      method: 'DELETE',
      headers: headers,
    });
  }
}

/**
 * SignUp new mentee
 */
export async function APISignUpMentee(mentee: any) {
  await fetch(`${API_URL}/accounts`, {
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

  const myUserRes = await fetch(`${API_URL}/myuser`, {
    method: 'GET',
    headers: headers,
  });
  const myuser: any = await myUserRes.json();

  await fetch(`${API_URL}/users/${myuser.user.id}`, {
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
  await fetch(`${API_URL}/accounts`, {
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

  const myUserRes = await fetch(`${API_URL}/myuser`, {
    method: 'GET',
    headers: headers,
  });
  const myuser: any = await myUserRes.json();

  await fetch(`${API_URL}/users/${myuser.user.id}`, {
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

  await fetch(`${API_URL}/mentors/${myuser.mentor.id}`, {
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
