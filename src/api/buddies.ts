import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';

import * as authApi from './auth';
import { PollingParams } from 'src/state/reducers/messages';

type ApiBuddy = t.TypeOf<typeof buddyType>;

const chatStatus = t.keyof({
  banned: null,
  deleted: null,
  ok: null,
  archived: null,
});

export type ChatStatus = t.TypeOf<typeof chatStatus>;
export const buddyType = t.intersection([
  t.strict({
    display_name: t.string,
    id: t.string,
  }),
  t.partial({
    status: chatStatus,
  }),
]);

export const buddiesType = t.strict({ resources: t.array(buddyType) });

export type Buddy = {
  buddyId: string;
  name: string;
  status: ChatStatus;
};

export type Buddies = Record<string, Buddy>;

const toBuddy = ({ id, display_name, status = 'ok' }: ApiBuddy): Buddy => ({
  buddyId: id,
  name: display_name,
  status,
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

const changeChatStatusRequest = (
  buddyId: string,
  accessToken: authApi.AccessToken,
  status: ChatStatus,
) => {
  return http.put(
    `${config.baseUrl}/users/${accessToken.userId}/contacts/${buddyId}`,
    { status },
    {
      headers: authApi.authHeader(accessToken),
    },
  );
};

const changeChatStatusMultipleRequest = (
  buddyIds: string[],
  accessToken: authApi.AccessToken,
  status: ChatStatus,
) => {
  const buddies = buddyIds.map(buddyId => {
    return {
      id: buddyId,
      status,
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

export function changeChatStatus(
  buddyId: string,
  nextStatus: ChatStatus,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddy> {
  return accessToken =>
    http.validateResponse(
      changeChatStatusRequest(buddyId, accessToken, nextStatus),
      buddyType,
      toBuddy,
    );
}

export function changeChatStatusMultiple(
  buddyIds: string[],
  nextStatus: ChatStatus,
): (accessToken: authApi.AccessToken) => TE.TaskEither<string, Buddies> {
  return accessToken =>
    http.validateResponse(
      changeChatStatusMultipleRequest(buddyIds, accessToken, nextStatus),
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
