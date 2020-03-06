import * as t from 'io-ts';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';

import * as http from '../lib/http';
import * as err from '../lib/http-err';

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

export function fetchBuddies(
  accessToken: authApi.AccessToken,
): RE.ObservableEither<err.Err, Record<string, Buddy>> {
  return http.validateResponse(
    http.get(`${config.baseUrl}/users/${accessToken.userId}/contacts`, {
      headers: authApi.authHeader(accessToken),
    }),
    t.strict({ resources: t.array(buddyType) }),
    ({ resources }) =>
      resources.reduce((acc, apiBuddy) => {
        const buddy = toBuddy(apiBuddy);
        return { ...acc, [buddy.buddyId]: buddy };
      }, {}),
  );
}
