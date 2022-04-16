import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';

import * as authApi from './auth';
import { PollingParams } from 'src/state/reducers/messages';

type ApiBuddy = t.TypeOf<typeof buddyType>;

export const buddyType = t.intersection([
  t.strict({
    display_name: t.string,
    id: t.string,
  }),
  t.partial({
    status: t.union([
      t.literal('banned'),
      t.literal('deleted'),
      t.literal('ok'),
      t.literal('archived'),
    ]),
  }),
]);

export const buddiesType = t.strict({ resources: t.array(buddyType) });

export type BanAction = 'Ban' | 'Unban' | 'Delete' | 'Archive';
export type BanStatus = 'Banned' | 'NotBanned' | 'Deleted' | 'Archived';

export type Buddy = {
  buddyId: string;
  name: string;
  status: BanStatus;
};

export type Buddies = Record<string, Buddy>;

const toApiBanStatus = {
  Ban: 'banned',
  Unban: 'ok',
  Delete: 'deleted',
  Archive: 'archived',
};

const toBanStatus = {
  banned: 'Banned',
  deleted: 'Deleted',
  ok: 'NotBanned',
  archived: 'Archived',
} as const;

const toBuddy = ({ id, display_name, status = 'ok' }: ApiBuddy): Buddy => ({
  buddyId: id,
  name: display_name,
  status: toBanStatus[status],
});

export const reduceToBuddiesRecord = (buddies: Buddies, apiBuddy: ApiBuddy) => {
  const buddy = toBuddy(apiBuddy);

  return { ...buddies, [buddy.buddyId]: buddy };
};

export const toBuddies = ({ resources }: t.TypeOf<typeof buddiesType>) =>
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
  status: BanAction,
) => {
  return http.put(
    `${config.baseUrl}/users/${accessToken.userId}/contacts/${buddyId}`,
    { status: toApiBanStatus[status] },
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

const batchBanRequest = (
  buddyIds: string[],
  accessToken: authApi.AccessToken,
  status: BanAction,
) => {
  const buddies = buddyIds.map(buddyId => {
    return {
      id: buddyId,
      status: toApiBanStatus[status],
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
  banStatus: BanAction,
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
  banStatus: BanAction,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddies> {
  return accessToken =>
    http.validateResponse(
      batchBanRequest(buddyIds, accessToken, banStatus),
      buddiesType,
      toBuddies,
    );
}

export const createFetchChunks = (
  buddyIds: Array<string>,
): Array<PollingParams> => {
  const chunkSize = 40;
  const amountOfBatches = Math.ceil(buddyIds.length / chunkSize);

  return [...Array(amountOfBatches).keys()]
    .map(index => buddyIds.slice(index * chunkSize, (index + 1) * chunkSize))
    .map(chunks => ({ type: 'InitialMessages', buddyIds: chunks }));
};
