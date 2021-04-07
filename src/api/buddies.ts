import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';

import * as authApi from './auth';

type ApiBuddy = t.TypeOf<typeof buddyType>;
const buddyType = t.intersection([
  t.strict({
    display_name: t.string,
    id: t.string,
  }),
  t.partial({ status: t.literal('banned') }),
]);

export type Buddy = {
  buddyId: string;
  name: string;
  status: 'Banned' | 'Active';
};

const toBuddy = ({ id, display_name, status }: ApiBuddy): Buddy => ({
  buddyId: id,
  name: display_name,
  status: status === 'banned' ? 'Banned' : 'Active',
});

export function fetchBuddies(
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, Record<string, Buddy>> {
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

const banRequest = (buddyId: string, accessToken: authApi.AccessToken) => {
  return http.put(
    `${config.baseUrl}/users/${accessToken.userId}/contacts/${buddyId}`,
    { status: 'banned' },
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

export function banBuddy(
  buddyId: string,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddy> {
  return accessToken =>
    http.validateResponse(banRequest(buddyId, accessToken), buddyType, toBuddy);
}
