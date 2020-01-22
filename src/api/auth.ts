import * as t from 'io-ts';

import * as http from '../lib/http';

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
  };
}

export type Credentials = {
  userName: string;
  password: string;
};

const loginUrl = config.baseUrl + 'login';
export async function login({ userName, password }: Credentials) {
  const input = {
    login_name: userName,
    password,
  };
  const apiToken = await http.post(loginUrl, input, tokenType);
  return toAccessToken(apiToken);
}

export async function refreshAccessToken(accessToken: AccessToken) {
  const apiToken = await http.post(
    `${config.baseUrl}/refresh`,
    { refresh_token: accessToken.refreshToken },
    newAccessTokenType,
  );
  return { ...accessToken, accessToken: apiToken.access_token };
}
