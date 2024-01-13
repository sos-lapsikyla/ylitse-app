/* global RequestInit */
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';

import * as http from '../lib/http';

import * as config from './config';

type ApiLoginToken = t.TypeOf<typeof tokenType>;

const tokenType = t.strict({
  scopes: t.intersection([
    t.strict({
      account_id: t.string,
      user_id: t.string,
    }),
    t.partial({ mentor_id: t.string }),
  ]),
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
  mentorId?: string;
  accessToken: string;
  refreshToken: string;
};

export const invalidToken: AccessToken = {
  accountId: '0',
  userId: '0',
  accessToken: '0',
  refreshToken: '0',
};

function toAccessToken({
  scopes: { account_id, user_id, mentor_id },
  tokens,
}: ApiLoginToken): AccessToken {
  return {
    accountId: account_id,
    userId: user_id,
    mentorId: mentor_id,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
}

export type Credentials = {
  userName: string;
  password: string;
  mfa?: string;
};

export function login({
  userName,
  password,
  mfa,
}: Credentials): TE.TaskEither<string, AccessToken> {
  return http.validateResponse(
    http.post(`${config.baseUrl}/login`, {
      login_name: userName,
      password,
      ...(mfa && { mfa_token: mfa }),
    }),
    tokenType,
    toAccessToken,
  );
}

export function refreshAccessToken(
  currentToken: AccessToken,
): TE.TaskEither<string, AccessToken> {
  return http.validateResponse(
    http.post(`${config.baseUrl}/refresh`, {
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
  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    ['Content-Type']: 'application/json',
  };
}

export type NewPassword = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword =
  ({ currentPassword, newPassword }: NewPassword) =>
  (token: AccessToken) =>
    http.validateResponse(
      http.put(
        `${config.baseUrl}/accounts/${token.accountId}/password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: authHeader(token),
        },
      ),
      t.any,
      _ => true as const,
    );
