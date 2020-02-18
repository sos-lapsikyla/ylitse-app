import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';
import * as record from '../lib/record';

import * as config from './config';

import * as authApi from './auth';

type ApiBuddy = t.TypeOf<typeof buddyType>;
const buddyType = t.strict({
  display_name: t.string,
  id: t.string,
});

export type Buddy = ReturnType<typeof toBuddy>;
const toBuddy = ({ id, display_name }: ApiBuddy) => ({
  buddyId: id,
  name: display_name,
});

export async function fetchBuddies(
  accessToken: authApi.AccessToken,
): http.Future<record.NonTotal<Buddy>> {
  const url = `${config.baseUrl}/users/${accessToken.userId}/contacts`;
  return result.map(
    await http.get(url, t.strict({ resources: t.array(buddyType) }), {
      headers: authApi.authHeader(accessToken),
    }),
    ({ resources }) =>
      resources.reduce((acc, apiBuddy) => {
        const buddy = toBuddy(apiBuddy);
        return { ...acc, [buddy.buddyId]: buddy };
      }, {}),
  );
}
