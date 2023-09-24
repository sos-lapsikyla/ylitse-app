import { by, element, waitFor, device } from 'detox';

const API_URL = process.env.YLITSE_API_URL || 'http://127.0.0.1:8080';
const API_USER = process.env.YLITSE_API_USER || 'admin';
const API_PASS = process.env.YLITSE_API_PASS || '';

/**
 * Scrolls view down if needed and taps the given element
 */
export async function scrollDownAndTap(
  elementId: string,
  viewId: string,
  xPosition: number = 0.1,
  yPosition: number = 0.2,
) {
  await scrollDownTo(elementId, viewId, xPosition, yPosition);

  // App has big sticky toolbar at the bottom
  // Scroll down little bit more to be able to tap the element
  try {
    await element(by.id(viewId)).scroll(100, 'down', xPosition, yPosition);
  } catch (error) {
    // Do nothing, cannot scroll down anymore
  }

  await element(by.id(elementId)).tap();
}

/**
 * Scrolls view down until element is found
 */
export async function scrollDownTo(
  elementId: string,
  viewId: string,
  xPosition: number = 0.1,
  yPosition: number = 0.2,
) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(viewId))
    // Needs to scroll from x=0.1, y=0.2
    // because of the big sticky toolbar
    .scroll(200, 'down', xPosition, yPosition);
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
export async function waitAndTypeText(
  elementId: string,
  text: string,
  multiline: boolean = false,
) {
  const inputField = element(by.id(elementId));
  await waitFor(inputField).toBeVisible().withTimeout(5000);
  await inputField.typeText(text);

  if (!multiline) {
    await inputField.tapReturnKey();
  }
}

/**
 * Sign in user
 */
export async function signIn(details: any) {
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

  await waitAndTypeText(
    'onboarding.signUp.userName',
    `${details.loginName}`,
    true,
  );
  await signInView.tap({ x: 1, y: 1 });

  await waitAndTypeText(
    'onboarding.signUp.password',
    `${details.password}`,
    true,
  );

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
      is_vacationing: mentor.is_vacationing,
      status_message: mentor.status_message,
      account_id: myuser.account.id,
      user_id: myuser.user.id,
      id: myuser.mentor.id,
    }),
  });
}

export async function APIBan(sender: any, reciever: any, status = 'banned') {
  const admin_access_token = await APIAdminAccessToken();
  const info = await APIUsers(admin_access_token);

  let sender_info = info.find(
    (o: any) => o.display_name === sender.displayName,
  );

  let reciever_info = info.find(
    (o: any) => o.display_name === reciever.displayName,
  );

  const access_token = await APIAccessToken(sender.loginName, sender.password);

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  await fetch(
    `${API_URL}/users/${sender_info.id}/contacts/${reciever_info.id}`,
    {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        status,
      }),
    },
  );
}

const toHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function APIGetSendInfo(sender: any, reciever: any) {
  const adminAccessToken = await APIAdminAccessToken();
  const info = await APIUsers(adminAccessToken);

  const senderInfo = info.find(
    (o: any) => o.display_name === sender.displayName,
  );

  const recieverInfo = info.find(
    (o: any) => o.display_name === reciever.displayName,
  );

  const accessTokenSender = await APIAccessToken(
    sender.loginName,
    sender.password,
  );

  const accessTokenReciever = await APIAccessToken(
    reciever.loginName,
    reciever.password,
  );

  return {
    sender_id: senderInfo.id,
    recipient_id: recieverInfo.id,
    senderHeaders: toHeader(accessTokenSender),
    recieverHeaders: toHeader(accessTokenReciever),
  };
}

type Data = {
  sender_id: string;
  recipient_id: string;
  content: string;
  headers: Record<string, string>;
};
export async function APISendMessage({
  sender_id,
  recipient_id,
  content,
  headers,
}: Data) {
  await fetch(`${API_URL}/users/${sender_id}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sender_id,
      recipient_id,
      content,
      opened: false,
    }),
  });
}

/**
 * Create a question
 */
export async function APICreateQuestion(question: any) {
  const access_token = await APIAdminAccessToken();

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  await fetch(`${API_URL}/feedback/questions`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(question),
  });
}

/**
 * Get all questions from API
 */
export async function APIQuestions(access_token: string) {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const questionsResponse = await fetch(`${API_URL}/feedback/questions`, {
    method: 'GET',
    headers: headers,
  });
  const questions: any = await questionsResponse.json();

  return questions.resources;
}

/**
 * Makes HTTP API calls to delete all questions
 */
export async function APIDeleteQuestions() {
  const access_token = await APIAdminAccessToken();
  const questions: any = await APIQuestions(access_token);

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  for (const question of questions) {
    await fetch(`${API_URL}/feedback/questions/${question.id}`, {
      method: 'DELETE',
      headers: headers,
    });
  }
}

/**
 * map to apimentor
 */
const toApiMentor = ({
  birthYear,
  displayName,
  story,
  languages,
  skills,
  communication_channels,
  gender,
  region,
}: any) => ({
  birth_year: birthYear,
  display_name: displayName,
  story,
  languages,
  skills,
  communication_channels,
  gender,
  region,
});

/**
 * Get mentors
 */
export const APIMentors = async () => {
  const mentorsResponse = await fetch(`${API_URL}/mentors`);

  const mentorsJson: any = await mentorsResponse.json();

  return mentorsJson.resources;
};

/**
 * Update mentors data
 */
export async function APIUpdateMentor(mentorName: string, mentor: any) {
  const access_token = await APIAdminAccessToken();
  const mentors = await APIMentors();

  const mentorData = mentors.find((o: any) => o.display_name === mentorName);

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const mappedMentorData = toApiMentor(mentor);
  const updatedMentor = { ...mentorData, ...mappedMentorData };

  await fetch(`${API_URL}/mentors/${mentorData.id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(updatedMentor),
  });
}
