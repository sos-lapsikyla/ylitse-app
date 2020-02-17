import * as reduxLoop from 'redux-loop';

import * as taggedUnion from '../lib/tagged-union';
import * as reduxHelpers from '../lib/redux-helpers';
import * as actionType from '../lib/action-type';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as mentorApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as messageApi from '../api/messages';

export const mentors = reduxHelpers.makeActionCreators(
  mentorApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);

const accessToken = {
  ...actionType.make('login', (token: authApi.AccessToken) => token),
  ...actionType.make('refreshAccessToken'),
  ...actionType.make(
    'refreshAccessTokenCompleted',
    (response: result.Result<authApi.AccessToken, http.Err>) => response,
  ),
};

const buddies = {
  ...actionType.make(
    'fetchBuddiesCompleted',
    (response: result.Result<buddyApi.Buddy[], http.Err>) => response,
  ),
};

const messages = {
  ...actionType.make('fetchMessages'),
  ...actionType.make(
    'fetchMessagesCompleted',
    (response: result.Result<messageApi.Threads, http.Err>) => response,
  ),
};

export type SchedulerAction = actionType.ActionsUnion<
  keyof typeof scheduler,
  typeof scheduler
>;
const scheduler = {
  ...actionType.make('startPolling', (action: NonSchedulerAction, delay) => ({
    action,
    delay,
  })),
  ...actionType.make(
    'poll',
    (actionName: NonSchedulerAction['type']) => actionName,
  ),
  ...actionType.make(
    'pollComplete',
    (actionName: NonSchedulerAction['type']) => actionName,
  ),
};

type NonSchedulerAction = actionType.ActionsUnion<
  keyof typeof _creators,
  typeof _creators
>;
export const _creators = {
  ...mentors,
  ...accessToken,
  ...buddies,
  ...messages,
};

export type Action = SchedulerAction | NonSchedulerAction;
export const creators = {
  ..._creators,
  ...scheduler,
};

export type LS<S> = S | reduxLoop.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;

export function match<S>(state: S, action: Action) {
  return (matchers: Partial<taggedUnion.MatcherRecord<Action, LS<S>>>) =>
    taggedUnion.match<Action, LS<S>>(action, {
      ...matchers,
      default() {
        return state;
      },
    });
}
