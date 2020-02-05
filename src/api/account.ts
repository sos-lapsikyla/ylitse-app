import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';

import * as localization from '../localization';

import * as config from './config';
import * as authApi from './auth';

type User = t.TypeOf<typeof userType>;
const userType = t.strict({
  display_name: t.string,
  role: t.union([t.literal('mentee'), t.literal('mentor'), t.literal('admin')]),
  id: t.string,
  account_id: t.string,
});

const accountType = t.intersection([
  t.strict({
    login_name: t.string,
    id: t.string,
  }),
  t.partial({
    phone: t.string,
    email: t.string,
  }),
]);

const createdUserAccount = t.strict({
  account: accountType,
  user: userType,
});

const accountUrl = `${config.baseUrl}accounts`;
async function post_account({ userName, password, email }: NewUser) {
  const requestBody = {
    password,
    account: {
      role: 'mentee',
      login_name: userName,
      email,
    },
  };
  return http.post(accountUrl, requestBody, createdUserAccount);
}

const USERS_URL = `${config.baseUrl}users`;
async function put_user(token: authApi.AccessToken, user: User) {
  return http.put(`${USERS_URL}/${user.id}`, user, userType, {
    headers: authApi.authHeader(token),
  });
}

export type NewUser = authApi.Credentials & {
  displayName: string;
  email: string;
};

export async function createUser(user: NewUser): Promise<authApi.AccessToken> {
  const { user: createdUser } = await post_account(user);
  const { userName, password } = user;
  const accessToken = await authApi.login({ userName, password });
  await put_user(accessToken, { ...createdUser, display_name: userName });
  return accessToken;
}

const SEARCH_URL = `${config.baseUrl}search?login_name=`;
async function isUserNameFree(
  userName: string,
): Promise<result.Result<string, string>> {
  const { status } = await http.head(`${SEARCH_URL}${userName}`);
  return status === 204 ? result.ok(userName) : result.err(userName);
}

export async function checkCredentials({
  userName,
  password,
}: authApi.Credentials): Promise<
  result.Result<
    { userName: string; password: string },
    { errorMessageId: localization.MessageId }
  >
> {
  const fail = (errorMessageId: localization.MessageId) =>
    result.err({
      userName,
      errorMessageId,
    });
  if (userName.length < 3) fail('onboarding.signUp.error.userNameShort');
  if (userName.length > 30) fail('onboarding.signUp.error.userNameLong');
  if (password.length < 5) fail('onboarding.signUp.error.passwordShort');
  if (password.length > 30) fail('onboarding.signUp.error.passwordLong');
  return result.bimap(
    await isUserNameFree(userName),
    () => ({
      userName,
      password,
    }),
    () => ({
      userName,
      errorMessageId: 'onboarding.signUp.error.userNameTaken',
    }),
  );
}
