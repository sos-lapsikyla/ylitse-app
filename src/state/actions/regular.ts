import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as err from '../../lib/http-err';

import * as actionType from '../../lib/action-type';

import * as accountApi from '../../api/account';
import * as mentorApi from '../../api/mentors';
import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as messageApi from '../../api/messages';

function id<A>(): (a: A) => A {
  return a => a;
}

type UnpackTE<TE extends (...args: any[]) => any> = ReturnType<
  TE
> extends TE.TaskEither<infer E, infer A>
  ? E.Either<E, A>
  : never;

export const mentors = {
  ...actionType.make('fetchMentors'),
  ...actionType.make(
    'fetchMentorsCompleted',
    id<E.Either<err.Err, mentorApi.Mentors>>(),
  ),
};

const login = {
  ...actionType.make('login', id<authApi.Credentials>()),
  ...actionType.make(
    'loginCompleted',
    id<E.Either<err.Err, authApi.AccessToken>>(),
  ),

  ...actionType.make('accessTokenAcquired', id<authApi.AccessToken>()),
  ...actionType.make('createUser', id<accountApi.NewUser>()),
  ...actionType.make(
    'createUserCompleted',
    id<E.Either<err.Err, authApi.AccessToken>>(),
  ),
};

const accessToken = {
  ...actionType.make('refreshAccessToken'),
  ...actionType.make(
    'refreshAccessTokenCompleted',
    id<E.Either<err.Err, authApi.AccessToken>>(),
  ),
};

const buddies = {
  ...actionType.make(
    'fetchBuddiesCompleted',
    id<UnpackTE<typeof buddyApi.fetchBuddies>>(),
  ),
};

const messages = {
  ...actionType.make('fetchMessages'),
  ...actionType.make(
    'fetchMessagesCompleted',
    id<UnpackTE<typeof messageApi.fetchMessages>>(),
  ),
};

const sendMessage = {
  ...actionType.make('sendMessage', id<messageApi.SendMessageParams>()),
  sendMessageCompleted: (buddyId: string) => (
    response: UnpackTE<typeof messageApi.sendMessage>,
  ) => ({
    type: 'sendMessageCompleted' as const,
    payload: { buddyId, response },
  }),
};

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export type Creators = typeof creators;
export const creators = {
  ...mentors,
  ...login,
  ...accessToken,
  ...buddies,
  ...messages,
  ...sendMessage,
};
