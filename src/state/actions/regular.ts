import * as actionType from '../../lib/action-type';
import * as future from '../../lib/future';
import * as reduxHelpers from '../../lib/redux-helpers';

import * as mentorApi from '../../api/mentors';
import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as messageApi from '../../api/messages';

function id<A>(): (a: A) => A {
  return a => a;
}

export const mentors = reduxHelpers.makeActionCreators(
  mentorApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);

const accessToken = {
  ...actionType.make('login', id<authApi.AccessToken>()),
  ...actionType.make('refreshAccessToken'),
  ...actionType.make(
    'refreshAccessTokenCompleted',
    id<future.ToResult<ReturnType<typeof authApi.refreshAccessToken>>>(),
  ),
};

const buddies = {
  ...actionType.make(
    'fetchBuddiesCompleted',
    id<future.ToResult<ReturnType<typeof buddyApi.fetchBuddies>>>(),
  ),
};

const messages = {
  ...actionType.make('fetchMessages'),
  ...actionType.make(
    'fetchMessagesCompleted',
    id<future.ToResult<ReturnType<typeof messageApi.fetchMessages>>>(),
  ),
};

const sendMessage = {
  ...actionType.make('sendMessage', id<messageApi.SendMessageParams>()),
  sendMessageCompleted: (buddyId: string) => (
    response: future.ToResult<ReturnType<typeof messageApi.sendMessage>>,
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
  ...accessToken,
  ...buddies,
  ...messages,
  ...sendMessage,
};
