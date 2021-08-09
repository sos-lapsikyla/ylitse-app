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
  t.partial({
    status: t.union([
      t.literal('banned'),
      t.literal('deleted'),
      t.literal('ok'),
    ]),
  }),
]);

const buddiesType = t.strict({ resources: t.array(buddyType) });

export type BanActions = 'Ban' | 'Unban' | 'Delete';
export type BanStatuses = 'Banned' | 'NotBanned' | 'Deleted';
export type BanStatusStrings = 'banned' | 'ok' | 'deleted';

type MappedStatuses = {
  [Action in BanActions]: BanStatusStrings;
};
type MappedStatusesFromApi = {
  [K in BanStatusStrings]: BanStatuses;
};

export type Buddy = {
  buddyId: string;
  name: string;
  status: BanStatuses;
};

export type Buddies = Record<string, Buddy>;

const mappedStatuses: MappedStatuses = {
  Ban: 'banned',
  Unban: 'ok',
  Delete: 'deleted',
};
const mappedFromApi: MappedStatusesFromApi = {
  banned: 'Banned',
  deleted: 'Deleted',
  ok: 'NotBanned',
};

const toBuddy = ({ id, display_name, status }: ApiBuddy): Buddy => ({
  buddyId: id,
  name: display_name,
  status: status ? mappedFromApi[status] : 'NotBanned',
});

const toBuddies = ({ resources }: t.TypeOf<typeof buddiesType>) =>
  resources.reduce((acc: Buddies, apiBuddy) => {
    const buddy = toBuddy(apiBuddy);

    return { ...acc, [buddy.buddyId]: buddy };
  }, {});

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

const banRequest = (
  buddyId: string,
  accessToken: authApi.AccessToken,
  status: BanActions,
) => {
  return http.put(
    `${config.baseUrl}/users/${accessToken.userId}/contacts/${buddyId}`,
    { status: mappedStatuses[status] },
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

const batchBanRequest = (
  buddyIds: string[],
  accessToken: authApi.AccessToken,
  status: BanActions,
) => {
  const buddies = buddyIds.map(buddyId => {
    return {
      id: buddyId,
      status: mappedStatuses[status],
    };
  });

  return http.patch(
    `${config.baseUrl}/users/${accessToken.userId}/contacts`,
    buddies,
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

export function banBuddy(
  buddyId: string,
  banStatus: BanActions,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddy> {
  return accessToken =>
    http.validateResponse(
      banRequest(buddyId, accessToken, banStatus),
      buddyType,
      toBuddy,
    );
}

export function banBuddies(
  buddyIds: string[],
  banStatus: BanActions,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddies> {
  return accessToken =>
    http.validateResponse(
      batchBanRequest(buddyIds, accessToken, banStatus),
      buddiesType,
      toBuddies,
    );
}
