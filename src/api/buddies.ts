import * as t from 'io-ts';

import * as http from '../lib/http';

import * as config from './config';

import * as authApi from './auth';

type ApiBuddy = t.TypeOf<typeof buddyType>;
const buddyType = t.strict({
  account_id: t.string,
  display_name: t.string,
});

export type Buddy = ReturnType<typeof toBuddy>;
const toBuddy = ({ account_id, display_name }: ApiBuddy) => ({
  userId: account_id,
  name: display_name,
});

export async function fetchBuddies(accessToken: authApi.AccessToken) {
  const buddiesUrl = `${config.baseUrl}users/${accessToken.userId}/contacts`;
  const { resources } = await http.get(
    buddiesUrl,
    t.strict({ resources: t.array(buddyType) }),
    {
      headers: authApi.authHeader(accessToken),
    },
  );
  return resources.map(toBuddy);
}
