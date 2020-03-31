import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from './auth';

const key = 'LOGIN';

type StorableToken = t.TypeOf<typeof storableTokenType>;
const storableTokenType = t.strict({
  scopes: t.strict({
    accountId: t.string,
    userId: t.string,
  }),
  tokens: t.strict({
    accessToken: t.string,
    refreshToken: t.string,
  }),
});

const toAccessToken: (a: StorableToken) => auth.AccessToken = ({
  scopes: { accountId, userId },
  tokens: { refreshToken, accessToken },
}) => ({
  accountId,
  userId,
  accessToken,
  refreshToken,
});

const toStorabeToken: (a: auth.AccessToken) => StorableToken = ({
  accountId,
  userId,
  accessToken,
  refreshToken,
}) => ({
  scopes: { accountId, userId },
  tokens: { refreshToken, accessToken },
});

const parseToken = (str: string) =>
  pipe(
    E.tryCatch(() => JSON.parse(str), () => 'Failed to parse JSON.'),
    E.chain(
      flow(
        storableTokenType.decode,
        E.mapLeft(_ => 'Failed to decode JSON.'),
      ),
    ),
    E.map(toAccessToken),
    TE.fromEither,
  );

export const readToken = pipe(
  TE.tryCatch(
    () => AsyncStorage.getItem(key),
    () => 'Failed to read from disk.',
  ),
  TE.chain(
    flow(
      O.fromNullable,
      O.fold(
        () => TE.left('Token not found from async storage.'),
        token => TE.right(token),
      ),
    ),
  ),
  TE.chain(parseToken),
  RE.fromTaskEither,
);

export const writeToken = (token: auth.AccessToken) =>
  pipe(
    token,
    toStorabeToken,
    JSON.stringify,
    str =>
      TE.tryCatch(
        () => AsyncStorage.setItem(key, str),
        () => 'Failed to write token to disk.',
      ),
    RE.fromTaskEither,
  );
