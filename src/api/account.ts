import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as TE from 'fp-ts/lib/TaskEither';
import * as http2 from '../lib/http2';
import * as err from '../lib/http-err';

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
type CreatedUserAccount = t.TypeOf<typeof createdUserAccount>;

function postAccount({
  userName,
  password,
  email,
}: NewUser): RE.ObservableEither<err.Err, CreatedUserAccount> {
  return http2.validateResponse(
    http2.post(`${config.baseUrl}/accounts`, {
      password,
      account: {
        role: 'mentee',
        login_name: userName,
        email,
      },
    }),
    createdUserAccount,
    a => a,
  );
}

function putUser(
  token: authApi.AccessToken,
  user: User,
): RE.ObservableEither<err.Err, User> {
  return http2.validateResponse(
    http2.put(`${config.baseUrl}/users`, user, {
      headers: authApi.authHeader(token),
    }),
    userType,
    x => x,
  );
}

export type NewUser = authApi.Credentials & {
  displayName: string;
  email: string;
};

export function createUser(
  user: NewUser,
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
            [createdUser, token] as [CreatedUserAccount, authApi.AccessToken],
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
    http2.head(`${config.baseUrl}/search?login_name=${userName}`),
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
