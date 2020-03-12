import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as TE from 'fp-ts/lib/TaskEither';
import { identity } from 'fp-ts/lib/function';

import * as http from '../lib/http';
import * as err from '../lib/http-err';

import * as localization from '../localization';

import * as config from './config';
import * as authApi from './auth';

type ApiUser = t.TypeOf<typeof userType>;
const userType = t.strict({
  display_name: t.string,
  role: t.union([t.literal('mentee'), t.literal('mentor'), t.literal('admin')]),
  id: t.string,
  account_id: t.string,
});

const accountType = t.intersection([
  t.strict({
    role: t.union([
      t.literal('mentee'),
      t.literal('mentor'),
      t.literal('admin'),
    ]),
    login_name: t.string,
    id: t.string,
  }),
  t.partial({
    phone: t.string,
    email: t.string,
  }),
]);
type ApiAccount = t.TypeOf<typeof accountType>;

const userAccountType = t.strict({
  account: accountType,
  user: userType,
});
type ApiUserAccount = t.TypeOf<typeof userAccountType>;

export type UserAccount = {
  role: ApiUser['role'];
  userName: string;
  displayName: string;
  email?: string;
};
export const toUserAccount: (a: ApiUserAccount) => UserAccount = ({
  user: { display_name, role },
  account: { login_name, email },
}) => ({
  role,
  userName: login_name,
  displayName: display_name,
  email,
});

function postAccount({
  userName,
  password,
  email,
}: User): RE.ObservableEither<err.Err, ApiUserAccount> {
  return http.validateResponse(
    http.post(`${config.baseUrl}/accounts`, {
      password,
      account: {
        role: 'mentee',
        login_name: userName,
        email,
      },
    }),
    userAccountType,
    identity,
  );
}

export type Account = {
  role: 'mentee' | 'admin' | 'mentor';
  userName: string;
  email?: string;
};
export const putAccount: (
  token: authApi.AccessToken,
  account: Account,
) => RE.ObservableEither<err.Err, Account> = (token, account) => {
  return http.validateResponse(
    http.put(
      `${config.baseUrl}/accounts/${token.accountId}`,
      {
        id: token.accountId,
        role: account.role,
        login_name: account.userName,
        email: account.email,
      },
      {
        headers: authApi.authHeader(token),
      },
    ),
    accountType,
    (apiAccount: ApiAccount) => ({
      role: apiAccount.role,
      userName: apiAccount.login_name,
      email: apiAccount.email,
    }),
  );
};

function putUser(
  token: authApi.AccessToken,
  user: ApiUser,
): RE.ObservableEither<err.Err, ApiUser> {
  return http.validateResponse(
    http.put(`${config.baseUrl}/users`, user, {
      headers: authApi.authHeader(token),
    }),
    userType,
    identity,
  );
}

export type User = authApi.Credentials & {
  displayName: string;
  email: string;
};

export function createUser(
  user: User,
): RE.ObservableEither<err.Err, authApi.AccessToken> {
  const { userName, password } = user;
  return pipe(
    user,
    postAccount,
    RE.chain(createdUser =>
      pipe(
        authApi.login({ userName, password }),
        RE.map(
          token =>
            [createdUser, token] as [ApiUserAccount, authApi.AccessToken],
        ),
      ),
    ),
    RE.chain(([createdUser, token]) =>
      pipe(
        putUser(token, { ...createdUser.user, display_name: user.displayName }),
        RE.map(_ => token),
      ),
    ),
  );
}

function isUserNameFree(userName: string): TE.TaskEither<err.Err, boolean> {
  return pipe(
    http.head(`${config.baseUrl}/search?login_name=${userName}`),
    RE.map(({ status }) => status === 204),
    RE.toTaskEither,
  );
}

export function checkCredentials({
  userName,
  password,
}: authApi.Credentials): TE.TaskEither<
  { errorMessageId: localization.MessageId },
  { userName: string; password: string }
> {
  const fail = (errorMessageId: localization.MessageId) =>
    TE.left({
      userName,
      errorMessageId,
    });
  if (userName.length < 3) return fail('onboarding.signUp.error.userNameShort');
  if (userName.length > 30) return fail('onboarding.signUp.error.userNameLong');
  if (password.length < 5) return fail('onboarding.signUp.error.passwordShort');
  if (password.length > 30) return fail('onboarding.signUp.error.passwordLong');
  return pipe(
    isUserNameFree(userName),
    TE.fold(
      () => fail('onboarding.signUp.error.probablyNetwork'),
      isFree =>
        isFree
          ? TE.right({ userName, password })
          : fail('onboarding.signUp.error.userNameTaken'),
    ),
  );
}

export const getMyUser = (token: authApi.AccessToken) =>
  http.validateResponse(
    http.get(`${config.baseUrl}/myuser`, {
      headers: authApi.authHeader(token),
    }),
    userAccountType,
    toUserAccount,
  );
