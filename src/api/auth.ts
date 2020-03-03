import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';

import * as err from '../lib/http-err';
import * as http2 from '../lib/http2';

import * as config from './config';

type ApiLoginToken = t.TypeOf<typeof tokenType>;
const tokenType = t.strict({
  scopes: t.strict({
    account_id: t.string,
    user_id: t.string,
  }),
  tokens: t.strict({
    access_token: t.string,
    refresh_token: t.string,
  }),
});

const newAccessTokenType = t.strict({
  access_token: t.string,
});

export type AccessToken = {
  accountId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  fetchTime: number;
};

export const invalidToken: AccessToken = {
  accountId: '0',
  userId: '0',
  accessToken: '0',
  refreshToken: '0',
  fetchTime: 0,
};

function toAccessToken({
  scopes: { account_id, user_id },
  tokens,
}: ApiLoginToken): AccessToken {
  return {
    accountId: account_id,
    userId: user_id,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    fetchTime: Date.now(),
  };
}

export type Credentials = {
  userName: string;
  password: string;
};

export function login({
  userName,
  password,
}: Credentials): TE.TaskEither<err.Err, AccessToken> {
  return http2.validateResponse(
    http2.post(`${config.baseUrl}/login`, {
      login_name: userName,
      password,
    }),
    tokenType,
    toAccessToken,
  );
}

export function refreshAccessToken(
  currentToken: AccessToken,
): TE.TaskEither<err.Err, AccessToken> {
  return http2.validateResponse(
    http2.post(`${config.baseUrl}/refresh`, {
      refresh_token: currentToken.refreshToken,
    }),
    newAccessTokenType,
    ({ access_token }) => ({
      ...currentToken,
      accessToken: access_token,
    }),
  );
}

export function authHeader({
  accessToken,
}: AccessToken): RequestInit['headers'] {
  return { Authorization: `Bearer ${accessToken}` };
}
