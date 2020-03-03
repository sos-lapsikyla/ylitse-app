import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http2 from '../lib/http2';
import * as err from '../lib/http-err';
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

export function fetchBuddies(
  accessToken: authApi.AccessToken,
): TE.TaskEither<err.Err, record.NonTotal<Buddy>> {
  return http2.validateResponse(
    http2.get(`${config.baseUrl}/users/${accessToken.userId}/contacts`, {
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
