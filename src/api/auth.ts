import * as t from 'io-ts';

import * as http from '../lib/http';

type ApiToken = t.TypeOf<typeof tokenType>;
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

type AccessToken = {
  accountId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
};

type Credentials = {
  userName: string;
  password: string;
};

async function login({ userName, password }: Credentials) {
  return http.post();
}
