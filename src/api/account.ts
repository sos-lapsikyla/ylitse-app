import * as t from 'io-ts';

import * as http from '../lib/http';
import taggedError from '../lib/tagged-error';

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
async function post_account({ userName, password, phone, email }: NewUser) {
  const requestBody = {
    password,
    account: {
      role: 'mentee',
      login_name: userName,
      phone,
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
  phone?: string;
  email?: string;
};

export async function createUser(user: NewUser): Promise<authApi.AccessToken> {
  const { user: createdUser } = await post_account(user);
  const { userName, password } = user;
  const accessToken = await authApi.login({ userName, password });
  await put_user(accessToken, { ...createdUser, display_name: userName });
  return accessToken;
}

type UserNameAvailability =
  | { type: 'UserNameTaken'; userName: string }
  | { type: 'UserNameFree'; userName: string };
const SEARCH_URL = `${config.baseUrl}search?login_name=`;
async function isUserNameFree(userName: string): Promise<UserNameAvailability> {
  const { status } = await http.head(`${SEARCH_URL}${userName}`);
  return { type: status === 204 ? 'UserNameFree' : 'UserNameTaken', userName };
}

export type CredentialsSanityCheckOk = {
  type: 'Ok';
  credentials: authApi.Credentials;
};
const errorNames = [
  'UserNameTooLong',
  'UserNameTooShort',
  'UserNameTaken',
  'PasswordTooShort',
  'PasswordTooLong',
] as const;
const { errorType, errorMaker, errorDecoder } = taggedError(errorNames);
export const credentialsSanityCheckErrorHandler = errorDecoder;
export type CredentialsSanityCheckError = t.TypeOf<typeof errorType>;
export async function makeCredentialsSanityCheck({
  userName,
  password,
}: authApi.Credentials): Promise<CredentialsSanityCheckOk> {
  if (userName.length < 3) throw errorMaker('UserNameTooShort');
  if (userName.length > 30) throw errorMaker('UserNameTooLong');
  if (password.length < 5) throw errorMaker('PasswordTooShort');
  if (password.length > 30) throw errorMaker('PasswordTooLong');
  const availability = await isUserNameFree(userName);
  if (availability.type === 'UserNameTaken') {
    throw errorMaker('UserNameTaken');
  } else {
    return {
      type: 'Ok',
      credentials: { userName, password },
    };
  }
}

/*
type Account =
  | {
      role: 'mentee' | 'admin';
      phone?: string;
      email?: string;
      accountId: string;
      userId: string;
    }
  | {
      role: 'mentor';
      phone?: string;
      email?: string;
      accountId: string;
      userId: string;
      mentorId: string;
    };
*/
