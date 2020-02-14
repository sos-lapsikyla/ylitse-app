import * as t from 'io-ts';

import * as taggedUnion from '../lib/tagged-union';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as f from '../lib/future';

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

async function postAccount({
  userName,
  password,
  email,
}: NewUser): http.Future<t.TypeOf<typeof createdUserAccount>> {
  const url = `${config.baseUrl}/accounts`;
  const requestBody = {
    password,
    account: {
      role: 'mentee',
      login_name: userName,
      email,
    },
  };
  return http.post(url, requestBody, createdUserAccount);
}

async function putUser(
  token: authApi.AccessToken,
  user: User,
): http.Future<User> {
  const url = `${config.baseUrl}/users`;
  return http.put(`${url}/${user.id}`, user, userType, {
    headers: authApi.authHeader(token),
  });
}

export type NewUser = authApi.Credentials & {
  displayName: string;
  email: string;
};

export async function createUser(
  user: NewUser,
): http.Future<authApi.AccessToken> {
  const { userName, password } = user;
  const results = await f.seq(
    f.lazy(postAccount, user),
    f.lazy(authApi.login, { userName, password }),
  );
  return f.chain(results, async ([createdUser, token]) => {
    await putUser(token, {
      ...createdUser.user,
      display_name: user.displayName,
    });
    return result.ok(token);
  });
}

async function isUserNameFree(userName: string): http.Future<boolean> {
  return result.map(
    await http.head(`${config.baseUrl}/search?login_name=${userName}`),
    ({ status }) => status === 204,
  );
}

export async function checkCredentials({
  userName,
  password,
}: authApi.Credentials): f.Future<
  { userName: string; password: string },
  { errorMessageId: localization.MessageId }
> {
  const fail = (errorMessageId: localization.MessageId) =>
    result.err({
      userName,
      errorMessageId,
    });
  if (userName.length < 3) return fail('onboarding.signUp.error.userNameShort');
  if (userName.length > 30) return fail('onboarding.signUp.error.userNameLong');
  if (password.length < 5) return fail('onboarding.signUp.error.passwordShort');
  if (password.length > 30) return fail('onboarding.signUp.error.passwordLong');
  return taggedUnion.match(await isUserNameFree(userName), {
    Err: fail('onboarding.signUp.error.probablyNetwork'),
    Ok: isFree =>
      isFree
        ? result.ok({
            userName,
            password,
          })
        : fail('onboarding.signUp.error.userNameTaken'),
  });
}
